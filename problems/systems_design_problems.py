"""
Systems-design coding problems — solutions + tests.

Problem 1: In-memory banking system with timestamp ordering
Problem 2: TTL cache / key-value store with expiry
Problem 3: Request batching dispatcher for a GPU-bound inference service
Problem 4: File deduplication via content hashing
Problem 5: Dependency resolution for update installation (topological sort)
Problem 6: Multi-threaded web crawler
Problem 7: Stack-trace bottleneck finder
Problem 8: Priority + delay message queue with dead-letter queue
Problem 9: Agentic task orchestrator (state machine + retries)

Run: python3 systems_design_problems.py   (asserts; prints ALL TESTS PASSED)
"""
import hashlib
import heapq
import itertools
import json
import tempfile
import threading
import time
from bisect import bisect_left, bisect_right
from collections import Counter, defaultdict, deque
from queue import Empty, Queue


# ---------------------------------------------------------------------------
# Problem 1 — In-memory banking system with timestamp ordering
# ---------------------------------------------------------------------------
# Assumptions:
# - deposit/withdraw arrive in non-decreasing timestamp order (streaming).
# - Balances are integers/cents; no currency conversion.
# Time: O(1) amortized per deposit/withdraw; O(log n + m) per history query
#       (bisect into the append-only per-account timestamp list, m = matches).
# Space: O(n) total across all accounts' histories.

class InsufficientFundsError(Exception):
    pass

SECONDS_PER_DAY = 86400

