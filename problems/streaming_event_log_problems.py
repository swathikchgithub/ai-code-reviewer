"""
Streaming / event-log coding problems — solutions + tests.

Problem 1: Fault burst detection                (sliding window per key)
Problem 2: Per-key event rate limiter            (sliding window log)
Problem 3: Longest healthy stretch (<= k WARNs)  (variable sliding window)
Problem 4: Top-K noisiest keys in last W secs    (window + counter + heap)
Problem 5: Reorder a bounded-delay event stream  (min-heap buffer)
Problem 6: Total online time from intervals      (interval merge)
Problem 7: Severity-weighted anomaly detector    (sliding window, weighted threshold)
Problem 8: Rolling success rate / p95 latency    (sliding window order statistics)
Problem 9: Duplicate action detection            (sliding window keyed by (id, action))

Run: python3 streaming_event_log_problems.py   (asserts; prints ALL TESTS PASSED)
"""
from bisect import insort, bisect_left
from collections import deque, defaultdict, Counter
import heapq


# ---------------------------------------------------------------------------
# Problem 1 — Fault burst detection
# ---------------------------------------------------------------------------
# Assumptions:
# - events: iterable of (key: str, timestamp: int, event_type: str),
#   globally non-decreasing by timestamp.
# - A "window of length W" is a closed interval [t-W, t]: two faults exactly
#   W apart count as being in one window.
# - Time O(n): each fault timestamp is appended/popped at most once.
# - Space O(K * fault_threshold): deque per key is capped — once a key
#   is flagged we stop tracking it, and a deque never needs to exceed
#   `fault_threshold` entries.

def keys_with_fault_bursts(events, window_seconds, fault_threshold):
    if fault_threshold <= 0:
        return {k for k, _, _ in events}           # trivially satisfied
    flagged = set()
    faults = defaultdict(deque)                     # key -> fault timestamps in window
    for key, ts, event_type in events:
        if event_type != "FAULT" or key in flagged:
            continue
        dq = faults[key]
        dq.append(ts)
        while dq and ts - dq[0] > window_seconds:   # evict out-of-window faults
            dq.popleft()
        if len(dq) >= fault_threshold:
            flagged.add(key)
            del faults[key]                         # free memory; done tracking
    return flagged


# ---------------------------------------------------------------------------
# Problem 2 — Per-key rate limiter
# ---------------------------------------------------------------------------
# Streaming API: accept(key, ts) -> bool. Allow at most `limit`
# accepted events per key in any sliding `window` seconds.
# O(1) amortized per call.

class RateLimiter:
    def __init__(self, limit, window):
        self.limit, self.window = limit, window
        self.log = defaultdict(deque)               # accepted timestamps per key

    def accept(self, key, ts):
        dq = self.log[key]
        while dq and ts - dq[0] >= self.window:     # half-open window [ts-W, ts)
            dq.popleft()
        if len(dq) < self.limit:
            dq.append(ts)
            return True
        return False


# ---------------------------------------------------------------------------
# Problem 3 — Longest healthy stretch with at most k WARNs (single key)
# ---------------------------------------------------------------------------
# Given one key's events (time-sorted), return the max length in seconds
# of a time span [events[l].ts, events[r].ts] containing <= k WARN events
# and zero FAULT events. Classic variable sliding window, O(n).

def longest_healthy_stretch(events, k):
    best = 0
    left = 0
    warns = 0
    for right, (ts, etype) in enumerate(events):
        if etype == "FAULT":
            left = right + 1                        # window can't contain a FAULT
            warns = 0
            continue
        if etype == "WARN":
            warns += 1
        while warns > k:                            # shrink until valid
            if events[left][1] == "WARN":
                warns -= 1
            left += 1
        if left <= right:
            best = max(best, events[right][0] - events[left][0])
    return best


