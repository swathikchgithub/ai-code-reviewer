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
    | 'ML Engineering & LLM Infra';
  language: 'javascript' | 'typescript' | 'python' | 'go' | 'rust';
  code: string;
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
console.log(maxSumSubarrayK([2, 1, 5, 1, 3, 2], 3)); // Expected: 9 (5+1+3)`
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

console.log(firstNegativeInWindow([12, -1, -7, 8, -15, 30, 16, 28], 3));`
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

console.log(lengthOfLongestSubstring("abba"));`
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

console.log(maxSlidingWindow([1,3,-1,-3,5,3,6,7], 3));`
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
}`
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

console.log(twoSum([3, 2, 4], 6));`
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

console.log(topKFrequent([1,1,1,2,2,3], 2));`
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

console.log(longestConsecutive([100, 4, 200, 1, 3, 2]));`
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

console.log(findCircleNum([[1,1,0],[1,1,0],[0,0,1]]));`
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
}`
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
}`
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
}`
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
}`
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
}`
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
}`
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
}`
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

console.log(rob([1, 2, 3, 1]));`
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

console.log(climbStairs(45));`
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
}`
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
}`
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
}`
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
}`
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
}`
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
}`
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
}`
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
}`
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
}`
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
}`
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
}`
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
  }
];

