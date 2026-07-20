# ⚡ AI Code Reviewer & Big-O Complexity Analyst

> An AI-powered code review platform and interview preparation suite built with **Next.js 16 (Turbopack)**, **Vercel AI SDK**, **Monaco Editor**, and **OpenRouter (Google Gemini 2.5)**.

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Next.js 16](https://img.shields.io/badge/Next.js-16.2.10-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Vercel AI SDK](https://img.shields.io/badge/AI_SDK-v4.0-violet)

---

## 🌟 Key Features

* **⚡ Real-time Big-O Complexity Analysis:** Evaluates exact Time Complexity ($O(N), O(N \log N), O(2^N)$) and Auxiliary Space Complexity ($O(1)$ vs $O(N)$) for any code snippet.
* **🎭 4 Specialized Review Personas:**
  1. **⚡ Big-O Complexity Specialist:** Laser-focused on algorithmic efficiency, nested loop bounds, and data structure choices.
  2. **🛡️ Production System Architect:** Focused on memory safety, concurrency, race conditions, path traversal, SQL injection, and petabyte-scale throughput.
  3. **🔥 Strict Senior Dev:** Direct, blunt, no-nonsense PR review focused on production quality and anti-patterns.
  4. **🌱 Friendly Technical Mentor:** Educational, warm, and encouraging feedback explaining the "why" behind every suggestion.
* **📚 57 Built-in Interview & System Presets across 10 Categories:** Includes LeetCode classics, distributed systems, and ML engineering questions (Coupang/FAANG style).
* **💻 Interactive Monaco Code Editor:** Syntax highlighting, code folding, and auto-formatting for **JavaScript**, **TypeScript**, **Python**, **Go**, and **Rust**.
* **✨ 1-Click AI Automated Fixes:** Instantly resolves identified issues line-by-line with a single click.

---

## 🗂️ Preset Problem Library (57 Questions across 10 Categories)

| Category | Problems Included |
| :--- | :--- |
| **🗂️ 1. Arrays & Sliding Window** | Max Sum Subarray of size K, Min Sum Subarray, First Negative in Window, Longest Substring Without Repeating, Longest Substring with K Distinct, Sliding Window Maximum, Subarray with Given Sum |
| **🗂️ 2. HashMap & Frequency** | Two Sum, Group Anagrams, Top K Frequent Elements, Longest Consecutive Sequence, Subarray Sum Equals K |
| **🗂️ 3. Graphs & BFS/DFS** | Number of Provinces, Number of Enclaves, Number of Islands, Rotting Oranges (BFS), Word Ladder (BFS), Course Schedule (Cycle Detection) |
| **🗂️ 4. Trees** | Tree Traversals (Pre/In/Post Order), House Robber III (Tree DP), Max Depth of Binary Tree, Diameter of Binary Tree, Lowest Common Ancestor, Level Order Traversal, Validate BST |
| **🗂️ 5. Dynamic Programming** | House Robber I (1D DP), House Robber II (Circular DP), Climbing Stairs, Coin Change, Longest Common Subsequence (2D DP), Word Break |
| **🗂️ 6. Stack & Queue** | Valid Parentheses, Min Stack, Daily Temperatures (Monotonic Stack), Largest Rectangle in Histogram, Implement Queue using Stacks |
| **🗂️ 7. Binary Search** | Binary Search Basics, Search in Rotated Sorted Array, Find Peak Element, Kth Smallest in Sorted Matrix |
| **🗂️ 8. Linked Lists** | Reverse Linked List, Detect Cycle (Floyd Fast & Slow), Merge Two Sorted Lists, Find Middle of Linked List, LRU Cache |
| **🗂️ 9. ML & System Design** | Design Search Ranking System, Design Recommendation Engine, Design Feature Store, Real-time ML Inference System, Petabyte ETL Pipeline |
| **🗂️ 10. ML Engineering & LLM Infra** | LLM Eval Harness (EM/ROUGE), RAG Hybrid Search (BM25 + Dense), Transformer Causal Self-Attention & KV Cache, LoRA Layer, DPO Loss, INT8 Quantization, PyTorch DDP Grad Accumulation |

---

## 🚀 Quickstart & Installation

### Prerequisites
* Node.js **>= 18.0.0**
* npm or yarn or pnpm
* OpenRouter API key

### 1. Clone the repository & install dependencies
```bash
git clone https://github.com/your-username/ai-code-reviewer.git
cd ai-code-reviewer
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```
Add your OpenRouter API key:
```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

### 3. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🛠️ Verification & Build Commands

```bash
# Type check TypeScript code
npx tsc --noEmit

# Run ESLint validation
npm run lint

# Build optimized production bundle
npm run build

# Start production server
npm run start
```

---

## 📁 Documentation & Guides

Comprehensive documentation is available in the [`docs/`](file:///Volumes/LaCie/ai-code-reviewer/docs) directory:

* 📄 **[PRD (Product Requirements Document)](file:///Volumes/LaCie/ai-code-reviewer/docs/PRD.md)**: Product goals, target user personas, system features, and roadmap.
* 🛠️ **[TDD (Technical Design Document)](file:///Volumes/LaCie/ai-code-reviewer/docs/TDD.md)**: Architectural design, API endpoints, Zod schemas, state management, and error handling strategy.
* 🎬 **[Code Walkthrough & Presentation Script](file:///Volumes/LaCie/ai-code-reviewer/docs/WALKTHROUGH.md)**: Step-by-step presentation script for live demos, interviews, and video walkthroughs.
* 📖 **[User Guide](file:///Volumes/LaCie/ai-code-reviewer/docs/USER_GUIDE.md)**: End-user instructions for testing preset questions, custom code reviews, and Big-O badges.

---

## 📄 License

This project is licensed under the [MIT License](file:///Volumes/LaCie/ai-code-reviewer/LICENSE).