# ---------------------------------------------------------------------------
# Problem 4 — Top-K keys by fault count in the last W seconds
# ---------------------------------------------------------------------------
# Streaming: process time-sorted fault events; query(ts) returns the k
# keys with most faults in [ts - W, ts]. Counter kept incrementally;
# query is O(K log k) via heapq.nlargest (fine when queries are rare).

class TopKFaults:
    def __init__(self, window, k):
        self.window, self.k = window, k
        self.events = deque()                       # (ts, key)
        self.counts = Counter()

    def add_fault(self, key, ts):
        self.events.append((ts, key))
        self.counts[key] += 1
        self._evict(ts)

    def _evict(self, now):
        while self.events and now - self.events[0][0] > self.window:
            _, k = self.events.popleft()
            self.counts[k] -= 1
            if self.counts[k] == 0:
                del self.counts[k]

    def query(self, now):
        self._evict(now)
        return heapq.nlargest(self.k, self.counts.items(), key=lambda kv: (kv[1], kv[0]))


# ---------------------------------------------------------------------------
# Problem 5 — Reorder a bounded-delay stream
# ---------------------------------------------------------------------------
# Events arrive at most `max_delay` seconds out of order. Emit them in true
# timestamp order with minimal buffering. Min-heap: safe to emit anything
# with ts <= newest_seen - max_delay. O(n log b), b = buffer size.

def reorder_stream(events, max_delay):
    heap, out = [], []
    newest = float("-inf")
    for ev in events:                               # ev = (ts, payload)
        heapq.heappush(heap, ev)
        newest = max(newest, ev[0])
        while heap and heap[0][0] <= newest - max_delay:
            out.append(heapq.heappop(heap))
    while heap:
        out.append(heapq.heappop(heap))
    return out


# ---------------------------------------------------------------------------
# Problem 6 — Total online time from connectivity intervals
# ---------------------------------------------------------------------------
# Given per-key (start, end) connectivity intervals (unsorted, may
# overlap), return total seconds the key was online. Sort + merge,
# O(n log n).

def total_online_time(intervals):
    if not intervals:
        return 0
    intervals = sorted(intervals)
    total = 0
    cur_start, cur_end = intervals[0]
    for s, e in intervals[1:]:
        if s <= cur_end:
            cur_end = max(cur_end, e)
        else:
            total += cur_end - cur_start
            cur_start, cur_end = s, e
    return total + (cur_end - cur_start)


# ---------------------------------------------------------------------------
# Problem 7 — Severity-weighted anomaly detector (extension of Problem 1)
# ---------------------------------------------------------------------------
# Instead of a raw ERROR count, each level carries a severity weight; a key
# is flagged the first time the sum of weights in any W-second window exceeds
# `severity_threshold`. Same sliding-window-per-key shape as Problem 1,
# O(n) time, O(K * max window occupancy) space.

DEFAULT_SEVERITY = {"ERROR": 2, "WARN": 1, "INFO": 0}

def keys_over_severity_threshold(events, window_seconds, severity_threshold,
                                  severity=None):
    severity = severity or DEFAULT_SEVERITY
    flagged = set()
    window = defaultdict(deque)                     # key -> deque[(ts, weight)]
    running = defaultdict(int)                       # key -> current window weight sum

    for key, ts, level in events:
        w = severity.get(level, 0)
        if w == 0 or key in flagged:
            continue
        dq = window[key]
        dq.append((ts, w))
        running[key] += w
        while dq and ts - dq[0][0] > window_seconds:
            _, old_w = dq.popleft()
            running[key] -= old_w
        if running[key] > severity_threshold:
            flagged.add(key)
            del window[key]
            del running[key]
    return flagged


# ---------------------------------------------------------------------------
# Problem 8 — Rolling success rate / p95 latency over eval events
# ---------------------------------------------------------------------------
# events: list of {"task_id", "timestamp", "latency_ms", "success"}, sorted
# by timestamp. For every event's timestamp t, compute the metric over the
# trailing window [t - window_seconds, t].
#
# Time:  O(n log n) — each event enters/leaves a sorted latency structure
#        once; bisect insert/remove on a list is O(n) worst case, so this is
#        O(n^2) worst case in Python's list-based bisect. For production
#        scale, replace the sorted list with an order-statistics tree /
#        Fenwick tree over bucketed latencies to get true O(n log n).
# Space: O(w) where w = max events in any window.

