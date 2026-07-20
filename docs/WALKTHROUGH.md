# 🎬 Code Walkthrough & Demo Presentation Script

> A step-by-step presentation script designed for live demos, technical interviews, team onboarding, and video recordings.

---

## ⏱️ Demo Outline (5 Minutes Total)

| Section | Time | Objective |
| :--- | :--- | :--- |
| **1. Introduction & Problem Statement** | 0:45 | Explain why developers need instant Big-O and security code reviews. |
| **2. Live Code Review Demo (LeetCode Preset)** | 1:30 | Load a buggy LeetCode problem & analyze Big-O complexity badges. |
| **3. Persona & Focus Switching** | 1:00 | Demonstrate switching between Big-O Specialist and System Architect. |
| **4. 1-Click AI Automated Fix** | 0:45 | Trigger inline 1-click bug resolution. |
| **5. Technical Architecture Overview** | 1:00 | Showcase Next.js 16, Vercel AI SDK, and OpenRouter integration. |

---

## 🎙️ Step-by-Step Speaker Script

### Step 1: Introduction (0:00 - 0:45)
> *"Welcome! Today I'm demonstrating the **AI Code Reviewer & Big-O Complexity Analyst**. When developers solve coding interview questions or prepare code for production pull requests, general AI chats can be slow, unformatted, or non-deterministic. We built a dedicated developer platform powered by **Next.js 16**, **Monaco Editor**, and **Vercel AI SDK** with **Google Gemini 2.5** via OpenRouter."*

### Step 2: Selecting a Preset & Running Analysis (0:45 - 2:15)
> *"Let's test a classic interview question. From the Problem Preset dropdown, I'll select **LeetCode #1: Two Sum**. Notice how the editor populates with JavaScript code containing a nested loop $O(N^2)$ algorithm, an out-of-bounds loop condition, and a self-matching bug."*
>
> *(Click "Run Code Review")*
>
> *"Within 3 seconds, the AI generates a structured JSON review report. Look at the top metrics:*
> * **Score:** 3/10
> * **Time Complexity:** $O(N^2) \rightarrow O(N)$
> * **Auxiliary Space:** $O(N)$
> * **Identified Issues:** Line 35 out-of-bounds access, Line 37 self-index match."*

### Step 3: 1-Click AI Automated Fix (2:15 - 3:00)
> *"Instead of manually fixing the code, I can click **'Fix This Issue'** next to Line 37. The AI generates an isolated patch in 2 seconds, replacing the nested loop with a hash map lookup."*

### Step 4: Persona Switching (3:00 - 4:00)
> *"Now let's switch review focus. In the top header bar, I'll change the persona from **⚡ Big-O Complexity Specialist** to **🛡️ Production System Architect**. If we load **Problem #46: Design a Search Ranking System**, the system architect persona immediately flags data leaks and missing approximate vector indices."*

### Step 5: Wrap Up & Architecture (4:00 - 5:00)
> *"Under the hood, the app uses **Zod schemas** to guarantee structured JSON output from `google/gemini-2.5-flash`, avoiding traditional AI parser errors. Thank you!"*
