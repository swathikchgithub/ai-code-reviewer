export type ExampleLanguage = 'javascript' | 'typescript' | 'python' | 'go' | 'rust';

export interface ExamplePreset {
  id: string;
  title: string;
  category:
    | 'Arrays & Sliding Window'
    | 'HashMap & Frequency'
    | 'Graphs & BFS/DFS'
    | 'Trees'
    | 'Dynamic Programming'
    | 'Stack & Queue'
    | 'Binary Search'
    | 'Linked Lists'
    | 'ML & System Design'
    | 'ML Engineering & LLM Infra'
    | 'Streaming & Event Processing'
    | 'Systems Design & Concurrency';
  language: ExampleLanguage;
  code: string;
  // Optional additional language versions of this same problem, keyed by language.
  // `language`/`code` above remain the default shown when the problem is selected.
  variants?: Partial<Record<ExampleLanguage, string>>;
}

export const EXAMPLES: ExamplePreset[] = [
  // ==========================================
  // CATEGORY 1: ARRAYS & SLIDING WINDOW
  // ==========================================
  {
    id: 'c1-max-sum-subarray-k',
    title: '1. Max Sum Subarray of Size K',
    category: 'Arrays & Sliding Window',
    language: 'javascript',
    code: `// 1. Maximum Sum Subarray of Size K
// Bug: Recalculates sum of window from scratch O(N*K) instead of O(N) sliding window.
// Bug 2: Off-by-one error on loop condition i <= arr.length - k.

function maxSumSubarrayK(arr, k) {
  let maxSum = 0;
  
  // Bug 1: Loop stops early before checking last window
  for (let i = 0; i < arr.length - k; i++) {
    let currentSum = 0;
    // Bug 2: Recomputing sum of elements every time (O(N*K) complexity)
    for (let j = i; j < i + k; j++) {
      currentSum += arr[j];
    }
    if (currentSum > maxSum) {
      maxSum = currentSum;
    }
  }
  return maxSum;
}

// Example test:
console.log(maxSumSubarrayK([2, 1, 5, 1, 3, 2], 3)); // Expected: 9 (5+1+3)`,
    variants: {
      python: `# 1. Maximum Sum Subarray of Size K
# Bug: Recalculates the sum of the window from scratch every time -> O(N*K) instead of O(N) sliding window.
# Bug 2: Off-by-one loop bound skips checking the last window.

def max_sum_subarray_k(arr, k):
    max_sum = 0

    # Bug 1: Loop stops early before checking the last window
    for i in range(len(arr) - k):
        current_sum = 0
        # Bug 2: Recomputes the sum of elements every time (O(N*K) complexity)
        for j in range(i, i + k):
            current_sum += arr[j]
        if current_sum > max_sum:
            max_sum = current_sum

    return max_sum


print(max_sum_subarray_k([2, 1, 5, 1, 3, 2], 3))  # Expected: 9 (5+1+3)`
    }
  },
  {
    id: 'c1-min-sum-subarray-k',
    title: '2. Minimum Sum Subarray of Size K',
    category: 'Arrays & Sliding Window',
    language: 'python',
    code: `# 2. Minimum Sum Subarray of Size K
# Bug: Initialized min_sum to 0 instead of infinity.
# Bug 2: Window slide subtraction subtracts wrong index element.

def min_sum_subarray_k(arr, k):
    if len(arr) < k:
        return 0
        
    # Bug 1: Should be float('inf') or sum of first window
    min_sum = 0 
    window_sum = sum(arr[:k])
    
    for i in range(k, len(arr)):
        # Bug 2: Subtracts arr[i] instead of arr[i - k]
        window_sum += arr[i] - arr[i] 
        min_sum = min(min_sum, window_sum)
        
    return min_sum

print(min_sum_subarray_k([2, 1, 5, 1, 3, 2], 3))`
  },
  {
    id: 'c1-first-negative-window',
    title: '3. First Negative in Every Window of Size K',
    category: 'Arrays & Sliding Window',
    language: 'typescript',
    code: `// 3. First Negative Integer in Every Window of Size K
// Bug: Fails to evict negative numbers that fall out of the current sliding window.

function firstNegativeInWindow(arr: number[], k: number): number[] {
  const result: number[] = [];
  const negativesQueue: number[] = [];

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < 0) {
      negativesQueue.push(arr[i]);
    }

    if (i >= k - 1) {
      // Bug: Does not check if the front negative element is outside current window range!
      if (negativesQueue.length > 0) {
        result.push(negativesQueue[0]);
      } else {
        result.push(0);
      }
    }
  }

  return result;
}

console.log(firstNegativeInWindow([12, -1, -7, 8, -15, 30, 16, 28], 3));`,
    variants: {
      python: `# 3. First Negative Integer in Every Window of Size K
# Bug: Never evicts negative numbers that have fallen outside the current window.

def first_negative_in_window(arr, k):
    result = []
    negatives_queue = []

    for i in range(len(arr)):
        if arr[i] < 0:
            negatives_queue.append(arr[i])

        if i >= k - 1:
            # Bug: Doesn't check whether the front negative is outside the current window range!
            if negatives_queue:
                result.append(negatives_queue[0])
            else:
                result.append(0)

    return result


print(first_negative_in_window([12, -1, -7, 8, -15, 30, 16, 28], 3))`
    }
  },
  {
    id: 'c1-longest-substring-no-repeat',
    title: '4. Longest Substring Without Repeating Characters',
    category: 'Arrays & Sliding Window',
    language: 'typescript',
    code: `// 4. Longest Substring Without Repeating Characters
// Bug: Window left pointer moves backward when duplicate character was seen outside current window.

function lengthOfLongestSubstring(s: string): number {
  let maxLength = 0;
  let left = 0;
  const charMap = new Map<string, number>();

  for (let right = 0; right < s.length; right++) {
    const currentChar = s[right];

    if (charMap.has(currentChar)) {
      // Bug: Missing Math.max(left, charMap.get(currentChar)! + 1)
      left = charMap.get(currentChar)! + 1;
    }

    charMap.set(currentChar, right);
    maxLength = Math.max(maxLength, right - left); // Bug: Should be right - left + 1
  }

  return maxLength;
}

console.log(lengthOfLongestSubstring("abba"));`,
    variants: {
      python: `# 4. Longest Substring Without Repeating Characters
# Bug: The window's left pointer can move backward when a duplicate was last seen outside the current window.

def length_of_longest_substring(s):
    max_length = 0
    left = 0
    char_map = {}

    for right in range(len(s)):
        current_char = s[right]

        if current_char in char_map:
            # Bug: Missing max(left, char_map[current_char] + 1)
            left = char_map[current_char] + 1

        char_map[current_char] = right
        max_length = max(max_length, right - left)  # Bug: Should be right - left + 1

    return max_length


print(length_of_longest_substring("abba"))`
    }
  },
  {
    id: 'c1-longest-substring-k-distinct',
    title: '5. Longest Substring with K Distinct Characters',
    category: 'Arrays & Sliding Window',
    language: 'python',
    code: `# 5. Longest Substring with K Distinct Characters
# Bug: Fails to decrement or delete characters from frequency map when shrinking window.

def longest_k_distinct(s: str, k: int) -> int:
    char_freq = {}
    max_len = 0
    left = 0

    for right in range(len(s)):
        char = s[right]
        char_freq[char] = char_freq.get(char, 0) + 1

        while len(char_freq) > k:
            left_char = s[left]
            # Bug: Shrinks left pointer but does not decrement char_freq[left_char]
            left += 1 

        max_len = max(max_len, right - left + 1)

    return max_len

print(longest_k_distinct("eceba", 2))`
  },
  {
    id: 'c1-max-window-k',
    title: '6. Maximum of Every Window of Size K',
    category: 'Arrays & Sliding Window',
    language: 'javascript',
    code: `// 6. Maximum of Every Window of Size K (Sliding Window Maximum)
// Bug: Inefficient O(N*K) using Math.max(...slice) on every iteration.

function maxSlidingWindow(nums, k) {
  const result = [];
  
  for (let i = 0; i <= nums.length - k; i++) {
    // Bug: O(K) slice + Math.max creation per window -> O(N*K) time complexity
    const window = nums.slice(i, i + k);
    result.push(Math.max(...window));
  }
  
  return result;
}

console.log(maxSlidingWindow([1,3,-1,-3,5,3,6,7], 3));`,
    variants: {
      python: `# 6. Maximum of Every Window of Size K (Sliding Window Maximum)
# Bug: Inefficient O(N*K) — recomputes max() over a fresh slice on every iteration.

def max_sliding_window(nums, k):
    result = []

    for i in range(len(nums) - k + 1):
        # Bug: O(K) slice + max() per window -> O(N*K) time complexity
        window = nums[i:i + k]
        result.append(max(window))

    return result


print(max_sliding_window([1, 3, -1, -3, 5, 3, 6, 7], 3))`
    }
  },
  {
    id: 'c1-subarray-given-sum',
    title: '7. Subarray with Given Sum',
    category: 'Arrays & Sliding Window',
    language: 'go',
    code: `// 7. Subarray with Given Sum
// Bug: Fails for negative numbers and contains off-by-one slice bounds.

package main

import "fmt"

func subarraySum(nums []int, target int) []int {
	left := 0
	currentSum := 0

	for right := 0; right < len(nums); right++ {
		currentSum += nums[right]

		// Bug: Two-pointer shrinking assumes non-negative numbers only
		for currentSum > target && left < right {
			currentSum -= nums[left]
			left++
		}

		if currentSum == target {
			// Bug: Slice excludes target element
			return nums[left:right]
		}
	}

	return nil
}

func main() {
	fmt.Println(subarraySum([]int{1, 2, 3, 7, 5}, 12))
}`,
    variants: {
      python: `# 7. Subarray with Given Sum
# Bug: Two-pointer shrinking assumes all-non-negative input, so it breaks on arrays with negatives.
# Bug 2: The returned slice excludes the element at \`right\`, off by one.

def subarray_sum(nums, target):
    left = 0
    current_sum = 0

    for right in range(len(nums)):
        current_sum += nums[right]

        # Bug: Two-pointer shrinking assumes non-negative numbers only
        while current_sum > target and left < right:
            current_sum -= nums[left]
            left += 1

        if current_sum == target:
            # Bug 2: Slice excludes the element at index \`right\`
            return nums[left:right]

    return None


print(subarray_sum([1, 2, 3, 7, 5], 12))`
    }
  },

  // ==========================================
  // CATEGORY 2: HASHMAP & FREQUENCY
  // ==========================================
  {
    id: 'c2-two-sum',
    title: '8. Two Sum',
    category: 'HashMap & Frequency',
    language: 'javascript',
    code: `// 8. Two Sum
// Bug: Double counts the same element if target is 2 * nums[i].

function twoSum(nums, target) {
  const map = {};
  
  for (let i = 0; i < nums.length; i++) {
    map[nums[i]] = i;
  }
  
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    // Bug: Doesn't check if map[diff] !== i (can match self!)
    if (map[diff] !== undefined) {
      return [i, map[diff]];
    }
  }
  return [];
}

console.log(twoSum([3, 2, 4], 6));`,
    variants: {
      typescript: `// 8. Two Sum
// Bug: Doesn't check if map.get(diff) !== i (can match itself against its own index).

function twoSum(nums: number[], target: number): number[] {
  const indexOf = new Map<number, number>();

  for (let i = 0; i < nums.length; i++) {
    indexOf.set(nums[i], i);
  }

  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    // Bug: Doesn't check indexOf.get(diff) !== i (can match self!)
    if (indexOf.has(diff)) {
      return [i, indexOf.get(diff)!];
    }
  }
  return [];
}

console.log(twoSum([3, 2, 4], 6)); // Expected: [1, 2] — self-match bug returns [0, 0] instead`,
      python: `# 8. Two Sum
# Bug: Doesn't check that the matched index is different from the current index (can match itself).

def two_sum(nums, target):
    index_of = {}

    for i, num in enumerate(nums):
        index_of[num] = i

    for i, num in enumerate(nums):
        diff = target - num
        # Bug: Doesn't check index_of[diff] != i (can match self!)
        if diff in index_of:
            return [i, index_of[diff]]

    return []

print(two_sum([3, 2, 4], 6))  # Expected: [1, 2] — self-match bug returns [0, 0] instead`,
      go: `// 8. Two Sum
// Bug: Doesn't check that the matched index is different from the current index (can match itself).

package main

import "fmt"

func twoSum(nums []int, target int) []int {
	indexOf := make(map[int]int)
	for i, n := range nums {
		indexOf[n] = i
	}

	for i, n := range nums {
		diff := target - n
		// Bug: Doesn't check indexOf[diff] != i (can match self!)
		if j, ok := indexOf[diff]; ok {
			return []int{i, j}
		}
	}
	return nil
}

func main() {
	fmt.Println(twoSum([]int{3, 2, 4}, 6)) // Expected: [1 2] — self-match bug returns [0 0] instead
}`,
      rust: `// 8. Two Sum
// Bug: Doesn't check that the matched index is different from the current index (can match itself).

use std::collections::HashMap;

fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {
    let mut index_of: HashMap<i32, usize> = HashMap::new();
    for (i, &n) in nums.iter().enumerate() {
        index_of.insert(n, i);
    }

    for (i, &n) in nums.iter().enumerate() {
        let diff = target - n;
        // Bug: Doesn't check index_of[&diff] != i (can match self!)
        if let Some(&j) = index_of.get(&diff) {
            return vec![i as i32, j as i32];
        }
    }
    vec![]
}

fn main() {
    println!("{:?}", two_sum(vec![3, 2, 4], 6)); // Expected: [1, 2] — self-match bug returns [0, 0] instead
}`
    }
  },
  {
    id: 'c2-group-anagrams',
    title: '9. Group Anagrams',
    category: 'HashMap & Frequency',
    language: 'python',
    code: `# 9. Group Anagrams
# Bug: Mutates array keys and uses unhashable list as dict key.

def groupAnagrams(strs):
    ans = {}
    for s in strs:
        # Bug: Trying to use list as dict key -> TypeError: unhashable type: 'list'
        count = [0] * 26
        for c in s:
            count[ord(c) - ord('a')] += 1
        
        if count not in ans:
            ans[count] = []
        ans[count].append(s)
        
    return list(ans.values())

print(groupAnagrams(["eat","tea","tan","ate","nat","bat"]))`
  },
  {
    id: 'c2-top-k-frequent',
    title: '10. Top K Frequent Elements',
    category: 'HashMap & Frequency',
    language: 'typescript',
    code: `// 10. Top K Frequent Elements
// Bug: Sorts entire unique key array O(N log N) instead of Bucket Sort or Min-Heap O(N log K).

function topKFrequent(nums: number[], k: number): number[] {
  const freqMap = new Map<number, number>();
  
  for (const n of nums) {
    freqMap.set(n, (freqMap.get(n) || 0) + 1);
  }
  
  // Bug: Sorts all unique elements array O(U log U) instead of maintaining Top-K heap
  const keys = Array.from(freqMap.keys());
  keys.sort((a, b) => freqMap.get(b)! - freqMap.get(a)!);
  
  return keys.slice(0, k);
}

console.log(topKFrequent([1,1,1,2,2,3], 2));`,
    variants: {
      python: `# 10. Top K Frequent Elements
# Bug: Sorts the entire unique-key list O(N log N) instead of bucket sort or a size-K heap O(N log K).

from collections import Counter


def top_k_frequent(nums, k):
    freq = Counter(nums)

    # Bug: Sorts all unique elements O(U log U) instead of maintaining a top-K heap
    keys = sorted(freq.keys(), key=lambda n: freq[n], reverse=True)

    return keys[:k]


print(top_k_frequent([1, 1, 1, 2, 2, 3], 2))`
    }
  },
  {
    id: 'c2-longest-consecutive',
    title: '11. Longest Consecutive Sequence',
    category: 'HashMap & Frequency',
    language: 'javascript',
    code: `// 11. Longest Consecutive Sequence
// Bug: Performs O(N²) check by starting sequence count on middle numbers instead of sequence starts only.

function longestConsecutive(nums) {
  const numSet = new Set(nums);
  let longestStreak = 0;

  for (const num of numSet) {
    // Bug: Missing check if (!numSet.has(num - 1)). Performs redundant O(N²) iterations!
    let currentNum = num;
    let currentStreak = 1;

    while (numSet.has(currentNum + 1)) {
      currentNum += 1;
      currentStreak += 1;
    }

    longestStreak = Math.max(longestStreak, currentStreak);
  }

  return longestStreak;
}

console.log(longestConsecutive([100, 4, 200, 1, 3, 2]));`,
    variants: {
      python: `# 11. Longest Consecutive Sequence
# Bug: Runs an O(N^2) check by starting a streak count from middle numbers instead of only sequence starts.

def longest_consecutive(nums):
    num_set = set(nums)
    longest_streak = 0

    for num in num_set:
        # Bug: Missing check for (num - 1) not in num_set. Runs redundant O(N^2) work!
        current_num = num
        current_streak = 1

        while current_num + 1 in num_set:
            current_num += 1
            current_streak += 1

        longest_streak = max(longest_streak, current_streak)

    return longest_streak


print(longest_consecutive([100, 4, 200, 1, 3, 2]))`
    }
  },
  {
    id: 'c2-subarray-sum-k',
    title: '12. Subarray Sum Equals K',
    category: 'HashMap & Frequency',
    language: 'python',
    code: `# 12. Subarray Sum Equals K
# Bug: Forgets to initialize prefix sum frequency map with {0: 1}.

def subarraySum(nums, k):
    count = 0
    curr_sum = 0
    # Bug: Missing prefix_sums = {0: 1} initialization for subarrays starting at index 0!
    prefix_sums = {}

    for num in nums:
        curr_sum += num
        if (curr_sum - k) in prefix_sums:
            count += prefix_sums[curr_sum - k]
        
        prefix_sums[curr_sum] = prefix_sums.get(curr_sum, 0) + 1

    return count

print(subarraySum([1, 1, 1], 2))`
  },

  // ==========================================
  // CATEGORY 3: GRAPHS & BFS/DFS
  // ==========================================
  {
    id: 'c3-number-of-provinces',
    title: '13. Number of Provinces',
    category: 'Graphs & BFS/DFS',
    language: 'javascript',
    code: `// 13. Number of Provinces
// Bug: Visited set tracks edges instead of nodes, causing infinite recursion.

function findCircleNum(isConnected) {
  const n = isConnected.length;
  const visited = new Set();
  let provinces = 0;

  function dfs(node) {
    for (let neighbor = 0; neighbor < n; neighbor++) {
      // Bug: Checks isConnected[node][neighbor] without marking neighbor node visited!
      if (isConnected[node][neighbor] === 1) {
        dfs(neighbor); // StackOverflow recursion!
      }
    }
  }

  for (let i = 0; i < n; i++) {
    if (!visited.has(i)) {
      provinces++;
      dfs(i);
    }
  }

  return provinces;
}

console.log(findCircleNum([[1,1,0],[1,1,0],[0,0,1]]));`,
    variants: {
      python: `# 13. Number of Provinces
# Bug: The visited set is never populated inside dfs, so nodes keep getting revisited -> infinite recursion.

def find_circle_num(is_connected):
    n = len(is_connected)
    visited = set()
    provinces = 0

    def dfs(node):
        for neighbor in range(n):
            # Bug: Checks is_connected[node][neighbor] without marking the neighbor visited!
            if is_connected[node][neighbor] == 1:
                dfs(neighbor)  # Infinite recursion / stack overflow!

    for i in range(n):
        if i not in visited:
            provinces += 1
            dfs(i)

    return provinces


print(find_circle_num([[1, 1, 0], [1, 1, 0], [0, 0, 1]]))`
    }
  },
  {
    id: 'c3-number-of-enclaves',
    title: '14. Number of Enclaves',
    category: 'Graphs & BFS/DFS',
    language: 'python',
    code: `# 14. Number of Enclaves
# Bug: Fails to traverse boundary cells before counting interior land cells.

def numEnclaves(grid):
    rows, cols = len(grid), len(grid[0])
    
    # Bug: Only checks interior cells, fails to flood-fill boundary land cells to 0 first!
    enclaves = 0
    for r in range(1, rows - 1):
        for c in range(1, cols - 1):
            if grid[r][c] == 1:
                enclaves += 1
                
    return enclaves

grid = [[0,0,0,0],[1,0,1,0],[0,1,1,0],[0,0,0,0]]
print(numEnclaves(grid))`
  },
  {
    id: 'c3-number-of-islands',
    title: '15. Number of Islands',
    category: 'Graphs & BFS/DFS',
    language: 'typescript',
    code: `// 15. Number of Islands
// Bug: Out of bounds check allows grid[-1] access and missing grid mutation to '0'.

function numIslands(grid: string[][]): number {
  if (!grid || grid.length === 0) return 0;
  let count = 0;

  function dfs(r: number, c: number) {
    // Bug: Missing boundary check for r >= grid.length and c >= grid[0].length!
    if (grid[r][c] === '0') return;

    // Bug: Forgets to set grid[r][c] = '0' to mark visited!
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === '1') {
        count++;
        dfs(r, c);
      }
    }
  }

  return count;
}`,
    variants: {
      python: `# 15. Number of Islands
# Bug: No boundary check for out-of-range indices — Python's negative indexing silently
# wraps around instead of raising, corrupting unrelated rows.
# Bug 2: Never marks a visited cell back to '0', so dfs revisits the same land forever.

def num_islands(grid):
    if not grid:
        return 0
    count = 0

    def dfs(r, c):
        # Bug: Missing boundary check for r >= len(grid) and c >= len(grid[0])!
        if grid[r][c] == '0':
            return

        # Bug 2: Forgets to set grid[r][c] = '0' to mark visited!
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)

    for r in range(len(grid)):
        for c in range(len(grid[0])):
            if grid[r][c] == '1':
                count += 1
                dfs(r, c)

    return count`
    }
  },
  {
    id: 'c3-rotting-oranges',
    title: '16. Rotting Oranges (BFS)',
    category: 'Graphs & BFS/DFS',
    language: 'python',
    code: `# 16. Rotting Oranges (BFS)
# Bug: Increments minute counter per orange instead of level-by-level BFS queue snapshot.

from collections import deque

def orangesRotting(grid):
    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh = 0

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                queue.append((r, c))
            elif grid[r][c] == 1:
                fresh += 1

    minutes = 0
    while queue:
        # Bug: Pops per element and increments minutes immediately instead of processing current queue size level!
        r, c = queue.popleft()
        minutes += 1
        for dr, dc in [(-1,0), (1,0), (0,-1), (0,1)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                grid[nr][nc] = 2
                fresh -= 1
                queue.append((nr, nc))

    return minutes if fresh == 0 else -1`
  },
  {
    id: 'c3-word-ladder',
    title: '17. Word Ladder (BFS)',
    category: 'Graphs & BFS/DFS',
    language: 'javascript',
    code: `// 17. Word Ladder (BFS)
// Bug: Checks wordList linearly O(N) at each node instead of checking 26 alphabet mutations O(26*L).

function ladderLength(beginWord, endWord, wordList) {
  const wordSet = new Set(wordList);
  if (!wordSet.has(endWord)) return 0;

  const queue = [[beginWord, 1]];

  while (queue.length > 0) {
    const [current, steps] = queue.shift();
    if (current === endWord) return steps;

    // Bug: Linear iteration over entire wordSet leads to TLE (Time Limit Exceeded)
    for (const word of wordSet) {
      let diff = 0;
      for (let i = 0; i < word.length; i++) {
        if (word[i] !== current[i]) diff++;
      }
      if (diff === 1) {
        queue.push([word, steps + 1]);
        wordSet.delete(word);
      }
    }
  }

  return 0;
}`,
    variants: {
      python: `# 17. Word Ladder (BFS)
# Bug: Scans the entire word list at each step O(N) instead of trying all 26 single-letter
# mutations O(26*L), leading to TLE (Time Limit Exceeded) on large inputs.

from collections import deque


def ladder_length(begin_word, end_word, word_list):
    word_set = set(word_list)
    if end_word not in word_set:
        return 0

    queue = deque([(begin_word, 1)])

    while queue:
        current, steps = queue.popleft()
        if current == end_word:
            return steps

        # Bug: Linear scan over the entire word_set leads to TLE (Time Limit Exceeded)
        for word in list(word_set):
            diff = sum(1 for a, b in zip(word, current) if a != b)
            if diff == 1:
                queue.append((word, steps + 1))
                word_set.discard(word)

    return 0


print(ladder_length("hit", "cog", ["hot", "dot", "dog", "lot", "log", "cog"]))`
    }
  },
  {
    id: 'c3-course-schedule',
    title: '18. Course Schedule (Cycle Detection)',
    category: 'Graphs & BFS/DFS',
    language: 'go',
    code: `// 18. Course Schedule (Cycle Detection / Kahn's Algo)
// Bug: Missing visited state resets in DFS causing false cycle detections.

package main

import "fmt"

func canFinish(numCourses int, prerequisites [][]int) bool {
	adj := make([][]int, numCourses)
	for _, pre := range prerequisites {
		adj[pre[1]] = append(adj[pre[1]], pre[0])
	}

	visited := make([]bool, numCourses)

	var hasCycle func(course int) bool
	hasCycle = func(course int) bool {
		if visited[course] {
			return true
		}
		visited[course] = true

		for _, neighbor := range adj[course] {
			if hasCycle(neighbor) {
				return true
			}
		}
		// Bug: Fails to unmark visited[course] = false (backtracking reset missing!)
		return false
	}

	for i := 0; i < numCourses; i++ {
		if hasCycle(i) {
			return false
		}
	}
	return true
}

func main() {
	fmt.Println(canFinish(2, [][]int{{1, 0}}))
}`,
    variants: {
      python: `# 18. Course Schedule (Cycle Detection)
# Bug: Never resets the visited state during backtracking, so revisiting a node through a
# different path is flagged as a cycle even when there isn't one.

def can_finish(num_courses, prerequisites):
    adj = [[] for _ in range(num_courses)]
    for course, pre in prerequisites:
        adj[pre].append(course)

    visited = [False] * num_courses

    def has_cycle(course):
        if visited[course]:
            return True
        visited[course] = True

        for neighbor in adj[course]:
            if has_cycle(neighbor):
                return True
        # Bug: Fails to reset visited[course] = False (backtracking reset missing!)
        return False

    for i in range(num_courses):
        if has_cycle(i):
            return False
    return True


print(can_finish(2, [[1, 0]]))`
    }
  },
  {
    id: 'c3-update-install-order',
    title: "Update Install Order (Topological Sort, Kahn's Algorithm)",
    category: 'Graphs & BFS/DFS',
    language: 'python',
    code: `# Update Install Order — Topological Sort via Kahn's Algorithm
# Bug: Indegree map is only seeded from dependency pairs, so any update with
# no incoming edges never gets a key at all, causing a KeyError instead of
# being correctly treated as immediately installable.

from collections import defaultdict, deque

def update_install_order(updates, dependencies):
    graph = defaultdict(list)
    indegree = {}  # Bug: should be initialized to {u: 0 for u in updates}

    for pre, dep in dependencies:
        graph[pre].append(dep)
        indegree[dep] = indegree.get(dep, 0) + 1

    # Bug: KeyError here whenever an update never shows up as a "dep"
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

print(update_install_order(["A", "B", "C"], [("A", "B")]))
# Expected: ['A', 'C', 'B'] or ['C', 'A', 'B'] — raises KeyError instead`
  },

  // ==========================================
  // CATEGORY 4: TREES
  // ==========================================
  {
    id: 'c4-tree-traversals',
    title: '19. Tree Traversals (Pre/In/Post Order)',
    category: 'Trees',
    language: 'javascript',
    code: `// 19. Tree Traversals
// Bug: In-order traversal appends root before left subtree.

function TreeNode(val, left, right) {
  this.val = (val===undefined ? 0 : val);
  this.left = (left===undefined ? null : left);
  this.right = (right===undefined ? null : right);
}

function inorderTraversal(root) {
  const result = [];
  
  function traverse(node) {
    if (!node) return;
    // Bug: Pushes val first (this is Pre-Order traversal, not In-Order!)
    result.push(node.val);
    traverse(node.left);
    traverse(node.right);
  }

  traverse(root);
  return result;
}`,
    variants: {
      python: `# 19. Tree Traversals
# Bug: In-order traversal appends the root before the left subtree (this is Pre-Order, not In-Order).

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def inorder_traversal(root):
    result = []

    def traverse(node):
        if not node:
            return
        # Bug: Appends val first (this is Pre-Order traversal, not In-Order!)
        result.append(node.val)
        traverse(node.left)
        traverse(node.right)

    traverse(root)
    return result`
    }
  },
  {
    id: 'c4-house-robber-iii',
    title: '20. House Robber III (Tree DP)',
    category: 'Trees',
    language: 'python',
    code: `# 20. House Robber III (Tree DP)
# Bug: Exponential O(2^N) recursion re-evaluating child nodes multiple times without memoization pair [rob, skip].

def rob(root):
    if not root:
        return 0

    val = root.val

    # Bug: Re-computes grandchildren recursively in a naive manner (O(2^N) time complexity)
    if root.left:
        val += rob(root.left.left) + rob(root.left.right)
    if root.right:
        val += rob(root.right.left) + rob(root.right.right)

    return max(val, rob(root.left) + rob(root.right))`
  },
  {
    id: 'c4-max-depth-binary-tree',
    title: '21. Maximum Depth of Binary Tree',
    category: 'Trees',
    language: 'typescript',
    code: `// 21. Maximum Depth of Binary Tree
// Bug: Fails to add 1 for the current node level depth.

class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = (val===undefined ? 0 : val);
    this.left = (left===undefined ? null : left);
    this.right = (right===undefined ? null : right);
  }
}

function maxDepth(root: TreeNode | null): number {
  if (root === null) return 0;

  const leftDepth = maxDepth(root.left);
  const rightDepth = maxDepth(root.right);

  // Bug: Returns Math.max(leftDepth, rightDepth) without + 1 for current root node level!
  return Math.max(leftDepth, rightDepth);
}`,
    variants: {
      python: `# 21. Maximum Depth of Binary Tree
# Bug: Fails to add 1 for the current node's own level.

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def max_depth(root):
    if root is None:
        return 0

    left_depth = max_depth(root.left)
    right_depth = max_depth(root.right)

    # Bug: Returns max(left_depth, right_depth) without + 1 for the current root's level!
    return max(left_depth, right_depth)`
    }
  },
  {
    id: 'c4-diameter-binary-tree',
    title: '22. Diameter of Binary Tree',
    category: 'Trees',
    language: 'python',
    code: `# 22. Diameter of Binary Tree
# Bug: Returns root height instead of updating global diameter max edges.

def diameterOfBinaryTree(root):
    diameter = 0

    def height(node):
        if not node:
            return 0
        left_h = height(node.left)
        right_h = height(node.right)

        # Bug: Returns diameter from height function instead of returning node height!
        return left_h + right_h

    return height(root)`
  },
  {
    id: 'c4-lca-binary-tree',
    title: '23. Lowest Common Ancestor',
    category: 'Trees',
    language: 'javascript',
    code: `// 23. Lowest Common Ancestor of a Binary Tree
// Bug: Returns true boolean instead of returning the matching ancestor TreeNode reference.

function lowestCommonAncestor(root, p, q) {
  if (!root || root === p || root === q) {
    return root;
  }

  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);

  // Bug: Returns null if only one side is non-null instead of propagating non-null node!
  if (left && right) return root;
  return null;
}`,
    variants: {
      python: `# 23. Lowest Common Ancestor of a Binary Tree
# Bug: Returns None whenever only one side is non-null instead of propagating that non-null node up.

def lowest_common_ancestor(root, p, q):
    if not root or root is p or root is q:
        return root

    left = lowest_common_ancestor(root.left, p, q)
    right = lowest_common_ancestor(root.right, p, q)

    # Bug: Returns None if only one side is non-null instead of propagating the non-null node!
    if left and right:
        return root
    return None`
    }
  },
  {
    id: 'c4-level-order-traversal',
    title: '24. Binary Tree Level Order Traversal',
    category: 'Trees',
    language: 'go',
    code: `// 24. Binary Tree Level Order Traversal
// Bug: Appends nodes flattened without grouping by level subarrays.

package main

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func levelOrder(root *TreeNode) [][]int {
	var result [][]int
	if root == nil {
		return result
	}

	queue := []*TreeNode{root}

	for len(queue) > 0 {
		// Bug: Fails to snapshot queue size at start of level loop, causing infinite processing
		node := queue[0]
		queue = queue[1:]

		result = append(result, []int{node.Val})

		if node.Left != nil {
			queue = append(queue, node.Left)
		}
		if node.Right != nil {
			queue = append(queue, node.Right)
		}
	}

	return result
}`,
    variants: {
      python: `# 24. Binary Tree Level Order Traversal
# Bug: Never snapshots the queue size at the start of a level, so nodes end up flattened
# into one list instead of grouped by level.

from collections import deque


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def level_order(root):
    result = []
    if root is None:
        return result

    queue = deque([root])

    while queue:
        # Bug: Fails to snapshot the queue size at the start of the level loop
        node = queue.popleft()

        result.append([node.val])

        if node.left:
            queue.append(node.left)
        if node.right:
            queue.append(node.right)

    return result`
    }
  },
  {
    id: 'c4-validate-bst',
    title: '25. Validate Binary Search Tree',
    category: 'Trees',
    language: 'python',
    code: `# 25. Validate Binary Search Tree
# Bug: Only checks immediate parent node instead of enforcing global min/max range bounds.

def isValidBST(root):
    if not root:
        return True

    # Bug: Only compares root.val with direct child values!
    # Fails for trees like [10, 5, 15, null, null, 6, 20] where 6 is in right subtree of 10.
    if root.left and root.left.val >= root.val:
        return False
    if root.right and root.right.val <= root.val:
        return False

    return isValidBST(root.left) and isValidBST(root.right)`
  },

  // ==========================================
  // CATEGORY 5: DYNAMIC PROGRAMMING
  // ==========================================
  {
    id: 'c5-house-robber-i',
    title: '26. House Robber I',
    category: 'Dynamic Programming',
    language: 'javascript',
    code: `// 26. House Robber I
// Bug: State transition ignores robbing current house + dp[i-2].

function rob(nums) {
  if (nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];

  const dp = new Array(nums.length);
  dp[0] = nums[0];
  // Bug: Incorrect initialization dp[1]
  dp[1] = nums[1]; 

  for (let i = 2; i < nums.length; i++) {
    // Bug: Takes max(dp[i-1], nums[i]) instead of max(dp[i-1], dp[i-2] + nums[i])
    dp[i] = Math.max(dp[i - 1], nums[i]);
  }

  return dp[nums.length - 1];
}

console.log(rob([1, 2, 3, 1]));`,
    variants: {
      python: `# 26. House Robber I
# Bug: State transition ignores robbing the current house + dp[i-2].

def rob(nums):
    if len(nums) == 0:
        return 0
    if len(nums) == 1:
        return nums[0]

    dp = [0] * len(nums)
    dp[0] = nums[0]
    # Bug: Incorrect initialization of dp[1]
    dp[1] = nums[1]

    for i in range(2, len(nums)):
        # Bug: Takes max(dp[i-1], nums[i]) instead of max(dp[i-1], dp[i-2] + nums[i])
        dp[i] = max(dp[i - 1], nums[i])

    return dp[-1]


print(rob([1, 2, 3, 1]))`
    }
  },
  {
    id: 'c5-house-robber-ii',
    title: '27. House Robber II (Circular)',
    category: 'Dynamic Programming',
    language: 'python',
    code: `# 27. House Robber II (Circular Array)
# Bug: Fails to separate circular choices (house 0 to N-2 vs house 1 to N-1).

def rob(nums):
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]

    # Bug: Runs simple House Robber I on whole array, ignoring circular street constraint!
    prev1, prev2 = 0, 0
    for num in nums:
        prev1, prev2 = max(prev2 + num, prev1), prev1
    return prev1

print(rob([2, 3, 2]))`
  },
  {
    id: 'c5-climbing-stairs',
    title: '28. Climbing Stairs',
    category: 'Dynamic Programming',
    language: 'typescript',
    code: `// 28. Climbing Stairs
// Bug: Naive exponential recursive implementation O(2^N) causing call stack overflow.

function climbStairs(n: number): number {
  if (n <= 2) return n;

  // Bug: Missing memoization / iteration. Takes O(2^N) time!
  return climbStairs(n - 1) + climbStairs(n - 2);
}

console.log(climbStairs(45));`,
    variants: {
      python: `# 28. Climbing Stairs
# Bug: Naive exponential recursion O(2^N) — no memoization, blows up for larger n.

def climb_stairs(n):
    if n <= 2:
        return n

    # Bug: Missing memoization / iteration. Takes O(2^N) time!
    return climb_stairs(n - 1) + climb_stairs(n - 2)


print(climb_stairs(30))`
    }
  },
  {
    id: 'c5-coin-change',
    title: '29. Coin Change',
    category: 'Dynamic Programming',
    language: 'python',
    code: `# 29. Coin Change
# Bug: Greedy approach fails for denominations like coins=[1,3,4,5], amount=7.

def coinChange(coins, amount):
    coins.sort(reverse=True)
    count = 0
    
    # Bug: Greedy coin picking fails to find optimal DP minimum combination!
    for coin in coins:
        while amount >= coin:
            amount -= coin
            count += 1

    return count if amount == 0 else -1

print(coinChange([1, 3, 4, 5], 7))`
  },
  {
    id: 'c5-longest-common-subsequence',
    title: '30. Longest Common Subsequence',
    category: 'Dynamic Programming',
    language: 'javascript',
    code: `// 30. Longest Common Subsequence
// Bug: 2D DP matrix initialization uses shared array references causing row mutation.

function longestCommonSubsequence(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  
  // Bug: Array(m + 1).fill(Array(n + 1).fill(0)) shares reference across all rows!
  const dp = new Array(m + 1).fill(new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[m][n];
}`,
    variants: {
      python: `# 30. Longest Common Subsequence
# Bug: The 2D DP matrix is built from a single shared row reference, so every row mutates together.

def longest_common_subsequence(text1, text2):
    m = len(text1)
    n = len(text2)

    # Bug: [[0] * (n + 1)] * (m + 1) shares the same inner list across every row!
    dp = [[0] * (n + 1)] * (m + 1)

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

    return dp[m][n]


print(longest_common_subsequence("abcde", "ace"))`
    }
  },
  {
    id: 'c5-word-break',
    title: '31. Word Break',
    category: 'Dynamic Programming',
    language: 'python',
    code: `# 31. Word Break
# Bug: Outer loop condition & slice range bounds are off-by-one.

def wordBreak(s, wordDict):
    word_set = set(wordDict)
    dp = [False] * (len(s) + 1)
    dp[0] = True

    for i in range(1, len(s)): # Bug: Should be range(1, len(s) + 1)
        for j in range(i):
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break

    return dp[len(s)]`
  },

  // ==========================================
  // CATEGORY 6: STACK & QUEUE
  // ==========================================
  {
    id: 'c6-valid-parentheses',
    title: '32. Valid Parentheses',
    category: 'Stack & Queue',
    language: 'go',
    code: `// 32. Valid Parentheses
// Bug: Panics on empty stack pop and fails unclosed stack check.

package main

import "fmt"

func isValid(s string) bool {
	var stack []rune
	pairs := map[rune]rune{')': '(', '}': '{', ']': '['}

	for _, char := range s {
		if open, isClose := pairs[char]; isClose {
			// Bug: Accesses stack[-1] on empty stack -> RUNTIME PANIC
			top := stack[len(stack)-1]
			if top != open {
				return false
			}
			stack = stack[:len(stack)-1]
		} else {
			stack = append(stack, char)
		}
	}
	return true // Bug: Forgets len(stack) == 0 check
}

func main() {
	fmt.Println(isValid(")"))
}`,
    variants: {
      javascript: `// 32. Valid Parentheses
// Bug: Pops from the stack without checking it's non-empty first (relies on implicit undefined
// instead of an explicit guard).
// Bug 2: Never verifies the stack is empty at the end, so unclosed opening brackets pass.

function isValid(s) {
  const stack = [];
  const pairs = { ')': '(', '}': '{', ']': '[' };

  for (const char of s) {
    if (char in pairs) {
      // Bug: No check that stack.length > 0 before popping
      const top = stack.pop();
      if (top !== pairs[char]) {
        return false;
      }
    } else {
      stack.push(char);
    }
  }

  return true; // Bug 2: Forgets to check stack.length === 0
}

console.log(isValid('(')); // Expected: false (unclosed bracket) — returns true instead`,
      typescript: `// 32. Valid Parentheses
// Bug: Pops from the stack without checking it's non-empty first (relies on implicit undefined
// instead of an explicit guard).
// Bug 2: Never verifies the stack is empty at the end, so unclosed opening brackets pass.

function isValid(s: string): boolean {
  const stack: string[] = [];
  const pairs: Record<string, string> = { ')': '(', '}': '{', ']': '[' };

  for (const char of s) {
    if (char in pairs) {
      // Bug: No check that stack.length > 0 before popping
      const top = stack.pop();
      if (top !== pairs[char]) {
        return false;
      }
    } else {
      stack.push(char);
    }
  }

  return true; // Bug 2: Forgets to check stack.length === 0
}

console.log(isValid('(')); // Expected: false (unclosed bracket) — returns true instead`,
      python: `# 32. Valid Parentheses
# Bug: Pops from the stack without checking it's non-empty first -> crashes on a close-first input.
# Bug 2: Never verifies the stack is empty at the end, so unclosed opening brackets pass.

def is_valid(s):
    stack = []
    pairs = {')': '(', '}': '{', ']': '['}

    for char in s:
        if char in pairs:
            # Bug: pop() on an empty list raises IndexError
            top = stack.pop()
            if top != pairs[char]:
                return False
        else:
            stack.append(char)

    return True  # Bug 2: Forgets to check len(stack) == 0

print(is_valid(')'))  # Expected: False — raises IndexError instead`,
      rust: `// 32. Valid Parentheses
// Bug: Pops from the stack without checking it's non-empty first -> panics on a close-first input.
// Bug 2: Never verifies the stack is empty at the end, so unclosed opening brackets pass.

fn is_valid(s: &str) -> bool {
    let mut stack: Vec<char> = Vec::new();

    for ch in s.chars() {
        match ch {
            '(' | '{' | '[' => stack.push(ch),
            ')' | '}' | ']' => {
                // Bug: unwrap() on an empty stack panics
                let top = stack.pop().unwrap();
                let expected = match ch {
                    ')' => '(',
                    '}' => '{',
                    _ => '[',
                };
                if top != expected {
                    return false;
                }
            }
            _ => {}
        }
    }

    true // Bug 2: Forgets to check stack.is_empty()
}

fn main() {
    println!("{}", is_valid(")")); // Expected: false — panics instead
}`
    }
  },
  {
    id: 'c6-min-stack',
    title: '33. Min Stack',
    category: 'Stack & Queue',
    language: 'typescript',
    code: `// 33. Min Stack
// Bug: getMin() performs O(N) scan using Math.min(...stack) instead of maintaining O(1) auxiliary min stack.

class MinStack {
  private stack: number[] = [];

  push(val: number): void {
    this.stack.push(val);
  }

  pop(): void {
    this.stack.pop();
  }

  top(): number {
    return this.stack[this.stack.length - 1];
  }

  getMin(): number {
    // Bug: Destroys O(1) requirement by performing O(N) linear search!
    return Math.min(...this.stack);
  }
}`,
    variants: {
      python: `# 33. Min Stack
# Bug: get_min() does an O(N) scan with min(stack) instead of maintaining an O(1) auxiliary min stack.

class MinStack:
    def __init__(self):
        self.stack = []

    def push(self, val):
        self.stack.append(val)

    def pop(self):
        self.stack.pop()

    def top(self):
        return self.stack[-1]

    def get_min(self):
        # Bug: Destroys the O(1) requirement by performing an O(N) linear scan!
        return min(self.stack)`
    }
  },
  {
    id: 'c6-daily-temperatures',
    title: '34. Daily Temperatures (Monotonic Stack)',
    category: 'Stack & Queue',
    language: 'python',
    code: `# 34. Daily Temperatures
# Bug: Stores temperature values instead of indices in the monotonic stack.

def dailyTemperatures(temperatures):
    res = [0] * len(temperatures)
    stack = [] # Monotonic decreasing stack

    for i, t in enumerate(temperatures):
        # Bug: Pushes temperature value instead of index, making distance calculation i - prev_i impossible!
        while stack and stack[-1] < t:
            prev_t = stack.pop()
            res[i] = 1 
        stack.append(t)

    return res

print(dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73]))`
  },
  {
    id: 'c6-largest-rectangle-histogram',
    title: '35. Largest Rectangle in Histogram',
    category: 'Stack & Queue',
    language: 'javascript',
    code: `// 35. Largest Rectangle in Histogram
// Bug: O(N²) nested iteration causing TLE on large histogram inputs.

function largestRectangleArea(heights) {
  let maxArea = 0;

  // Bug: Brute force O(N²) calculation instead of Monotonic Stack O(N) algorithm
  for (let i = 0; i < heights.length; i++) {
    let minHeight = heights[i];
    for (let j = i; j < heights.length; j++) {
      minHeight = Math.min(minHeight, heights[j]);
      const area = minHeight * (j - i + 1);
      maxArea = Math.max(maxArea, area);
    }
  }

  return maxArea;
}`,
    variants: {
      python: `# 35. Largest Rectangle in Histogram
# Bug: O(N^2) nested iteration causes TLE on large histogram inputs.

def largest_rectangle_area(heights):
    max_area = 0

    # Bug: Brute force O(N^2) calculation instead of the monotonic stack O(N) algorithm
    for i in range(len(heights)):
        min_height = heights[i]
        for j in range(i, len(heights)):
            min_height = min(min_height, heights[j])
            area = min_height * (j - i + 1)
            max_area = max(max_area, area)

    return max_area


print(largest_rectangle_area([2, 1, 5, 6, 2, 3]))`
    }
  },
  {
    id: 'c6-implement-queue-stacks',
    title: '36. Implement Queue using Stacks',
    category: 'Stack & Queue',
    language: 'python',
    code: `# 36. Implement Queue using Stacks
# Bug: Empties and shifts elements on every push(), making push O(N) instead of amortized O(1).

class MyQueue:
    def __init__(self):
        self.s1 = []
        self.s2 = []

    def push(self, x: int) -> None:
        # Bug: Inefficient shuffle on every push operation
        while self.s1:
            self.s2.append(self.s1.pop())
        self.s1.append(x)
        while self.s2:
            self.s1.append(self.s2.pop())

    def pop(self) -> int:
        return self.s1.pop()

    def peek(self) -> int:
        return self.s1[-1]

    def empty(self) -> bool:
        return not self.s1`
  },

  // ==========================================
  // CATEGORY 7: BINARY SEARCH
  // ==========================================
  {
    id: 'c7-binary-search-basics',
    title: '37. Binary Search Basics',
    category: 'Binary Search',
    language: 'python',
    code: `# 37. Binary Search Basics
# Bug: Mid calculation integer overflow risk & loop termination condition.

def binary_search(nums, target):
    low = 0
    high = len(nums) # Bug: Should be len(nums) - 1

    while low < high: # Bug: Misses checking element when low == high
        # Potential integer overflow in languages without arbitrary precision
        mid = (low + high) // 2 

        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            low = mid # Bug: Infinite loop! Should be mid + 1
        else:
            high = mid

    return -1`
  },
  {
    id: 'c7-search-rotated-array',
    title: '38. Search in Rotated Sorted Array',
    category: 'Binary Search',
    language: 'javascript',
    code: `// 38. Search in Rotated Sorted Array
// Bug: Missing equal signs in half boundary checks (<= vs <).

function search(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] === target) return mid;

    // Bug: Uses strictly < instead of <= for left half check
    if (nums[left] < nums[mid]) {
      if (nums[left] <= target && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      if (nums[mid] < target && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }

  return -1;
}`,
    variants: {
      python: `# 38. Search in Rotated Sorted Array
# Bug: Uses a strict < instead of <= when checking whether the left half is sorted.

def search(nums, target):
    left = 0
    right = len(nums) - 1

    while left <= right:
        mid = (left + right) // 2

        if nums[mid] == target:
            return mid

        # Bug: Uses strictly < instead of <= for the left-half check
        if nums[left] < nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1

    return -1


print(search([4, 5, 6, 7, 0, 1, 2], 0))`
    }
  },
  {
    id: 'c7-find-peak-element',
    title: '39. Find Peak Element',
    category: 'Binary Search',
    language: 'typescript',
    code: `// 39. Find Peak Element
// Bug: Performs linear scan O(N) instead of Binary Search O(log N).

function findPeakElement(nums: number[]): number {
  // Bug: O(N) linear search violates logarithmic time complexity requirement
  for (let i = 0; i < nums.length - 1; i++) {
    if (nums[i] > nums[i + 1]) {
      return i;
    }
  }
  return nums.length - 1;
}`,
    variants: {
      python: `# 39. Find Peak Element
# Bug: Performs a linear scan O(N) instead of binary search O(log N).

def find_peak_element(nums):
    # Bug: O(N) linear search violates the logarithmic time complexity requirement
    for i in range(len(nums) - 1):
        if nums[i] > nums[i + 1]:
            return i
    return len(nums) - 1


print(find_peak_element([1, 2, 3, 1]))`
    }
  },
  {
    id: 'c7-kth-smallest-sorted-matrix',
    title: '40. Kth Smallest Element in Sorted Matrix',
    category: 'Binary Search',
    language: 'python',
    code: `# 40. Kth Smallest Element in Sorted Matrix
# Bug: Flattens matrix and sorts whole array O(N^2 log N) instead of Binary Search range O(N log(max-min)).

def kthSmallest(matrix, k):
    # Bug: Memory and time inefficient flattening
    flat_list = []
    for row in matrix:
        for val in row:
            flat_list.append(val)

    flat_list.sort()
    return flat_list[k - 1]`
  },

  // ==========================================
  // CATEGORY 8: LINKED LISTS
  // ==========================================
  {
    id: 'c8-reverse-linked-list',
    title: '41. Reverse Linked List',
    category: 'Linked Lists',
    language: 'rust',
    code: `// 41. Reverse Linked List
// Bug: Rust option lifetime ownership bug.

#[derive(PartialEq, Eq, Clone, Debug)]
pub struct ListNode {
  pub val: i32,
  pub next: Option<Box<ListNode>>
}

pub fn reverse_list(head: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
    let mut prev: Option<Box<ListNode>> = None;
    let mut curr = head;

    while let Some(mut node) = curr {
        // Bug: Borrow checker error. Must use Option::take() for node.next
        curr = node.next;
        node.next = prev;
        prev = Some(node);
    }

    prev
}`,
    variants: {
      javascript: `// 41. Reverse Linked List
// Bug: Overwrites node.next before saving a reference to the rest of the list, permanently
// severing everything past the first node.

function ListNode(val, next) {
  this.val = val;
  this.next = next === undefined ? null : next;
}

function reverseList(head) {
  let prev = null;
  let curr = head;

  while (curr !== null) {
    // Bug: Should save curr.next BEFORE reassigning it
    curr.next = prev;
    prev = curr;
    curr = curr.next; // Bug: curr.next was just overwritten above, so this is always \`prev\`
  }

  return prev;
}

function toArray(node) {
  const out = [];
  while (node) { out.push(node.val); node = node.next; }
  return out;
}

const list = new ListNode(1, new ListNode(2, new ListNode(3)));
console.log(toArray(reverseList(list))); // Expected: [3, 2, 1] — returns [1] (rest of the list is lost)`,
      typescript: `// 41. Reverse Linked List
// Bug: Overwrites node.next before saving a reference to the rest of the list, permanently
// severing everything past the first node.

class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val: number, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let curr = head;

  while (curr !== null) {
    // Bug: Should save curr.next BEFORE reassigning it
    curr.next = prev;
    prev = curr;
    curr = curr.next; // Bug: curr.next was just overwritten above, so this is always \`prev\`
  }

  return prev;
}

function toArray(node: ListNode | null): number[] {
  const out: number[] = [];
  while (node) { out.push(node.val); node = node.next; }
  return out;
}

const list = new ListNode(1, new ListNode(2, new ListNode(3)));
console.log(toArray(reverseList(list))); // Expected: [3, 2, 1] — returns [1] (rest of the list is lost)`,
      python: `# 41. Reverse Linked List
# Bug: Overwrites node.next before saving a reference to the rest of the list, permanently
# severing everything past the first node.

class ListNode:
    def __init__(self, val, next=None):
        self.val = val
        self.next = next


def reverse_list(head):
    prev = None
    curr = head

    while curr is not None:
        # Bug: Should save curr.next BEFORE reassigning it
        curr.next = prev
        prev = curr
        curr = curr.next  # Bug: curr.next was just overwritten above, so this is always \`prev\`

    return prev


def to_list(node):
    out = []
    while node:
        out.append(node.val)
        node = node.next
    return out


head = ListNode(1, ListNode(2, ListNode(3)))
print(to_list(reverse_list(head)))  # Expected: [3, 2, 1] — returns [1] (rest of the list is lost)`,
      go: `// 41. Reverse Linked List
// Bug: Overwrites node.Next before saving a reference to the rest of the list, permanently
// severing everything past the first node.

package main

import "fmt"

type ListNode struct {
	Val  int
	Next *ListNode
}

func reverseList(head *ListNode) *ListNode {
	var prev *ListNode
	curr := head

	for curr != nil {
		// Bug: Should save curr.Next BEFORE reassigning it
		curr.Next = prev
		prev = curr
		curr = curr.Next // Bug: curr.Next was just overwritten above, so this is always \`prev\`
	}

	return prev
}

func toSlice(node *ListNode) []int {
	var out []int
	for node != nil {
		out = append(out, node.Val)
		node = node.Next
	}
	return out
}

func main() {
	head := &ListNode{Val: 1, Next: &ListNode{Val: 2, Next: &ListNode{Val: 3}}}
	fmt.Println(toSlice(reverseList(head))) // Expected: [3 2 1] — returns [1] (rest of the list is lost)
}`
    }
  },
  {
    id: 'c8-detect-cycle',
    title: '42. Detect Cycle (Floyd Fast & Slow)',
    category: 'Linked Lists',
    language: 'python',
    code: `# 42. Linked List Cycle Detection
# Bug: Fast pointer check doesn't verify fast.next before accessing fast.next.next.

class ListNode:
    def __init__(self, x):
        self.val = x
        self.next = None

def hasCycle(head: ListNode) -> bool:
    slow = head
    fast = head

    while fast:
        slow = slow.next
        # Bug: AttributeError when fast.next is None!
        fast = fast.next.next

        if slow == fast:
            return True

    return False`
  },
  {
    id: 'c8-merge-two-sorted-lists',
    title: '43. Merge Two Sorted Lists',
    category: 'Linked Lists',
    language: 'typescript',
    code: `// 43. Merge Two Sorted Lists
// Bug: Forgets dummy node pattern resulting in lost head pointer reference.

class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = (val===undefined ? 0 : val);
    this.next = (next===undefined ? null : next);
  }
}

function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {
  // Bug: Missing dummy head node. Mutates list1 directly losing start reference
  let current = list1;

  while (list1 !== null && list2 !== null) {
    if (list1.val <= list2.val) {
      list1 = list1.next;
    } else {
      if (current) current.next = list2;
      list2 = list2.next;
    }
  }

  return current;
}`,
    variants: {
      python: `# 43. Merge Two Sorted Lists
# Bug: Missing the dummy-head-node pattern — mutates list1 in place and loses the head reference.

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def merge_two_lists(list1, list2):
    # Bug: Missing dummy head node. Mutates list1 directly, losing the start reference
    current = list1

    while list1 is not None and list2 is not None:
        if list1.val <= list2.val:
            list1 = list1.next
        else:
            if current:
                current.next = list2
            list2 = list2.next

    return current`
    }
  },
  {
    id: 'c8-middle-linked-list',
    title: '44. Find Middle of Linked List',
    category: 'Linked Lists',
    language: 'javascript',
    code: `// 44. Find Middle of Linked List
// Bug: Double loop iteration over node list instead of fast & slow pointers in single pass.

function middleNode(head) {
  let count = 0;
  let curr = head;

  // Bug: Two pass traversal O(2N) instead of Fast & Slow pointers single pass O(N)
  while (curr) {
    count++;
    curr = curr.next;
  }

  const mid = Math.floor(count / 2);
  curr = head;
  for (let i = 0; i < mid; i++) {
    curr = curr.next;
  }

  return curr;
}`,
    variants: {
      python: `# 44. Find Middle of Linked List
# Bug: Traverses the list twice instead of using fast & slow pointers in a single pass.

def middle_node(head):
    count = 0
    curr = head

    # Bug: Two-pass traversal O(2N) instead of fast & slow pointers, single pass O(N)
    while curr:
        count += 1
        curr = curr.next

    mid = count // 2
    curr = head
    for _ in range(mid):
        curr = curr.next

    return curr`
    }
  },
  {
    id: 'c8-lru-cache',
    title: '45. LRU Cache',
    category: 'Linked Lists',
    language: 'python',
    code: `# 45. LRU Cache
# Bug: get() update fails to move accessed key to most recent position in map.

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = {}

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        # Bug: Does not move key to end of cache to mark as recently used!
        return self.cache[key]

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            del self.cache[key]
        elif len(self.cache) >= self.capacity:
            # Removes first key
            oldest_key = next(iter(self.cache))
            del self.cache[oldest_key]
        self.cache[key] = value`
  },

  // ==========================================
  // CATEGORY 9: ML & SYSTEM DESIGN (COUPANG SPECIFIC)
  // ==========================================
  {
    id: 'c9-search-ranking-system',
    title: '46. Design Search Ranking System',
    category: 'ML & System Design',
    language: 'python',
    code: `# 46. Design Search Ranking System (Coupang Specific)
# Bug 1: Data Leakage! Future features (click-through rate after order) used in model training.
# Bug 2: Linear exact vector search O(N*D) instead of Approximate Nearest Neighbor (FAISS / HNSW).

import numpy as np

class SearchRanker:
    def __init__(self, items_database):
        self.items = items_database # Millions of items
        
    def rank_items(self, query_vector, user_features):
        scores = []
        for item in self.items:
            # Bug 1: Data leak! Incorporating future item_post_click_orders into real-time query ranker
            future_ctr = item.get('post_purchase_conversion_30d', 0)
            
            # Bug 2: Naive dot product over millions of items in real-time latency path!
            similarity = np.dot(query_vector, item['embedding']) + future_ctr
            scores.append((similarity, item['id']))
            
        scores.sort(key=lambda x: x[0], reverse=True)
        return scores[:20]`
  },
  {
    id: 'c9-recommendation-engine',
    title: '47. Design Recommendation Engine',
    category: 'ML & System Design',
    language: 'typescript',
    code: `// 47. Design Recommendation Engine (Coupang Specific)
// Bug 1: N+1 Database Queries fetching product details in a loop.
// Bug 2: Missing redis caching layer for top-ranked recommendations.

import { Request, Response } from 'express';

export async function getRecommendations(req: Request, res: Response) {
  const userId = req.params.userId;
  
  // Fetch candidate item IDs
  const candidateIds = await db.query('SELECT item_id FROM user_candidates WHERE user_id = $1', [userId]);
  
  const recommendations = [];
  
  // Bug 1: N+1 DB Queries! Executes SELECT for every candidate sequentially over network
  for (const row of candidateIds.rows) {
    const itemDetails = await db.query('SELECT * FROM products WHERE id = $1', [row.item_id]);
    recommendations.push(itemDetails.rows[0]);
  }
  
  // Bug 2: No Redis caching layer for hot items or user recommendation vectors
  return res.json({ recommendations });
}`,
    variants: {
      python: `# 47. Design Recommendation Engine
# Bug 1: N+1 database queries fetching product details in a loop.
# Bug 2: Missing a caching layer for top-ranked recommendations.

async def get_recommendations(user_id):
    # Fetch candidate item IDs
    candidate_rows = await db.fetch("SELECT item_id FROM user_candidates WHERE user_id = $1", user_id)

    recommendations = []

    # Bug 1: N+1 DB queries! Issues one SELECT per candidate, sequentially, over the network
    for row in candidate_rows:
        item_details = await db.fetch_one("SELECT * FROM products WHERE id = $1", row["item_id"])
        recommendations.append(item_details)

    # Bug 2: No caching layer for hot items or user recommendation vectors
    return {"recommendations": recommendations}`
    }
  },
  {
    id: 'c9-feature-store',
    title: '48. Design a Feature Store',
    category: 'ML & System Design',
    language: 'python',
    code: `# 48. Design a Feature Store (PySpark Feature Engineering)
# Bug 1: Point-in-time Join Leak! Joins features without constraining feature_timestamp <= event_timestamp.
# Bug 2: Unbounded skew shuffle in Spark join.

from pyspark.sql import functions as F

def join_user_features(orders_df, user_features_df):
    # Bug 1: Data Leakage! Direct join on user_id matches future feature updates created AFTER the order!
    # Correct approach requires point-in-time join (event_time >= feature_time)
    joined_df = orders_df.join(
        user_features_df,
        on="user_id",
        how="inner"
    )
    
    return joined_df`
  },
  {
    id: 'c9-realtime-inference',
    title: '49. Real-time ML Inference System',
    category: 'ML & System Design',
    language: 'go',
    code: `// 49. Design a Real-Time ML Inference Microservice
// Bug 1: Thread-unsafe slice mutation during batching leading to race condition data corruption.
// Bug 2: Missing latency timeout context circuit breaker.

package main

import (
	"fmt"
	"net/http"
)

type InferenceService struct {
	modelWeights []float64
}

var batchRequests []float64 // Bug 1: Global shared slice mutated across concurrent HTTP goroutines!

func (s *InferenceService) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	featureVal := 42.0
	
	// Bug 1: Race Condition! Concurrent requests append to shared slice without Mutex lock
	batchRequests = append(batchRequests, featureVal)

	if len(batchRequests) >= 10 {
		// Process batch
		fmt.Fprintln(w, "Batch processed")
		batchRequests = nil
	}
}`,
    variants: {
      python: `# 49. Design a Real-Time ML Inference Microservice
# Bug 1: Thread-unsafe list mutation during batching leads to race-condition data corruption.
# Bug 2: Missing a request timeout / circuit breaker for slow inference calls.

batch_requests = []  # Bug 1: Shared list mutated across concurrent request-handling threads!


def handle_request(feature_val):
    # Bug 1: Race condition! Concurrent requests append to the shared list without a lock
    batch_requests.append(feature_val)

    if len(batch_requests) >= 10:
        # Process batch
        print("Batch processed")
        batch_requests.clear()`
    }
  },
  {
    id: 'c9-petabyte-etl-pipeline',
    title: '50. ETL Pipeline for Petabytes of Data',
    category: 'ML & System Design',
    language: 'python',
    code: `# 50. Design an ETL Pipeline for Petabytes of Data (PySpark Dataflow)
# Bug 1: Data Skew OOM! GroupBy on heavily skewed key (e.g. 'null' or popular merchant ID) causes executor OOM.
# Bug 2: Missing partition repartitioning / salting before shuffle.

def process_petabyte_logs(spark_session, input_path, output_path):
    df = spark_session.read.parquet(input_path)

    # Bug 1: Extreme Data Skew! Millions of null merchant_ids accumulate in single executor partition -> OutOfMemoryError!
    # Bug 2: Fails to add salting (random key prefix) to distribute skewed keys evenly across cluster.
    aggregated_df = df.groupBy("merchant_id").agg(
        F.sum("transaction_amount").alias("total_sales"),
        F.countDistinct("user_id").alias("unique_buyers")
    )

    aggregated_df.write.mode("overwrite").parquet(output_path)`
  },

  // ==========================================
  // CATEGORY 10: ML ENGINEERING & LLM INFRA
  // ==========================================
  {
    id: 'c10-llm-eval-harness',
    title: '51. LLM Model Evaluation Harness (EM & LLM-as-a-Judge)',
    category: 'ML Engineering & LLM Infra',
    language: 'python',
    code: `# 51. LLM Evaluation Harness
# Bug 1: Non-deterministic sampling! Uses temperature=0.7 instead of temperature=0.0 / seed for reproducible evals.
# Bug 2: Exact Match normalization fails to lowercase/strip trailing punctuation, returning false negative zero scores.

import re

class LLMEvalHarness:
    def __init__(self, llm_client):
        self.client = llm_client

    def compute_exact_match(self, prediction: str, ground_truth: str) -> bool:
        # Bug 2: Raw string comparison without lowercasing, whitespace stripping, or punctuation normalization!
        return prediction == ground_truth

    def evaluate_dataset(self, test_cases):
        results = []
        for case in test_cases:
            # Bug 1: Non-deterministic temperature=0.7 makes evaluation benchmark non-reproducible!
            response = self.client.generate(
                prompt=case['prompt'],
                temperature=0.7, 
                max_tokens=100
            )
            
            is_correct = self.compute_exact_match(response, case['target'])
            results.append(is_correct)

        accuracy = sum(results) / len(results) if results else 0.0
        return {"accuracy": accuracy}`
  },
  {
    id: 'c10-rag-hybrid-search',
    title: '52. RAG Hybrid Search (BM25 + Dense Embeddings)',
    category: 'ML Engineering & LLM Infra',
    language: 'python',
    code: `# 52. RAG Hybrid Search (BM25 + Vector Cosine Similarity)
# Bug 1: Un-normalized score combination! Sums raw BM25 score [0, 50+] directly with Cosine Similarity [0, 1].
# Bug 2: Memory Leak storing full GPU embedding tensors in return dict.

import numpy as np

def hybrid_search(query, documents, bm25_retriever, vector_retriever, top_k=5):
    bm25_scores = bm25_retriever.get_scores(query) # Range: [0.0, 45.2]
    dense_scores = vector_retriever.get_cosine_similarities(query) # Range: [0.0, 1.0]

    hybrid_results = []
    for i, doc in enumerate(documents):
        # Bug 1: Scale mismatch! BM25 score completely dominates vector similarity, rendering dense embedding useless!
        # Fix: Min-Max normalize both score vectors to [0, 1] range before weighted sum.
        combined_score = 0.5 * bm25_scores[i] + 0.5 * dense_scores[i]
        
        hybrid_results.append({
            'doc_id': doc.id,
            'text': doc.text,
            'score': combined_score
        })

    hybrid_results.sort(key=lambda x: x['score'], reverse=True)
    return hybrid_results[:top_k]`
  },
  {
    id: 'c10-causal-self-attention',
    title: '53. Transformer Causal Self-Attention & KV Cache',
    category: 'ML Engineering & LLM Infra',
    language: 'python',
    code: `# 53. Transformer Causal Masked Self-Attention
# Bug 1: Softmax Causal Masking Bug! Fills masked future positions with 0.0 instead of -1e9 / -inf.
# Softmax(0.0) yields non-zero attention weights (~1.0) allowing model to look into future tokens!

import torch
import torch.nn as nn
import math

class CausalSelfAttention(nn.Module):
    def __init__(self, d_model, n_head):
        super().__init__()
        self.n_head = n_head
        self.d_k = d_model // n_head
        self.qkv_proj = nn.Linear(d_model, 3 * d_model)
        
    def forward(self, x):
        B, T, C = x.size()
        q, k, v = self.qkv_proj(x).chunk(3, dim=-1)
        
        # Calculate raw query-key scores
        scores = torch.matmul(q, k.transpose(-2, -1)) / math.sqrt(self.d_k)
        
        # Create upper triangular mask for causal self-attention
        mask = torch.triu(torch.ones(T, T), diagonal=1).bool()
        
        # Bug 1: Fills mask with 0.0! After Softmax, 0.0 becomes e^0 = 1.0, failing to mask future tokens!
        # Correct: scores.masked_fill_(mask, float('-inf'))
        scores = scores.masked_fill(mask, 0.0)
        
        attn_weights = torch.softmax(scores, dim=-1)
        return torch.matmul(attn_weights, v)`
  },
  {
    id: 'c10-lora-layer',
    title: '54. LoRA (Low-Rank Adaptation) Forward Pass',
    category: 'ML Engineering & LLM Infra',
    language: 'python',
    code: `# 54. LoRA (Low-Rank Adaptation) Fine-Tuning Layer
# Bug 1: Fails to freeze base model weights (base_layer.weight.requires_grad = True).
# Bug 2: Missing scaling factor alpha / r when adding low-rank delta matrix to forward output.

import torch
import torch.nn as nn

class LoRALinear(nn.Module):
    def __init__(self, in_features, out_features, r=8, lora_alpha=16):
        super().__init__()
        self.base_layer = nn.Linear(in_features, out_features)
        
        # Bug 1: Forgets to set self.base_layer.weight.requires_grad = False!
        # Base model continues updating, defeating memory-efficient LoRA fine-tuning!
        
        self.r = r
        self.lora_alpha = lora_alpha
        # LoRA A and B low-rank matrices
        self.lora_A = nn.Parameter(torch.randn(r, in_features))
        self.lora_B = nn.Parameter(torch.zeros(out_features, r))

    def forward(self, x):
        base_output = self.base_layer(x)
        
        # Compute LoRA Delta: x @ A^T @ B^T
        lora_output = (x @ self.lora_A.T) @ self.lora_B.T
        
        # Bug 2: Missing scaling factor! Must multiply lora_output by (self.lora_alpha / self.r)
        return base_output + lora_output`
  },
  {
    id: 'c10-dpo-loss',
    title: '55. DPO (Direct Preference Optimization) Loss',
    category: 'ML Engineering & LLM Infra',
    language: 'python',
    code: `# 55. Direct Preference Optimization (DPO) Loss
# Bug 1: Sign flip in log-ratio calculation between chosen and rejected sequences.
# Bug 2: Forgets to detach reference model outputs, causing unwanted backprop into reference network.

import torch
import torch.nn.functional as F

def dpo_loss(policy_chosen_logps, policy_rejected_logps, ref_chosen_logps, ref_rejected_logps, beta=0.1):
    # Bug 2: Missing ref_chosen_logps.detach()! Reference model gradient graph is retained.
    pi_logratios = policy_chosen_logps - policy_rejected_logps
    ref_logratios = ref_chosen_logps - ref_rejected_logps
    
    logits = pi_logratios - ref_logratios
    
    # Bug 1: Loss sign calculation error! DPO loss is -log(sigmoid(beta * logits))
    # Using positive log(sigmoid(...)) optimizes model to PREFER rejected answers!
    loss = torch.log(F.sigmoid(beta * logits)).mean()
    
    return loss`
  },
  {
    id: 'c10-quantization-int8',
    title: '56. INT8 Post-Training Model Quantization',
    category: 'ML Engineering & LLM Infra',
    language: 'python',
    code: `# 56. INT8 Post-Training Weight Quantization & Zero-Point
# Bug 1: Floating point zero-point calculation division by zero when min_val == max_val.
# Bug 2: Missing clamp/clip to [-128, 127], causing integer overflow when casting to int8.

import torch

def quantize_tensor_int8(tensor: torch.Tensor):
    min_val = tensor.min().item()
    max_val = tensor.max().item()

    # Scale factor S = (max - min) / (qmax - qmin)
    # qmin = -128, qmax = 127 -> range = 255
    scale = (max_val - min_val) / 255.0

    # Bug 1: Potential zero division when scale is 0.0 (all tensor values identical)!
    zero_point = round(-min_val / scale) - 128

    # Quantize formula: q = round(x / scale) + zero_point
    quantized = torch.round(tensor / scale) + zero_point

    # Bug 2: Missing quantized.clamp(-128, 127) before .to(torch.int8)!
    # Out-of-range values wrap around to negative numbers causing garbage model predictions.
    return quantized.to(torch.int8), scale, zero_point`
  },
  {
    id: 'c10-ddp-grad-accumulation',
    title: '57. Distributed Data Parallel (DDP) & Grad Accumulation',
    category: 'ML Engineering & LLM Infra',
    language: 'python',
    code: `# 57. PyTorch DDP Gradient Accumulation Loop
# Bug 1: Performs expensive All-Reduce cross-GPU communication on EVERY micro-batch!
# Bug 2: Double loss division leading to vanishing gradients.

import torch
import torch.distributed as dist

def train_epoch_ddp(model, dataloader, optimizer, accumulation_steps=4):
    model.train()
    optimizer.zero_grad()
    
    for i, (inputs, targets) in enumerate(dataloader):
        # Bug 1: Missing with model.no_sync() context during micro-batches 0 to accumulation_steps - 2!
        # Causes DDP to trigger costly All-Reduce network sync on every micro-batch!
        outputs = model(inputs)
        loss = F.cross_entropy(outputs, targets)
        
        # Scale loss for gradient accumulation
        loss = loss / accumulation_steps
        loss.backward()
        
        if (i + 1) % accumulation_steps == 0:
            # Bug 2: Redundant loss division or gradient scaling before step!
            optimizer.step()
            optimizer.zero_grad()`
  },
  {
    id: 'c10-llm-batch-dispatcher',
    title: '58. Request Batching Dispatcher for GPU Inference',
    category: 'ML Engineering & LLM Infra',
    language: 'python',
    code: `# Request Batching Dispatcher for GPU Inference
# Bug: Starts the max-wait timer from the FIRST request ever received instead
# of the first request in the CURRENT batch, so after any full-size flush the
# next batch's wait budget is already exhausted and every request flushes
# immediately as a batch of size 1 — destroying GPU utilization.

class BatchDispatcher:
    def __init__(self, max_batch_size=100, max_wait_seconds=0.05):
        self.max_batch_size = max_batch_size
        self.max_wait_seconds = max_wait_seconds
        self.pending = []
        self.batch_start_ts = None

    def submit(self, request, ts):
        if self.batch_start_ts is None:
            self.batch_start_ts = ts

        self.pending.append(request)

        if len(self.pending) >= self.max_batch_size:
            return self._flush()  # Bug: doesn't reset batch_start_ts here
        if ts - self.batch_start_ts >= self.max_wait_seconds:
            return self._flush()
        return None

    def _flush(self):
        batch = self.pending
        self.pending = []
        return batch

d = BatchDispatcher(max_batch_size=2, max_wait_seconds=0.05)
print(d.submit("r1", ts=0.0))    # None
print(d.submit("r2", ts=0.01))   # ['r1', 'r2'] — flush resets batch_start_ts? No!
print(d.submit("r3", ts=0.02))   # Expected None (batch just started) — but returns ['r3'] immediately`
  },

  // ==========================================
  // CATEGORY 11: STREAMING & EVENT PROCESSING
  // ==========================================
  {
    id: 'c11-fault-burst-detection',
    title: '59. Fault Burst Detection (Sliding Window per Key)',
    category: 'Streaming & Event Processing',
    language: 'typescript',
    code: `// 59. Fault Burst Detection
// Bug: Uses a strict "<" eviction check instead of accounting for the closed
// window boundary, so it silently drops the oldest timestamp one tick too early
// and undercounts bursts where two faults are exactly windowSeconds apart.

interface LogEvent {
  key: string;
  ts: number;
  type: string;
}

function keysWithFaultBursts(
  events: LogEvent[],
  windowSeconds: number,
  faultThreshold: number
): Set<string> {
  const flagged = new Set<string>();
  const faults = new Map<string, number[]>();

  for (const { key, ts, type } of events) {
    if (type !== 'FAULT' || flagged.has(key)) continue;

    const dq = faults.get(key) ?? [];
    dq.push(ts);

    // Bug: should evict while (ts - dq[0]) > windowSeconds (closed window).
    // Using ">=" here evicts a timestamp that is still exactly in-window.
    while (dq.length && ts - dq[0] >= windowSeconds) {
      dq.shift();
    }

    if (dq.length >= faultThreshold) {
      flagged.add(key);
    }
    faults.set(key, dq);
  }

  return flagged;
}

console.log(keysWithFaultBursts(
  [{ key: 'a', ts: 0, type: 'FAULT' }, { key: 'a', ts: 10, type: 'FAULT' }],
  10,
  2
)); // Expected: Set{'a'} (0 and 10 are exactly 10s apart -> should count)`,
    variants: {
      python: `# 59. Fault Burst Detection
# Bug: Uses a strict "<" eviction check instead of accounting for the closed
# window boundary, so it silently drops the oldest timestamp one tick too early
# and undercounts bursts where two faults are exactly window_seconds apart.

def keys_with_fault_bursts(events, window_seconds, fault_threshold):
    flagged = set()
    faults = {}

    for key, ts, etype in events:
        if etype != 'FAULT' or key in flagged:
            continue

        dq = faults.get(key, [])
        dq.append(ts)

        # Bug: should evict while (ts - dq[0]) > window_seconds (closed window).
        # Using ">=" here evicts a timestamp that is still exactly in-window.
        while dq and ts - dq[0] >= window_seconds:
            dq.pop(0)

        if len(dq) >= fault_threshold:
            flagged.add(key)
        faults[key] = dq

    return flagged


print(keys_with_fault_bursts(
    [('a', 0, 'FAULT'), ('a', 10, 'FAULT')],
    10,
    2
))  # Expected: {'a'} (0 and 10 are exactly 10s apart -> should count)`
    }
  },
  {
    id: 'c11-rate-limiter',
    title: '60. Per-Key Sliding Window Rate Limiter',
    category: 'Streaming & Event Processing',
    language: 'javascript',
    code: `// 60. Per-Key Sliding Window Rate Limiter
// Bug: Checks the limit before evicting expired timestamps, so a key that
// should have room again after old events age out stays rate-limited forever.

class RateLimiter {
  constructor(limit, windowSeconds) {
    this.limit = limit;
    this.window = windowSeconds;
    this.log = new Map();
  }

  accept(key, ts) {
    if (!this.log.has(key)) this.log.set(key, []);
    const dq = this.log.get(key);

    // Bug: limit check happens BEFORE eviction, so expired entries still count.
    if (dq.length >= this.limit) {
      return false;
    }

    while (dq.length && ts - dq[0] >= this.window) {
      dq.shift();
    }

    dq.push(ts);
    return true;
  }
}

const rl = new RateLimiter(2, 10);
console.log(rl.accept('v', 0));   // true
console.log(rl.accept('v', 5));   // true
console.log(rl.accept('v', 10));  // Expected: true (ts=0 has expired) — but returns false`,
    variants: {
      python: `# 60. Per-Key Sliding Window Rate Limiter
# Bug: Checks the limit before evicting expired timestamps, so a key that
# should have room again after old events age out stays rate-limited forever.

class RateLimiter:
    def __init__(self, limit, window_seconds):
        self.limit = limit
        self.window = window_seconds
        self.log = {}

    def accept(self, key, ts):
        dq = self.log.setdefault(key, [])

        # Bug: limit check happens BEFORE eviction, so expired entries still count.
        if len(dq) >= self.limit:
            return False

        while dq and ts - dq[0] >= self.window:
            dq.pop(0)

        dq.append(ts)
        return True


rl = RateLimiter(2, 10)
print(rl.accept('v', 0))   # True
print(rl.accept('v', 5))   # True
print(rl.accept('v', 10))  # Expected: True (ts=0 has expired) — but returns False`
    }
  },
  {
    id: 'c11-longest-healthy-stretch',
    title: '61. Longest Healthy Stretch (At Most K Warnings)',
    category: 'Streaming & Event Processing',
    language: 'python',
    code: `# 61. Longest Healthy Stretch
# Bug: Does not reset the WARN counter when the window is forced past a FAULT
# event, so warnings from before the fault keep counting against the new window.

def longest_healthy_stretch(events, k):
    best = 0
    left = 0
    warns = 0

    for right, (ts, etype) in enumerate(events):
        if etype == "FAULT":
            left = right + 1
            # Bug: missing "warns = 0" reset here — stale WARN count leaks
            # into the next window and can wrongly shrink it.
            continue
        if etype == "WARN":
            warns += 1
        while warns > k:
            if events[left][1] == "WARN":
                warns -= 1
            left += 1
        if left <= right:
            best = max(best, events[right][0] - events[left][0])

    return best

events = [(0, "WARN"), (1, "WARN"), (2, "FAULT"), (3, "OK"), (20, "OK")]
print(longest_healthy_stretch(events, 1))  # Expected: 17 (span [3,20], 0 warns)`
  },
  {
    id: 'c11-top-k-noisy-keys',
    title: '62. Top-K Noisiest Keys in Trailing Window',
    category: 'Streaming & Event Processing',
    language: 'typescript',
    code: `// 62. Top-K Noisiest Keys in Trailing Window
// Bug: Eviction decrements the count but never deletes zeroed-out keys from
// the map, so stale keys with count 0 pollute later top-k queries and the
// map grows unbounded (memory leak) as new keys stream in.

class TopKFaults {
  private windowSeconds: number;
  private k: number;
  private events: [number, string][] = [];
  private counts = new Map<string, number>();

  constructor(windowSeconds: number, k: number) {
    this.windowSeconds = windowSeconds;
    this.k = k;
  }

  addFault(key: string, ts: number): void {
    this.events.push([ts, key]);
    this.counts.set(key, (this.counts.get(key) ?? 0) + 1);
    this.evict(ts);
  }

  private evict(now: number): void {
    while (this.events.length && now - this.events[0][0] > this.windowSeconds) {
      const [, key] = this.events.shift()!;
      const next = (this.counts.get(key) ?? 0) - 1;
      // Bug: should delete the key once its count hits 0.
      this.counts.set(key, next);
    }
  }

  query(now: number): [string, number][] {
    this.evict(now);
    return [...this.counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, this.k);
  }
}

const tk = new TopKFaults(10, 2);
tk.addFault('a', 0);
console.log(tk.query(50)); // Expected: [] (a's fault expired) — but returns [['a', 0]]`,
    variants: {
      python: `# 62. Top-K Noisiest Keys in Trailing Window
# Bug: Eviction decrements the count but never deletes zeroed-out keys from
# the dict, so stale keys with count 0 pollute later top-k queries and the
# dict grows unbounded (memory leak) as new keys stream in.

class TopKFaults:
    def __init__(self, window_seconds, k):
        self.window_seconds = window_seconds
        self.k = k
        self.events = []  # (ts, key)
        self.counts = {}

    def add_fault(self, key, ts):
        self.events.append((ts, key))
        self.counts[key] = self.counts.get(key, 0) + 1
        self._evict(ts)

    def _evict(self, now):
        while self.events and now - self.events[0][0] > self.window_seconds:
            _, key = self.events.pop(0)
            next_count = self.counts.get(key, 0) - 1
            # Bug: should delete the key once its count hits 0.
            self.counts[key] = next_count

    def query(self, now):
        self._evict(now)
        return sorted(self.counts.items(), key=lambda kv: kv[1], reverse=True)[:self.k]


tk = TopKFaults(10, 2)
tk.add_fault('a', 0)
print(tk.query(50))  # Expected: [] (a's fault expired) — but returns [('a', 0)]`
    }
  },
  {
    id: 'c11-reorder-delayed-stream',
    title: '63. Reorder a Bounded-Delay Event Stream (Min-Heap)',
    category: 'Streaming & Event Processing',
    language: 'python',
    code: `# 63. Reorder a Bounded-Delay Event Stream
# Bug: Forgets to flush the remaining buffered events after the input stream
# ends, so the last max_delay seconds worth of events are silently dropped.

import heapq

def reorder_stream(events, max_delay):
    heap = []
    out = []
    newest = float("-inf")

    for ev in events:  # ev = (ts, payload)
        heapq.heappush(heap, ev)
        newest = max(newest, ev[0])
        while heap and heap[0][0] <= newest - max_delay:
            out.append(heapq.heappop(heap))

    # Bug: missing final drain of the heap — anything still buffered when
    # the stream ends never gets emitted.
    return out

events = [(3, "c"), (1, "a"), (2, "b")]
print(reorder_stream(events, 3))  # Expected: [(1,'a'),(2,'b'),(3,'c')] — returns []`
  },
  {
    id: 'c11-total-online-time',
    title: '64. Total Online Time from Connectivity Intervals',
    category: 'Streaming & Event Processing',
    language: 'javascript',
    code: `// 64. Total Online Time from Connectivity Intervals
// Bug: Merges intervals without sorting them first, so out-of-order input
// produces wrong totals whenever overlapping intervals aren't already adjacent.

function totalOnlineTime(intervals) {
  if (intervals.length === 0) return 0;

  // Bug: missing intervals.sort((a, b) => a[0] - b[0]) before merging.
  let total = 0;
  let [curStart, curEnd] = intervals[0];

  for (let i = 1; i < intervals.length; i++) {
    const [s, e] = intervals[i];
    if (s <= curEnd) {
      curEnd = Math.max(curEnd, e);
    } else {
      total += curEnd - curStart;
      [curStart, curEnd] = [s, e];
    }
  }

  return total + (curEnd - curStart);
}

console.log(totalOnlineTime([[20, 25], [0, 10], [5, 15]])); // Expected: 20 — unsorted input gives wrong result`,
    variants: {
      python: `# 64. Total Online Time from Connectivity Intervals
# Bug: Merges intervals without sorting them first, so out-of-order input
# produces wrong totals whenever overlapping intervals aren't already adjacent.

def total_online_time(intervals):
    if not intervals:
        return 0

    # Bug: missing intervals.sort(key=lambda iv: iv[0]) before merging.
    total = 0
    cur_start, cur_end = intervals[0]

    for s, e in intervals[1:]:
        if s <= cur_end:
            cur_end = max(cur_end, e)
        else:
            total += cur_end - cur_start
            cur_start, cur_end = s, e

    return total + (cur_end - cur_start)


print(total_online_time([[20, 25], [0, 10], [5, 15]]))  # Expected: 20 — unsorted input gives wrong result`
    }
  },
  {
    id: 'c11-severity-weighted-anomaly',
    title: '65. Severity-Weighted Anomaly Detector (Sliding Window)',
    category: 'Streaming & Event Processing',
    language: 'typescript',
    code: `// 65. Severity-Weighted Anomaly Detector
// Bug: Flags a key once its windowed severity sum reaches the threshold
// (">=") instead of strictly exceeding it (">"), so keys sitting exactly
// at their allowed budget get wrongly flagged as anomalous.

interface LogEvent {
  key: string;
  ts: number;
  level: string;
}

const SEVERITY: Record<string, number> = { ERROR: 2, WARN: 1, INFO: 0 };

function keysOverSeverityThreshold(
  events: LogEvent[],
  windowSeconds: number,
  severityThreshold: number
): Set<string> {
  const flagged = new Set<string>();
  const windows = new Map<string, [number, number][]>();
  const running = new Map<string, number>();

  for (const { key, ts, level } of events) {
    const w = SEVERITY[level] ?? 0;
    if (w === 0 || flagged.has(key)) continue;

    const dq = windows.get(key) ?? [];
    dq.push([ts, w]);
    running.set(key, (running.get(key) ?? 0) + w);

    while (dq.length && ts - dq[0][0] > windowSeconds) {
      const [, oldW] = dq.shift()!;
      running.set(key, (running.get(key) ?? 0) - oldW);
    }

    // Bug: should be "> severityThreshold" (strictly over budget).
    if ((running.get(key) ?? 0) >= severityThreshold) {
      flagged.add(key);
      windows.delete(key);
      running.delete(key);
      continue;
    }
    windows.set(key, dq);
  }

  return flagged;
}

console.log(keysOverSeverityThreshold(
  [{ key: 'a', ts: 0, level: 'WARN' }, { key: 'a', ts: 1, level: 'WARN' }],
  10,
  2
)); // Expected: Set{} (weight sums to exactly 2, not over budget) — but returns Set{'a'}`,
    variants: {
      python: `# 65. Severity-Weighted Anomaly Detector
# Bug: Flags a key once its windowed severity sum reaches the threshold
# (">=") instead of strictly exceeding it (">"), so keys sitting exactly
# at their allowed budget get wrongly flagged as anomalous.

SEVERITY = {'ERROR': 2, 'WARN': 1, 'INFO': 0}


def keys_over_severity_threshold(events, window_seconds, severity_threshold):
    flagged = set()
    windows = {}
    running = {}

    for key, ts, level in events:
        w = SEVERITY.get(level, 0)
        if w == 0 or key in flagged:
            continue

        dq = windows.get(key, [])
        dq.append((ts, w))
        running[key] = running.get(key, 0) + w

        while dq and ts - dq[0][0] > window_seconds:
            _, old_w = dq.pop(0)
            running[key] = running.get(key, 0) - old_w

        # Bug: should be "> severity_threshold" (strictly over budget).
        if running.get(key, 0) >= severity_threshold:
            flagged.add(key)
            windows.pop(key, None)
            running.pop(key, None)
            continue
        windows[key] = dq

    return flagged


print(keys_over_severity_threshold(
    [('a', 0, 'WARN'), ('a', 1, 'WARN')],
    10,
    2
))  # Expected: set() (weight sums to exactly 2, not over budget) — but returns {'a'}`
    }
  },
  {
    id: 'c11-rolling-p95-latency',
    title: '66. Rolling P95 Latency (Sliding Window Order Statistics)',
    category: 'Streaming & Event Processing',
    language: 'python',
    code: `# 66. Rolling P95 Latency (Sliding Window Order Statistics)
# Bug: Computes the p95 index BEFORE inserting the current event's latency
# into the sorted window, so every reported p95 lags one event behind.

from bisect import insort, bisect_left
from collections import deque

def rolling_p95_latency(events, window_seconds):
    out = []
    dq = deque()  # (ts, latency)
    sorted_latencies = []

    for ts, latency in events:
        dq.append((ts, latency))
        while dq and ts - dq[0][0] > window_seconds:
            _, old_latency = dq.popleft()
            i = bisect_left(sorted_latencies, old_latency)
            sorted_latencies.pop(i)

        # Bug: index is computed before insort() adds \`latency\`, so it reads
        # the *previous* window's order statistics instead of the current one.
        idx = max(0, int(round(0.95 * (len(sorted_latencies) - 1))))
        result = sorted_latencies[idx] if sorted_latencies else None
        insort(sorted_latencies, latency)
        out.append(result)

    return out

events = [(0, 100), (1, 200), (2, 300)]
print(rolling_p95_latency(events, window_seconds=10))
# Expected: [100, 200, 300] — returns [None, 100, 200]`
  },
  {
    id: 'c11-duplicate-action-detection',
    title: '67. Duplicate Action Detection (Sliding Window Keyed by User+Action)',
    category: 'Streaming & Event Processing',
    language: 'javascript',
    code: `// 67. Duplicate Action Detection
// Bug: Uses a strict "<" comparison instead of "<=", so a repeat action that
// lands exactly windowSeconds after the previous one is silently missed.

function duplicateActions(events, windowSeconds) {
  const flagged = new Set();
  const lastSeen = new Map(); // "user:action" -> most recent ts

  for (const { userId, ts, action } of events) {
    const key = \`\${userId}:\${action}\`;
    const prev = lastSeen.get(key);

    // Bug: should be "ts - prev <= windowSeconds" (closed window boundary).
    if (prev !== undefined && ts - prev < windowSeconds) {
      flagged.add(key);
    }
    lastSeen.set(key, ts);
  }

  return flagged;
}

console.log(duplicateActions([
  { userId: 'u1', ts: 0, action: 'CLICK' },
  { userId: 'u1', ts: 5, action: 'CLICK' },
], 5));
// Expected: Set{'u1:CLICK'} (exactly 5s apart, within a 5s window) — returns Set{}`,
    variants: {
      python: `# 67. Duplicate Action Detection
# Bug: Uses a strict "<" comparison instead of "<=", so a repeat action that
# lands exactly window_seconds after the previous one is silently missed.

def duplicate_actions(events, window_seconds):
    flagged = set()
    last_seen = {}  # "user:action" -> most recent ts

    for user_id, ts, action in events:
        key = f"{user_id}:{action}"
        prev = last_seen.get(key)

        # Bug: should be "ts - prev <= window_seconds" (closed window boundary).
        if prev is not None and ts - prev < window_seconds:
            flagged.add(key)
        last_seen[key] = ts

    return flagged


print(duplicate_actions([
    ('u1', 0, 'CLICK'),
    ('u1', 5, 'CLICK'),
], 5))
# Expected: {'u1:CLICK'} (exactly 5s apart, within a 5s window) — returns set()`
    }
  },

  // ==========================================
  // CATEGORY 12: SYSTEMS DESIGN & CONCURRENCY
  // ==========================================
  {
    id: 'c12-banking-system',
    title: '68. In-Memory Banking System (Timestamp-Ordered History)',
    category: 'Systems Design & Concurrency',
    language: 'go',
    code: `// 68. In-Memory Banking System — Timestamp-Ordered Transaction History
// Bug: GetTransactions uses a lower-bound search for BOTH ends of the range,
// so any transaction sitting exactly at endTs is excluded from the result.

package main

import (
	"fmt"
	"sort"
)

type Transaction struct {
	Timestamp int
	Kind      string
	Amount    int
}

type BankingSystem struct {
	timestamps map[string][]int
	history    map[string][]Transaction
}

func NewBankingSystem() *BankingSystem {
	return &BankingSystem{
		timestamps: make(map[string][]int),
		history:    make(map[string][]Transaction),
	}
}

func (b *BankingSystem) record(account string, ts int, kind string, amount int) {
	b.timestamps[account] = append(b.timestamps[account], ts)
	b.history[account] = append(b.history[account], Transaction{ts, kind, amount})
}

// GetTransactions should return transactions with startTs <= ts <= endTs.
func (b *BankingSystem) GetTransactions(account string, startTs, endTs int) []Transaction {
	ts := b.timestamps[account]
	lo := sort.SearchInts(ts, startTs)
	// Bug: should search for the index PAST the last ts <= endTs (an upper
	// bound). Reusing a lower-bound search here excludes ts == endTs.
	hi := sort.SearchInts(ts, endTs)
	return b.history[account][lo:hi]
}

func main() {
	bank := NewBankingSystem()
	bank.record("a1", 0, "deposit", 100)
	bank.record("a1", 10, "deposit", 50)
	bank.record("a1", 20, "withdrawal", 30)

	txs := bank.GetTransactions("a1", 5, 20)
	fmt.Println(len(txs)) // Expected: 2 (ts=10 and ts=20) — returns 1
}`,
    variants: {
      python: `# 68. In-Memory Banking System — Timestamp-Ordered Transaction History
# Bug: get_transactions uses a lower-bound search for BOTH ends of the range,
# so any transaction sitting exactly at end_ts is excluded from the result.

from bisect import bisect_left


class BankingSystem:
    def __init__(self):
        self.timestamps = {}
        self.history = {}

    def record(self, account, ts, kind, amount):
        self.timestamps.setdefault(account, []).append(ts)
        self.history.setdefault(account, []).append((ts, kind, amount))

    # get_transactions should return transactions with start_ts <= ts <= end_ts.
    def get_transactions(self, account, start_ts, end_ts):
        ts = self.timestamps.get(account, [])
        lo = bisect_left(ts, start_ts)
        # Bug: should search for the index PAST the last ts <= end_ts (an upper
        # bound). Reusing a lower-bound search here excludes ts == end_ts.
        hi = bisect_left(ts, end_ts)
        return self.history.get(account, [])[lo:hi]


bank = BankingSystem()
bank.record("a1", 0, "deposit", 100)
bank.record("a1", 10, "deposit", 50)
bank.record("a1", 20, "withdrawal", 30)

txs = bank.get_transactions("a1", 5, 20)
print(len(txs))  # Expected: 2 (ts=10 and ts=20) — returns 1`
    }
  },
  {
    id: 'c12-ttl-cache',
    title: '69. TTL Cache / Key-Value Store with Expiry',
    category: 'Systems Design & Concurrency',
    language: 'rust',
    code: `// 69. TTL Cache / Key-Value Store with Expiry
// Bug: Expiry check uses "now > exp" instead of "now >= exp", so a key
// survives one extra instant past the moment it should have expired.

use std::collections::HashMap;

struct TTLCache {
    store: HashMap<String, String>,
    expiry: HashMap<String, f64>,
}

impl TTLCache {
    fn new() -> Self {
        TTLCache { store: HashMap::new(), expiry: HashMap::new() }
    }

    fn set(&mut self, key: &str, value: &str, ttl_seconds: f64, now: f64) {
        self.store.insert(key.to_string(), value.to_string());
        self.expiry.insert(key.to_string(), now + ttl_seconds);
    }

    fn get(&mut self, key: &str, now: f64) -> Option<String> {
        let exp = *self.expiry.get(key)?;
        // Bug: should be \`now >= exp\` — the expiry instant itself is expired.
        if now > exp {
            self.store.remove(key);
            self.expiry.remove(key);
            return None;
        }
        self.store.get(key).cloned()
    }
}

fn main() {
    let mut cache = TTLCache::new();
    cache.set("k1", "v1", 10.0, 0.0);
    println!("{:?}", cache.get("k1", 10.0)); // Expected: None (expired exactly at ts=10) — returns Some("v1")
}`,
    variants: {
      python: `# 69. TTL Cache / Key-Value Store with Expiry
# Bug: Expiry check uses "now > exp" instead of "now >= exp", so a key
# survives one extra instant past the moment it should have expired.

class TTLCache:
    def __init__(self):
        self.store = {}
        self.expiry = {}

    def set(self, key, value, ttl_seconds, now):
        self.store[key] = value
        self.expiry[key] = now + ttl_seconds

    def get(self, key, now):
        if key not in self.expiry:
            return None
        exp = self.expiry[key]
        # Bug: should be \`now >= exp\` — the expiry instant itself is expired.
        if now > exp:
            del self.store[key]
            del self.expiry[key]
            return None
        return self.store.get(key)


cache = TTLCache()
cache.set("k1", "v1", 10.0, 0.0)
print(cache.get("k1", 10.0))  # Expected: None (expired exactly at ts=10) — returns 'v1'`
    }
  },
  {
    id: 'c12-file-dedup',
    title: '70. File Deduplication via Content Hashing',
    category: 'Systems Design & Concurrency',
    language: 'python',
    code: `# 70. File Deduplication via Content Hashing
# Bug: Only hashes the FIRST chunk of each file instead of streaming through
# all of it, so any two files sharing the same first chunk_size bytes are
# wrongly reported as duplicates even if their later content differs.

import hashlib
import tempfile

def hash_file_path(path, chunk_size=65536):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        # Bug: should loop with \`for chunk in iter(lambda: f.read(chunk_size), b"")\`
        # to hash the ENTIRE file; this only ever hashes the first chunk.
        chunk = f.read(chunk_size)
        h.update(chunk)
    return h.hexdigest()

def find_duplicate_files_on_disk(paths, chunk_size=65536):
    by_hash = {}
    for path in paths:
        by_hash.setdefault(hash_file_path(path, chunk_size), []).append(path)
    return [group for group in by_hash.values() if len(group) > 1]

# Two files share the same first 70,000 bytes but differ after that —
# they should NOT be reported as duplicates.
with tempfile.NamedTemporaryFile(delete=False) as f1, tempfile.NamedTemporaryFile(delete=False) as f2:
    f1.write(b"A" * 70000 + b"file-one-tail")
    f2.write(b"A" * 70000 + b"file-two-tail")
    p1, p2 = f1.name, f2.name

print(find_duplicate_files_on_disk([p1, p2], chunk_size=65536))
# Expected: [] (tails differ) — returns [[p1, p2]] since only the shared first chunk is hashed`
  },
  {
    id: 'c12-concurrent-crawler',
    title: '71. Concurrent Web Crawler (Visited-Set Race)',
    category: 'Systems Design & Concurrency',
    language: 'go',
    code: `// 71. Concurrent Web Crawler — Visited-Set Race
// Bug: a URL is marked visited only AFTER fetch() returns, not before. Two
// goroutines that see the same not-yet-visited URL at the same time can
// both pass the check and both fetch it — a check-then-act race.

package main

import (
	"fmt"
	"sync"
)

func crawl(urls []string, fetch func(string), workers int) {
	visited := make(map[string]bool)
	var mu sync.Mutex
	jobs := make(chan string, len(urls))
	for _, u := range urls {
		jobs <- u
	}
	close(jobs)

	var wg sync.WaitGroup
	for i := 0; i < workers; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for url := range jobs {
				mu.Lock()
				already := visited[url]
				mu.Unlock()
				if already {
					continue
				}

				fetch(url) // <-- race window: not marked visited yet

				mu.Lock()
				visited[url] = true // Bug: should be set BEFORE calling fetch()
				mu.Unlock()
			}
		}()
	}
	wg.Wait()
}

func main() {
	var mu sync.Mutex
	fetchCount := 0
	fetch := func(url string) {
		mu.Lock()
		fetchCount++
		mu.Unlock()
	}
	// Same URL queued twice — two workers can both slip past the check.
	crawl([]string{"http://x.com/shared", "http://x.com/shared"}, fetch, 4)
	fmt.Println(fetchCount) // Expected: 1 (deduped by visited set) — can print 2 under the race
}`,
    variants: {
      python: `# 71. Concurrent Web Crawler — Visited-Set Race
# Bug: a URL is marked visited only AFTER fetch() returns, not before. Two
# threads that see the same not-yet-visited URL at the same time can
# both pass the check and both fetch it — a check-then-act race.

import queue
import threading


def crawl(urls, fetch, workers):
    visited = {}
    lock = threading.Lock()
    jobs = queue.Queue()
    for u in urls:
        jobs.put(u)

    def worker():
        while True:
            try:
                url = jobs.get_nowait()
            except queue.Empty:
                return

            with lock:
                already = visited.get(url, False)
            if already:
                continue

            fetch(url)  # <-- race window: not marked visited yet

            with lock:
                visited[url] = True  # Bug: should be set BEFORE calling fetch()

    threads = [threading.Thread(target=worker) for _ in range(workers)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()


fetch_count = 0
count_lock = threading.Lock()


def fetch(url):
    global fetch_count
    with count_lock:
        fetch_count += 1


# Same URL queued twice — two workers can both slip past the check.
crawl(["http://x.com/shared", "http://x.com/shared"], fetch, 4)
print(fetch_count)  # Expected: 1 (deduped by visited set) — can print 2 under the race`
    }
  },
  {
    id: 'c12-stack-trace-bottleneck',
    title: '72. Stack-Trace Bottleneck Finder (Appearance Counts)',
    category: 'Systems Design & Concurrency',
    language: 'python',
    code: `# 72. Stack-Trace Bottleneck Finder — Appearance Counts
# Bug: Counts every frame occurrence in a sample instead of deduping per
# sample first, so a recursive function appearing multiple times in a
# SINGLE sample's stack gets over-counted relative to functions that only
# ever appear once per sample.

from collections import Counter

def find_high_level_bottlenecks(samples, top_n=3):
    appearance_counts = Counter()
    for s in samples:
        # Bug: should be \`appearance_counts.update(set(s["frames"]))\` so each
        # sample contributes at most once per function name.
        appearance_counts.update(s["frames"])
    return appearance_counts.most_common(top_n)

samples = [
    {"frames": ["main", "recurse", "recurse", "recurse"]},  # 1 sample, recursive
    {"frames": ["main", "handle_request"]},                  # 1 sample
]
print(find_high_level_bottlenecks(samples, top_n=1))
# Expected: [('main', 2)] (appears in both samples) — returns [('recurse', 3)]`
  },
  {
    id: 'c12-priority-delay-queue',
    title: '73. Priority + Delay Message Queue (Two-Heap Design)',
    category: 'Systems Design & Concurrency',
    language: 'typescript',
    code: `// 73. Priority + Delay Message Queue
// Bug: Promotion check uses "<" instead of "<=", so a message whose
// delayUntil exactly equals \`now\` is left pending one extra tick instead
// of becoming visible immediately.

type Pending = { delayUntil: number; seq: number; priority: number; message: string };
type Visible = { priority: number; seq: number; message: string };

class PriorityDelayQueue {
  private pending: Pending[] = [];
  private visible: Visible[] = [];
  private seq = 0;

  enqueue(message: string, priority: number, delayUntil: number): void {
    this.pending.push({ delayUntil, seq: this.seq++, priority, message });
    this.pending.sort((a, b) => a.delayUntil - b.delayUntil);
  }

  private promoteReady(now: number): void {
    // Bug: should be \`this.pending[0].delayUntil <= now\`.
    while (this.pending.length && this.pending[0].delayUntil < now) {
      const p = this.pending.shift()!;
      this.visible.push({ priority: p.priority, seq: p.seq, message: p.message });
      this.visible.sort((a, b) => b.priority - a.priority || a.seq - b.seq);
    }
  }

  dequeue(now: number): string | null {
    this.promoteReady(now);
    if (!this.visible.length) return null;
    return this.visible.shift()!.message;
  }
}

const q = new PriorityDelayQueue();
q.enqueue('future', 10, 100);
console.log(q.dequeue(100)); // Expected: 'future' (visible exactly at ts=100) — returns null`,
    variants: {
      python: `# 73. Priority + Delay Message Queue
# Bug: Promotion check uses "<" instead of "<=", so a message whose
# delay_until exactly equals \`now\` is left pending one extra tick instead
# of becoming visible immediately.

class PriorityDelayQueue:
    def __init__(self):
        self.pending = []  # list of dicts: delay_until, seq, priority, message
        self.visible = []  # list of dicts: priority, seq, message
        self.seq = 0

    def enqueue(self, message, priority, delay_until):
        self.pending.append({"delay_until": delay_until, "seq": self.seq, "priority": priority, "message": message})
        self.seq += 1
        self.pending.sort(key=lambda p: p["delay_until"])

    def _promote_ready(self, now):
        # Bug: should be \`self.pending[0]["delay_until"] <= now\`.
        while self.pending and self.pending[0]["delay_until"] < now:
            p = self.pending.pop(0)
            self.visible.append({"priority": p["priority"], "seq": p["seq"], "message": p["message"]})
            self.visible.sort(key=lambda v: (-v["priority"], v["seq"]))

    def dequeue(self, now):
        self._promote_ready(now)
        if not self.visible:
            return None
        return self.visible.pop(0)["message"]


q = PriorityDelayQueue()
q.enqueue('future', 10, 100)
print(q.dequeue(100))  # Expected: 'future' (visible exactly at ts=100) — returns None`
    }
  },
  {
    id: 'c12-diagnostic-agent-retry',
    title: '74. Diagnostic Agent — Retry Helper (State Machine with Retries)',
    category: 'Systems Design & Concurrency',
    language: 'javascript',
    code: `// 74. Diagnostic Agent — Retry Helper
// Bug: callWithRetry swallows the error after exhausting retries instead of
// re-throwing it, so a permanently-failing tool silently returns \`undefined\`
// instead of propagating the failure to the caller.

class ToolError extends Error {}

function callWithRetry(fn, maxRetries = 2) {
  let lastErr = null;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return fn();
    } catch (e) {
      if (!(e instanceof ToolError)) throw e;
      lastErr = e;
    }
  }
  // Bug: should \`throw lastErr\` here instead of falling through.
  return undefined;
}

const alwaysFails = () => { throw new ToolError('permanently down'); };
console.log(callWithRetry(alwaysFails, 1));
// Expected: throws ToolError('permanently down') after exhausting retries — returns undefined instead`,
    variants: {
      python: `# 74. Diagnostic Agent — Retry Helper
# Bug: call_with_retry swallows the error after exhausting retries instead of
# re-raising it, so a permanently-failing tool silently returns \`None\`
# instead of propagating the failure to the caller.

class ToolError(Exception):
    pass


def call_with_retry(fn, max_retries=2):
    last_err = None
    for attempt in range(max_retries + 1):
        try:
            return fn()
        except ToolError as e:
            last_err = e
    # Bug: should \`raise last_err\` here instead of falling through.
    return None


def always_fails():
    raise ToolError('permanently down')


print(call_with_retry(always_fails, 1))
# Expected: raises ToolError('permanently down') after exhausting retries — returns None instead`
    }
  },
  // Added later — Arrays & Sliding Window: release-string comparison, a common variant of the
  // "compare version numbers" interview question.
  {
    id: 'c1-release-tag-comparator',
    title: '75. Release Tag Comparator',
    category: 'Arrays & Sliding Window',
    language: 'typescript',
    code: `// 75. Release Tag Comparator
// A build system tags each release like "2.10.1" or "2.10.1-beta" (dotted numeric
// segments, optionally followed by a hyphen and a pre-release label). Given two tags,
// return -1 / 0 / 1 depending on which one shipped first: compare the numeric segments
// left to right, and if every segment matches, a tag WITHOUT a pre-release label is
// considered newer than the same tag WITH one (e.g. "2.10.1" ships after "2.10.1-beta").
//
// Bug: Numeric segments are compared as strings, so "9" ranks above "10".
// Bug 2: The pre-release-label tie-break is backwards — a tagged pre-release is
// currently treated as newer than the final release instead of older.

function compareReleaseTags(a: string, b: string): number {
  const [aCore, aTag] = a.split('-');
  const [bCore, bTag] = b.split('-');

  const aParts = aCore.split('.');
  const bParts = bCore.split('.');
  const len = Math.max(aParts.length, bParts.length);

  for (let i = 0; i < len; i++) {
    const aSeg = aParts[i] ?? '0';
    const bSeg = bParts[i] ?? '0';
    // Bug: string comparison instead of numeric comparison
    if (aSeg > bSeg) return 1;
    if (aSeg < bSeg) return -1;
  }

  // Bug 2: should be the opposite — a pre-release tag means "older", not "newer"
  if (aTag && !bTag) return 1;
  if (!aTag && bTag) return -1;
  if (aTag && bTag) return aTag < bTag ? -1 : aTag > bTag ? 1 : 0;

  return 0;
}

console.log(compareReleaseTags('1.9.0', '1.10.0')); // Expected: -1 (1.9.0 shipped first) — returns 1
console.log(compareReleaseTags('2.0.0-rc1', '2.0.0')); // Expected: -1 (rc1 shipped first) — returns 1`,
    variants: {
      python: `# 75. Release Tag Comparator
# Bug: Numeric segments are compared as strings, so "9" ranks above "10".
# Bug 2: The pre-release-label tie-break is backwards — a tagged pre-release is
# currently treated as newer than the final release instead of older.

def compare_release_tags(a, b):
    a_core, _, a_tag = a.partition('-')
    b_core, _, b_tag = b.partition('-')

    a_parts = a_core.split('.')
    b_parts = b_core.split('.')
    length = max(len(a_parts), len(b_parts))

    for i in range(length):
        a_seg = a_parts[i] if i < len(a_parts) else '0'
        b_seg = b_parts[i] if i < len(b_parts) else '0'
        # Bug: string comparison instead of numeric comparison
        if a_seg > b_seg:
            return 1
        if a_seg < b_seg:
            return -1

    # Bug 2: should be the opposite — a pre-release tag means "older", not "newer"
    if a_tag and not b_tag:
        return 1
    if not a_tag and b_tag:
        return -1
    if a_tag and b_tag:
        return -1 if a_tag < b_tag else (1 if a_tag > b_tag else 0)

    return 0


print(compare_release_tags('1.9.0', '1.10.0'))  # Expected: -1 (1.9.0 shipped first) — returns 1
print(compare_release_tags('2.0.0-rc1', '2.0.0'))  # Expected: -1 (rc1 shipped first) — returns 1`
    }
  }
];

