# 📖 User Guide: How to Use AI Code Reviewer

Welcome to the **AI Code Reviewer**! This guide walks you through analyzing code, evaluating Big-O complexity, testing pre-loaded questions, and applying automated 1-click fixes.

---

## 🖥️ Navigating the Interface

```
+------------------------------------------------------------------------------------+
| ⚡ AI Code Reviewer      [ Preset Dropdown ▾ ]  [ Persona Focus ▾ ]  [ ▶ Run Review ] |
+--------------------------------------------------+---------------------------------+
| Monaco Code Editor                               | Review Output Panel             |
|                                                  | • Quality Score Ring (e.g. 4/10)|
| 1: function twoSum(nums, target) {               | • ⏱️ Time Complexity: O(N²)      |
| 2:   for (let i = 0; i < nums.length; i++) {     | • 💾 Space Complexity: O(N)     |
| 3:     ...                                       | • Identified Issues List        |
|                                                  | • Refactored Code Preview       |
+--------------------------------------------------+---------------------------------+
```

---

## 🚀 How to Review Your Own Custom Code

1. **Paste Your Code:** Click inside the Monaco Editor on the left panel and paste any code snippet.
2. **Select Language:** Choose your code language (**JavaScript**, **TypeScript**, **Python**, **Go**, or **Rust**) from the language dropdown.
3. **Choose Persona / Focus:**
   * **⚡ Big-O Complexity Specialist:** For algorithmic bounds ($O(N)$ vs $O(N^2)$).
   * **🛡️ Production System Architect:** For security, thread safety, and memory leaks.
   * **🔥 Strict Senior Dev:** For direct, blunt PR review feedback.
   * **🌱 Friendly Technical Mentor:** For educational explanation.
4. **Click "Run Code Review":** Click the purple **Analyze Code** button in the header.

---

## 📚 How to Use Pre-Loaded Questions

1. Click the **Problem Preset** dropdown menu in the header.
2. Select any problem from the **10 Categories** (e.g. *LeetCode #1 Two Sum*, *LLM Eval Harness*, *RAG Hybrid Search*).
3. The editor automatically updates the code and selects the matching language.
4. Click **"Run Code Review"** to see instant Big-O analysis and issue detection.

---

## 🛠️ Applying 1-Click AI Fixes

1. Scroll down to the **Identified Issues** section in the review result panel.
2. Each issue displays a line number, severity tag, description, and a **"Fix This Issue"** button.
3. Click **"Fix This Issue"**.
4. The AI will generate a drop-in code snippet resolving that specific issue along with an explanation of the fix.