def rolling_success_rate(events, window_seconds):
    out = []
    dq = deque()                                     # (ts, success)
    successes = 0
    for ts, success in ((e["timestamp"], e["success"]) for e in events):
        dq.append((ts, success))
        successes += 1 if success else 0
        while dq and ts - dq[0][0] > window_seconds:
            _, old_success = dq.popleft()
            successes -= 1 if old_success else 0
        out.append(successes / len(dq))
    return out

def rolling_p95_latency(events, window_seconds):
    out = []
    dq = deque()                                      # (ts, latency)
    sorted_latencies = []                              # kept sorted for order statistics
    for ts, latency in ((e["timestamp"], e["latency_ms"]) for e in events):
        dq.append((ts, latency))
        insort(sorted_latencies, latency)
        while dq and ts - dq[0][0] > window_seconds:
            _, old_latency = dq.popleft()
            i = bisect_left(sorted_latencies, old_latency)
            sorted_latencies.pop(i)
        idx = max(0, int(round(0.95 * (len(sorted_latencies) - 1))))
        out.append(sorted_latencies[idx])
    return out


# ---------------------------------------------------------------------------
# Problem 9 — Duplicate action detection
# ---------------------------------------------------------------------------
# events: (user_id, timestamp, action), globally non-decreasing by timestamp.
# Returns the set of (user_id, action) pairs that repeat within W seconds of
# a prior occurrence of the same pair at least once. Sliding window keyed by
# the composite (user_id, action), O(n) time.

def duplicate_actions(events, window_seconds):
    flagged = set()
    last_seen = {}                                     # (user_id, action) -> most recent ts
    for user_id, ts, action in events:
        key = (user_id, action)
        if key in last_seen and ts - last_seen[key] <= window_seconds:
            flagged.add(key)
        last_seen[key] = ts
    return flagged


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------
def test_p1():
    E = [
        ("v1", 0, "FAULT"), ("v2", 1, "OK"), ("v1", 5, "FAULT"),
        ("v2", 6, "FAULT"), ("v1", 9, "FAULT"),          # v1: 3 faults in 9s
        ("v2", 100, "FAULT"), ("v2", 205, "FAULT"),      # v2: never 3 in 10s
        ("v3", 300, "WARN"),
    ]
    assert keys_with_fault_bursts(E, 10, 3) == {"v1"}
    # v2 faults at 6, 100, 205 -> never 2 within any 10s window
    assert keys_with_fault_bursts(E, 10, 2) == {"v1"}
    assert keys_with_fault_bursts(E, 200, 2) == {"v1", "v2"}  # 100 & 205 within 200s

def test_p1_strict():
    E = [("a", 0, "FAULT"), ("a", 10, "FAULT")]
    assert keys_with_fault_bursts(E, 10, 2) == {"a"}   # closed window: exactly W apart counts
    assert keys_with_fault_bursts(E, 9, 2) == set()
    assert keys_with_fault_bursts([], 10, 1) == set()
    # threshold 1: any single fault
    assert keys_with_fault_bursts([("b", 5, "FAULT")], 1, 1) == {"b"}
    # equal timestamps
    E2 = [("c", 7, "FAULT"), ("c", 7, "FAULT"), ("c", 7, "FAULT")]
    assert keys_with_fault_bursts(E2, 0, 3) == {"c"}

def test_p2():
    rl = RateLimiter(limit=2, window=10)
    assert rl.accept("v", 0) and rl.accept("v", 5)
    assert not rl.accept("v", 9)            # 2 already in [−1, 9)... window [ -1,9): 0,5 -> full
    assert rl.accept("v", 10)               # 0 expired
    assert rl.accept("x", 9)                # independent per key