class BankingSystem:
    def __init__(self):
        self.balances = defaultdict(int)
        self.history = defaultdict(list)            # account_id -> [(ts, kind, amount)]
        self._timestamps = defaultdict(list)          # account_id -> [ts]  (parallel, sorted)
        self.daily_totals = defaultdict(lambda: {"deposits": 0, "withdrawals": 0})

    def _record(self, account_id, timestamp, kind, amount):
        self.history[account_id].append((timestamp, kind, amount))
        self._timestamps[account_id].append(timestamp)
        self.daily_totals[timestamp // SECONDS_PER_DAY][kind + "s"] += amount

    def deposit(self, account_id, amount, timestamp):
        if amount <= 0:
            raise ValueError("deposit amount must be positive")
        self.balances[account_id] += amount
        self._record(account_id, timestamp, "deposit", amount)

    def withdraw(self, account_id, amount, timestamp):
        if amount <= 0:
            raise ValueError("withdraw amount must be positive")
        if self.balances[account_id] - amount < 0:
            raise InsufficientFundsError(
                f"account {account_id} balance {self.balances[account_id]} < withdrawal {amount}"
            )
        self.balances[account_id] -= amount
        self._record(account_id, timestamp, "withdrawal", amount)

    def get_balance(self, account_id):
        return self.balances[account_id]

    def get_transactions(self, account_id, start_ts, end_ts):
        ts_list = self._timestamps[account_id]
        lo = bisect_left(ts_list, start_ts)
        hi = bisect_right(ts_list, end_ts)
        return self.history[account_id][lo:hi]

    def daily_summary(self):
        return {day: dict(totals) for day, totals in self.daily_totals.items()}


# ---------------------------------------------------------------------------
# Problem 2 — TTL cache / key-value store with expiry
# ---------------------------------------------------------------------------
# `now` is an optional injected clock (defaults to time.time()) so tests
# don't depend on real sleeps. Time: O(1) for set/get/delete, O(n) for
# cleanup (every key must be inspected at least once to find expired ones;
# an expiry-ordered min-heap would only help if cleanup needs to stop early).

class TTLCache:
    def __init__(self):
        self._store = {}
        self._expiry = {}

    def set(self, key, value, ttl_seconds, now=None):
        now = time.time() if now is None else now
        self._store[key] = value
        self._expiry[key] = now + ttl_seconds

    def get(self, key, now=None):
        now = time.time() if now is None else now
        if key not in self._store:
            return None
        if now >= self._expiry[key]:
            del self._store[key]
            del self._expiry[key]
            return None
        return self._store[key]

    def delete(self, key):
        self._store.pop(key, None)
        self._expiry.pop(key, None)

    def cleanup(self, now=None):
        now = time.time() if now is None else now
        expired = [k for k, exp in self._expiry.items() if now >= exp]
        for k in expired:
            del self._store[k]
            del self._expiry[k]
        return len(expired)

    def save(self, path, now=None):
        now = time.time() if now is None else now
        self.cleanup(now)
        with open(path, "w") as f:
            json.dump({k: [v, self._expiry[k]] for k, v in self._store.items()}, f)

    @classmethod
    def load(cls, path, now=None):
        now = time.time() if now is None else now
        cache = cls()
        with open(path) as f:
            data = json.load(f)
        for k, (v, exp) in data.items():
            if exp > now:
                cache._store[k] = v
                cache._expiry[k] = exp
        return cache


# ---------------------------------------------------------------------------
# Problem 3 — Request batching dispatcher for a GPU-bound inference service
# ---------------------------------------------------------------------------
# submit() is called per incoming request; it flushes and returns a batch
# once max_batch_size is reached or max_wait_seconds has elapsed since the
# batch started, bounding per-request latency. flush_if_waiting() lets an
# external timer force a flush of a stale partial batch. Optional
# per-API-key rate limiting reuses the Problem-2-style sliding window log.
#
# Monitoring extension (no code — these are metrics, not algorithms): track
# queue depth, batch fill ratio (avg batch size / max_batch_size), and p95
# wait time; feed them back into an autoscaler or into max_wait_seconds
# itself (shrink it under high fill ratio, grow it when batches are mostly
# empty) rather than hand-tuning a static value.

class RateLimitExceeded(Exception):
    pass

class KeyRateLimiter:
    def __init__(self, limit, window):
        self.limit, self.window = limit, window
        self.log = defaultdict(deque)

    def accept(self, key, ts):
        dq = self.log[key]
        while dq and ts - dq[0] >= self.window:
            dq.popleft()
        if len(dq) < self.limit:
            dq.append(ts)
            return True
        return False

class BatchDispatcher:
    def __init__(self, max_batch_size=100, max_wait_seconds=0.05, rate_limiter=None):
        self.max_batch_size = max_batch_size
        self.max_wait_seconds = max_wait_seconds
        self.rate_limiter = rate_limiter
        self._pending = []
        self._batch_start_ts = None

    def submit(self, request, ts, api_key=None):
        if self.rate_limiter is not None and api_key is not None:
            if not self.rate_limiter.accept(api_key, ts):
                raise RateLimitExceeded(f"rate limit exceeded for key {api_key}")

        if self._batch_start_ts is None:
            self._batch_start_ts = ts
        self._pending.append(request)

        if len(self._pending) >= self.max_batch_size:
            return self._flush()
        if ts - self._batch_start_ts >= self.max_wait_seconds:
            return self._flush()
        return None

    def flush_if_waiting(self, now_ts):
        if self._pending and self._batch_start_ts is not None \
                and now_ts - self._batch_start_ts >= self.max_wait_seconds:
            return self._flush()
        return None

    def _flush(self):
        batch, self._pending = self._pending, []
        self._batch_start_ts = None
        return batch


# ---------------------------------------------------------------------------
# Problem 4 — File deduplication via content hashing
# ---------------------------------------------------------------------------
# find_duplicate_files matches the requested in-memory signature
# (path, content_bytes). hash_file_path is the real "handle very large
# files" answer: it streams the file in fixed-size chunks so memory use
# stays O(chunk_size) regardless of file size.

def _hash_bytes_chunked(content_bytes, chunk_size=65536):
    h = hashlib.sha256()
    for i in range(0, len(content_bytes), chunk_size):
        h.update(content_bytes[i:i + chunk_size])
    return h.hexdigest()

def find_duplicate_files(files):
    by_hash = defaultdict(list)
    for path, content in files:
        by_hash[_hash_bytes_chunked(content)].append(path)
    return [paths for paths in by_hash.values() if len(paths) > 1]

def hash_file_path(path, chunk_size=65536):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(chunk_size), b""):
            h.update(chunk)
    return h.hexdigest()

def find_duplicate_files_on_disk(paths, chunk_size=65536):
    by_hash = defaultdict(list)
    for path in paths:
        by_hash[hash_file_path(path, chunk_size)].append(path)
    return [group for group in by_hash.values() if len(group) > 1]

def cleanup_plan(duplicate_groups):
    # Keep the lexicographically-first path in each group as canonical;
    # mark the rest as safe to delete.
    plan = []
    for group in duplicate_groups:
        sorted_group = sorted(group)
        plan.append({"keep": sorted_group[0], "delete": sorted_group[1:]})
    return plan


