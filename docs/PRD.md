# 📄 Product Requirements Document (PRD)

## Project Name: AI Code Reviewer & Big-O Complexity Analyst
**Version:** 1.0.0  
**Status:** Approved & Live  
**Target Audience:** Software Engineers, Tech Leads, Candidates Preparing for Coding Interviews (LeetCode / FAANG / Coupang), ML Infrastructure Engineers.

---

## 🎯 Executive Summary & Vision

The **AI Code Reviewer** is a web-based developer tool and interview preparation environment designed to perform instant static code reviews, algorithmic Big-O complexity evaluations, security audits, and automated AI code fixes across 5 programming languages (**JavaScript**, **TypeScript**, **Python**, **Go**, and **Rust**).

Unlike generic AI chat tools, AI Code Reviewer enforces **structured JSON schema responses** powered by Vercel AI SDK and OpenRouter (`google/gemini-2.5-flash`), delivering fast, actionable, line-by-line feedback with zero idle timeouts.

---

## 👥 Target User Personas

1. **Interview Candidate (LeetCode / Algorithm Practice):**
   * *Needs:* Immediate evaluation of time complexity $O(N)$ vs space complexity $O(1)$, identification of hidden edge-case bugs, off-by-one errors, and infinite loops.
2. **Senior Developer / Code Reviewer:**
   * *Needs:* Automated pre-PR checks for memory safety, concurrency race conditions, SQL injection, path traversal, and anti-patterns.
3. **ML Infra Engineer / System Designer:**
   * *Needs:* System-level evaluation of data pipeline bottlenecks (PySpark skew), vector search scaling (FAISS/HNSW), and LLM evaluation harness bugs.

---

## ⚙️ Core Product Features

### 1. Multi-Persona AI Review Modes
* **⚡ Big-O Complexity Specialist:** Evaluates Big-O Time and Auxiliary Space bounds, lower-bound math, and data structure choices.
* **🛡️ Production System Architect:** Focuses on thread safety, concurrency race conditions, memory leaks, and enterprise scale.
* **🔥 Strict Senior Dev:** Blunt, no-nonsense code quality and security flaw assessment.
* **🌱 Friendly Technical Mentor:** Educational, encouraging, and detailed step-by-step guidance.

### 2. Pre-Loaded Problem Library (57 Presets across 10 Categories)
* **Category 1:** Arrays & Sliding Window (7 problems)
* **Category 2:** HashMap & Frequency (5 problems)
* **Category 3:** Graphs & BFS/DFS (6 problems)
* **Category 4:** Trees (7 problems)
* **Category 5:** Dynamic Programming (6 problems)
* **Category 6:** Stack & Queue (5 problems)
* **Category 7:** Binary Search (4 problems)
* **Category 8:** Linked Lists (5 problems)
* **Category 9:** ML & System Design (5 problems)
* **Category 10:** ML Engineering & LLM Infra (7 problems)

### 3. Real-Time Big-O Complexity Dashboard
* Highlights Time Complexity ($O(N^2) \rightarrow O(N)$) badge.
* Highlights Auxiliary Space Complexity ($O(N) \rightarrow O(1)$) badge.
* Displays dedicated algorithmic analysis explaining bottlenecks.

### 4. 1-Click AI Fix & Refactor Engine
* Each identified issue includes a **"Fix This Issue"** button.
* Triggers `/api/fix` endpoint to generate an isolated, 1-click drop-in fix and code explanation.

---

## 📊 Success Metrics & Non-Functional Requirements

* **Performance:** Review response latency $< 5$ seconds using `google/gemini-2.5-flash`.
* **Reliability:** 0% JSON schema parsing failures or idle timeouts.
* **Type Safety:** 100% strict TypeScript compilation with zero `any` types.
* **Accessibility & UI:** Dark glassmorphism interface powered by Monaco Editor and Lucide icons.