def test_p3():
    ev = [(0, "OK"), (5, "WARN"), (8, "OK"), (12, "WARN"), (20, "OK")]
    assert longest_healthy_stretch(ev, 2) == 20
    assert longest_healthy_stretch(ev, 1) == 12   # [8..20] has 1 warn -> 12
    ev2 = [(0, "OK"), (3, "FAULT"), (4, "OK"), (9, "OK")]
    assert longest_healthy_stretch(ev2, 0) == 5   # [4,9]

def test_p4():
    tk = TopKFaults(window=10, k=2)
    tk.add_fault("a", 0); tk.add_fault("b", 1); tk.add_fault("a", 2)
    assert [v for v, _ in tk.query(2)] == ["a", "b"]
    assert sorted(v for v, _ in tk.query(11)) == ["a", "b"]   # ts0 evicted; a:1, b:1
    assert tk.query(50) == []

def test_p5():
    ev = [(3, "c"), (1, "a"), (2, "b"), (6, "d"), (5, "e")]
    assert [t for t, _ in reorder_stream(ev, 3)] == [1, 2, 3, 5, 6]

def test_p6():
    assert total_online_time([(0, 10), (5, 15), (20, 25)]) == 20
    assert total_online_time([]) == 0
    assert total_online_time([(3, 7)]) == 4

def test_p7():
    E = [("a", 0, "WARN"), ("a", 1, "WARN"), ("a", 2, "WARN")]   # 3 WARNs = weight 3
    assert keys_over_severity_threshold(E, 10, 3) == set()       # not > 3
    assert keys_over_severity_threshold(E, 10, 2) == {"a"}       # 3 > 2
    E2 = [("b", 0, "ERROR"), ("b", 1, "INFO"), ("b", 20, "ERROR")]
    assert keys_over_severity_threshold(E2, 5, 1) == {"b"}       # single ERROR weight 2 > 1
    assert keys_over_severity_threshold(E2, 5, 5, {"ERROR": 2, "WARN": 1, "INFO": 0}) == set()

def test_p8():
    events = [
        {"task_id": "t1", "timestamp": 0, "latency_ms": 100, "success": True},
        {"task_id": "t2", "timestamp": 1, "latency_ms": 200, "success": False},
        {"task_id": "t3", "timestamp": 2, "latency_ms": 300, "success": True},
    ]
    rates = rolling_success_rate(events, window_seconds=10)
    assert rates == [1.0, 0.5, 2 / 3]
    p95 = rolling_p95_latency(events, window_seconds=10)
    assert p95 == [100, 200, 300]                                 # window grows, p95 = max so far here
    late = [
        {"task_id": "t1", "timestamp": 0, "latency_ms": 100, "success": True},
        {"task_id": "t2", "timestamp": 100, "latency_ms": 500, "success": True},
    ]
    assert rolling_success_rate(late, window_seconds=10) == [1.0, 1.0]
    assert rolling_p95_latency(late, window_seconds=10) == [100, 500]   # t1 aged out of t2's window

def test_p9():
    E = [
        ("u1", 0, "CLICK"), ("u1", 5, "CLICK"),      # duplicate within 5s
        ("u2", 0, "RESET_PASSWORD"), ("u2", 100, "RESET_PASSWORD"),  # far apart, not flagged
        ("u1", 6, "SCROLL"),
    ]
    assert duplicate_actions(E, window_seconds=5) == {("u1", "CLICK")}
    assert duplicate_actions(E, window_seconds=100) == {("u1", "CLICK"), ("u2", "RESET_PASSWORD")}
    assert duplicate_actions([], window_seconds=10) == set()


if __name__ == "__main__":
    test_p1(); test_p1_strict(); test_p2(); test_p3(); test_p4(); test_p5(); test_p6()
    test_p7(); test_p8(); test_p9()
    print("ALL TESTS PASSED")