# ---------------------------------------------------------------------------
# Problem 5 — Update installation order (topological sort) with priority
# ---------------------------------------------------------------------------
# Assumption: every pre/dep referenced in `dependencies` also appears in
# `updates`. Time: O(V + E) for Kahn's algorithm; O((V + E) log V) for the
# priority-ordered variant, which uses a heap instead of a plain queue.

def update_install_order(updates, dependencies):
    graph = defaultdict(list)
    indegree = {u: 0 for u in updates}
    for pre, dep in dependencies:
        graph[pre].append(dep)
        indegree[dep] += 1

    queue = deque(u for u in updates if indegree[u] == 0)
    order = []
    while queue:
        u = queue.popleft()
        order.append(u)
        for v in graph[u]:
            indegree[v] -= 1
            if indegree[v] == 0:
                queue.append(v)

    return order if len(order) == len(updates) else None

def update_install_order_prioritized(updates, dependencies, priority):
    graph = defaultdict(list)
    indegree = {u: 0 for u in updates}
    for pre, dep in dependencies:
        graph[pre].append(dep)
        indegree[dep] += 1

    heap = [(-priority.get(u, 0), u) for u in updates if indegree[u] == 0]
    heapq.heapify(heap)
    order = []
    while heap:
        _, u = heapq.heappop(heap)
        order.append(u)
        for v in graph[u]:
            indegree[v] -= 1
            if indegree[v] == 0:
                heapq.heappush(heap, (-priority.get(v, 0), v))

    return order if len(order) == len(updates) else None

def update_install_order_with_report(updates, dependencies):
    # Returns (order_or_None, cyclic_updates) so an operator dashboard can
    # show exactly which updates are stuck in a cycle instead of a bare
    # failure — feed `cyclic_updates` straight into an alert/log line.
    graph = defaultdict(list)
    indegree = {u: 0 for u in updates}
    for pre, dep in dependencies:
        graph[pre].append(dep)
        indegree[dep] += 1

    queue = deque(u for u in updates if indegree[u] == 0)
    order = []
    while queue:
        u = queue.popleft()
        order.append(u)
        for v in graph[u]:
            indegree[v] -= 1
            if indegree[v] == 0:
                queue.append(v)

    cyclic = set(updates) - set(order)
    return (order if not cyclic else None), cyclic


# ---------------------------------------------------------------------------
# Problem 6 — Multi-threaded web crawler
# ---------------------------------------------------------------------------
# fetch(url) -> html, extract_links(html) -> list[str] are injected (DIP) so
# the crawl logic is testable without real network I/O. Graceful shutdown
# uses Queue's built-in task_done()/join() protocol: join() only returns once
# the frontier is empty AND every dequeued item has been marked done, which
# is exactly "queue empty and all workers idle". Optional per-domain rate
# limiting is dependency-injected via any object exposing .accept(key, ts).

def _domain_of(url):
    return url.split("/")[2] if "://" in url else url

def crawl(start_url, fetch, extract_links, max_pages, max_workers=4, rate_limiter=None):
    visited = set()
    visited_lock = threading.Lock()
    queued = {start_url}
    frontier = Queue()
    frontier.put(start_url)
    stop_event = threading.Event()

    def worker():
        while not stop_event.is_set():
            try:
                url = frontier.get(timeout=0.1)
            except Empty:
                continue
            try:
                with visited_lock:
                    if url in visited or len(visited) >= max_pages:
                        continue
                if rate_limiter is not None:
                    while not rate_limiter.accept(_domain_of(url), time.monotonic()):
                        time.sleep(0.005)
                html = fetch(url)
                with visited_lock:
                    if len(visited) >= max_pages:
                        continue
                    visited.add(url)
                for link in extract_links(html):
                    with visited_lock:
                        room_left = len(visited) < max_pages
                    if room_left and link not in queued:
                        queued.add(link)
                        frontier.put(link)
            finally:
                frontier.task_done()

    threads = [threading.Thread(target=worker, daemon=True) for _ in range(max_workers)]
    for t in threads:
        t.start()
    frontier.join()          # blocks until queue is empty and all tasks marked done
    stop_event.set()
    for t in threads:
        t.join(timeout=1)
    return visited


# ---------------------------------------------------------------------------
# Problem 7 — Stack-trace bottleneck finder
# ---------------------------------------------------------------------------
# samples: [{"timestamp": int, "frames": [outermost, ..., innermost]}, ...]
# Leaf counts approximate "which function is actively executing most often"
# (the classic sampling-profiler heuristic). Appearance counts (once per
# sample, regardless of depth) surface high-level bottlenecks whose *subtree*
# is slow even when they're rarely the leaf themselves.

def find_leaf_bottlenecks(samples, top_n=3):
    leaf_counts = Counter(s["frames"][-1] for s in samples if s["frames"])
    return leaf_counts.most_common(top_n)

def find_high_level_bottlenecks(samples, top_n=3):
    appearance_counts = Counter()
    for s in samples:
        appearance_counts.update(set(s["frames"]))
    return appearance_counts.most_common(top_n)


# ---------------------------------------------------------------------------
# Problem 8 — Priority + delay message queue with dead-letter queue
# ---------------------------------------------------------------------------
# Two heaps: `_pending` (min-heap by delay_until) holds not-yet-visible
# messages; `_visible` (max-heap by priority) holds ones ready to dequeue.
# Each dequeue first promotes any now-visible pending messages. Amortized
# O(log n) per enqueue/dequeue.
#
# Distributed extension (discussion, not code): moving this to Kafka would
# mean partitioning by key for ordering within a partition, using per-message
# delivery timestamps or a delay-topic pattern for `delay_until`, and
# consumer-group offsets in place of in-process visibility tracking —
# priority ordering across partitions would need to move into the consumer.

class DeadLetterQueue:
    def __init__(self):
        self.items = []

    def add(self, message, reason):
        self.items.append({"message": message, "reason": reason})

class PriorityDelayQueue:
    def __init__(self, dead_letter_queue=None):
        self._pending = []
        self._visible = []
        self._counter = itertools.count()
        self.dead_letter = dead_letter_queue or DeadLetterQueue()

    def enqueue(self, message, priority, delay_until):
        seq = next(self._counter)
        heapq.heappush(self._pending, (delay_until, seq, priority, message))

    def _promote_ready(self, now):
        while self._pending and self._pending[0][0] <= now:
            delay_until, seq, priority, message = heapq.heappop(self._pending)
            heapq.heappush(self._visible, (-priority, seq, message))

    def dequeue(self, now):
        self._promote_ready(now)
        if not self._visible:
            return None
        _, _, message = heapq.heappop(self._visible)
        return message

    def fail(self, message, reason):
        self.dead_letter.add(message, reason)


# ---------------------------------------------------------------------------
# Problem 9 — Agentic task orchestrator (state machine + retries)
# ---------------------------------------------------------------------------
# Tools (read_sensor_data, run_diagnostic, schedule_service) and the
# is_anomalous/is_serious predicates are all injected (DIP) so the state
# machine is testable without real hardware. Transient ToolError failures
# are retried up to max_retries times per step; on_step is an optional
# telemetry hook fired after every state transition (for eval success-rate /
# step-count tracking).

class ToolError(Exception):
    pass

def diagnostic_agent(vehicle_id, read_sensor_data, run_diagnostic, schedule_service,
                      is_anomalous, is_serious, max_retries=2, on_step=None):
    report = {"vehicle_id": vehicle_id, "steps": []}

    def emit(state, **fields):
        step = {"state": state, **fields}
        report["steps"].append(step)
        if on_step:
            on_step(step)

    def call_with_retry(state, fn, *args):
        last_err = None
        for attempt in range(max_retries + 1):
            try:
                return fn(*args)
            except ToolError as e:
                last_err = e
                emit(state, attempt=attempt, error=str(e))
        raise last_err

    sensor_data = call_with_retry("READ", read_sensor_data, vehicle_id)
    emit("READ", result=sensor_data)

    if not is_anomalous(sensor_data):
        report["outcome"] = "healthy"
        emit("DONE")
        return report

    diagnosis = call_with_retry("DIAGNOSE", run_diagnostic, vehicle_id)
    emit("DIAGNOSE", result=diagnosis)

    if not is_serious(diagnosis):
        report["outcome"] = "minor_issue"
        emit("DONE")
        return report

    confirmation = call_with_retry("SCHEDULE", schedule_service, vehicle_id)
    emit("SCHEDULE", result=confirmation)
    report["outcome"] = "service_scheduled"
    emit("DONE")
    return report


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------
def test_banking():
    bank = BankingSystem()
    bank.deposit("a1", 100, 0)
    bank.deposit("a1", 50, 10)
    bank.withdraw("a1", 30, 20)
    assert bank.get_balance("a1") == 120

    try:
        bank.withdraw("a1", 1000, 30)
        assert False, "expected InsufficientFundsError"
    except InsufficientFundsError:
        pass

    txs = bank.get_transactions("a1", 5, 20)
    assert [t[1] for t in txs] == ["deposit", "withdrawal"]

    summary = bank.daily_summary()
    assert summary[0] == {"deposits": 150, "withdrawals": 30}

def test_ttl_cache():
    cache = TTLCache()
    cache.set("k1", "v1", ttl_seconds=10, now=0)
    assert cache.get("k1", now=5) == "v1"
    assert cache.get("k1", now=10) is None            # expired exactly at boundary

    cache.set("k2", "v2", ttl_seconds=10, now=0)
    cache.set("k3", "v3", ttl_seconds=100, now=0)
    removed = cache.cleanup(now=10)
    assert removed == 1                                 # only k2 (k1 already deleted by get)
    assert cache.get("k3", now=10) == "v3"

    cache.delete("k3")
    assert cache.get("k3", now=10) is None

    with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as f:
        path = f.name
    cache2 = TTLCache()
    cache2.set("persist", "value", ttl_seconds=100, now=0)
    cache2.set("gone", "value", ttl_seconds=5, now=0)
    cache2.save(path, now=10)                            # "gone" already expired at save time
    reloaded = TTLCache.load(path, now=10)
    assert reloaded.get("persist", now=10) == "value"
    assert reloaded.get("gone", now=10) is None

def test_batch_dispatcher():
    dispatcher = BatchDispatcher(max_batch_size=3, max_wait_seconds=0.05)
    assert dispatcher.submit("r1", ts=0.0) is None
    assert dispatcher.submit("r2", ts=0.01) is None
    batch = dispatcher.submit("r3", ts=0.02)              # hits max_batch_size
    assert batch == ["r1", "r2", "r3"]

    assert dispatcher.submit("r4", ts=1.0) is None
    batch2 = dispatcher.submit("r5", ts=1.06)              # exceeds max_wait_seconds
    assert batch2 == ["r4", "r5"]

    limiter = KeyRateLimiter(limit=1, window=10)
    limited = BatchDispatcher(max_batch_size=10, max_wait_seconds=10, rate_limiter=limiter)
    limited.submit("r1", ts=0, api_key="key1")
    try:
        limited.submit("r2", ts=1, api_key="key1")
        assert False, "expected RateLimitExceeded"
    except RateLimitExceeded:
        pass

def test_file_dedup():
    files = [
        ("/a.txt", b"hello world"),
        ("/b.txt", b"hello world"),
        ("/c.txt", b"different"),
        ("/d.txt", b"hello world"),
    ]
    groups = find_duplicate_files(files)
    assert len(groups) == 1
    assert sorted(groups[0]) == ["/a.txt", "/b.txt", "/d.txt"]

    plan = cleanup_plan(groups)
    assert plan == [{"keep": "/a.txt", "delete": ["/b.txt", "/d.txt"]}]

    with tempfile.NamedTemporaryFile(delete=False) as f1, tempfile.NamedTemporaryFile(delete=False) as f2:
        f1.write(b"same content")
        f2.write(b"same content")
        path1, path2 = f1.name, f2.name
    on_disk_groups = find_duplicate_files_on_disk([path1, path2])
    assert on_disk_groups == [[path1, path2]] or on_disk_groups == [[path2, path1]]

def test_topo_sort():
    updates = ["A", "B", "C", "D"]
    deps = [("A", "B"), ("A", "C"), ("B", "D"), ("C", "D")]
    order = update_install_order(updates, deps)
    assert order.index("A") < order.index("B") < order.index("D")
    assert order.index("A") < order.index("C") < order.index("D")

    cyclic = [("A", "B"), ("B", "A")]
    assert update_install_order(["A", "B"], cyclic) is None

    prioritized = update_install_order_prioritized(
        ["A", "B", "C"], [("A", "C"), ("B", "C")], priority={"A": 1, "B": 5, "C": 0}
    )
    assert prioritized[0] == "B"                          # higher priority among available (A,B) goes first

    order2, cyclic_set = update_install_order_with_report(["A", "B"], cyclic)
    assert order2 is None and cyclic_set == {"A", "B"}
    order3, cyclic_set3 = update_install_order_with_report(updates, deps)
    assert order3 is not None and cyclic_set3 == set()

def test_crawler():
    graph = {
        "http://x.com/1": (["http://x.com/2", "http://x.com/3"], "html1"),
        "http://x.com/2": (["http://x.com/3", "http://x.com/4"], "html2"),
        "http://x.com/3": ([], "html3"),
        "http://x.com/4": ([], "html4"),
    }

    def fetch(url):
        return graph[url][1]

    def extract_links(html):
        for url, (links, page) in graph.items():
            if page == html:
                return links
        return []

    visited = crawl("http://x.com/1", fetch, extract_links, max_pages=10, max_workers=3)
    assert visited == set(graph.keys())

    limiter = KeyRateLimiter(limit=100, window=1)          # generous limit, just exercises the wiring
    visited2 = crawl("http://x.com/1", fetch, extract_links, max_pages=10, max_workers=3, rate_limiter=limiter)
    assert visited2 == set(graph.keys())

    visited3 = crawl("http://x.com/1", fetch, extract_links, max_pages=2, max_workers=3)
    assert len(visited3) <= 2

def test_stack_trace():
    samples = [
        {"timestamp": 0, "frames": ["main", "handle_request", "db_query"]},
        {"timestamp": 1, "frames": ["main", "handle_request", "db_query"]},
        {"timestamp": 2, "frames": ["main", "handle_request", "render"]},
        {"timestamp": 3, "frames": ["main", "background_job"]},
    ]
    leaves = find_leaf_bottlenecks(samples, top_n=2)
    assert leaves[0] == ("db_query", 2)

    high_level = find_high_level_bottlenecks(samples, top_n=1)
    assert high_level[0] == ("main", 4)                    # appears in every sample

def test_priority_delay_queue():
    q = PriorityDelayQueue()
    q.enqueue("low", priority=1, delay_until=0)
    q.enqueue("high", priority=5, delay_until=0)
    q.enqueue("future", priority=10, delay_until=100)

    assert q.dequeue(now=0) == "high"
    assert q.dequeue(now=0) == "low"
    assert q.dequeue(now=0) is None                        # "future" not visible yet
    assert q.dequeue(now=100) == "future"

    q.fail("bad message", reason="handler crashed")
    assert q.dead_letter.items == [{"message": "bad message", "reason": "handler crashed"}]

def test_diagnostic_agent():
    telemetry = []

    def healthy_sensors(vid):
        return {"anomaly": False}

    report = diagnostic_agent(
        "v1", healthy_sensors, lambda v: None, lambda v: None,
        is_anomalous=lambda d: d["anomaly"], is_serious=lambda d: False,
        on_step=telemetry.append,
    )
    assert report["outcome"] == "healthy"
    assert any(s["state"] == "DONE" for s in telemetry)

    calls = {"n": 0}
    def flaky_sensors(vid):
        calls["n"] += 1
        if calls["n"] < 2:
            raise ToolError("transient sensor timeout")
        return {"anomaly": True}

    report2 = diagnostic_agent(
        "v2", flaky_sensors, lambda v: {"serious": True}, lambda v: "scheduled",
        is_anomalous=lambda d: d["anomaly"], is_serious=lambda d: d["serious"],
        max_retries=2,
    )
    assert report2["outcome"] == "service_scheduled"
    assert calls["n"] == 2                                  # failed once, succeeded on retry

    def always_fails(vid):
        raise ToolError("permanently down")

    try:
        diagnostic_agent(
            "v3", always_fails, lambda v: None, lambda v: None,
            is_anomalous=lambda d: True, is_serious=lambda d: True, max_retries=1,
        )
        assert False, "expected ToolError to propagate after exhausting retries"
    except ToolError:
        pass


if __name__ == "__main__":
    test_banking()
    test_ttl_cache()
    test_batch_dispatcher()
    test_file_dedup()
    test_topo_sort()
    test_crawler()
    test_stack_trace()
    test_priority_delay_queue()
    test_diagnostic_agent()
    print("ALL TESTS PASSED")
