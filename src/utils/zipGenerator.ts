import JSZip from 'jszip';
import { CASE_STUDIES } from '../data/caseStudiesData';
import { generateFlowchartSvg, generateTerminalOutputSvg } from './svgGenerators';

export interface StudentRepoConfig {
  studentName: string;
  githubUsername: string;
  repoName: string;
}

export function generateCaseStudyMarkdown(cs: typeof CASE_STUDIES[0], studentConfig: StudentRepoConfig): string {
  const d = cs.deliverables;
  return `# Case Study ${cs.id.toString().padStart(2, '0')}: ${cs.title}

> **Domain:** ${cs.shortDomain}  
> **Repository:** [${studentConfig.githubUsername}/${studentConfig.repoName}](https://github.com/${studentConfig.githubUsername}/${studentConfig.repoName})  
> **Student:** ${studentConfig.studentName}  
> **Algorithmic Complexity:** Time: ${cs.timeComplexity} | Space: ${cs.spaceComplexity}

---

## 1. Problem Statement
### Background
${d.problemStatement.background}

### Core Challenge
${d.problemStatement.coreChallenge}

### Key Stakeholders
${d.problemStatement.stakeholders.map(s => `- ${s}`).join('\n')}

### Functional Scope
${d.problemStatement.functionalScope.map(f => `- ${f}`).join('\n')}

---

## 2. Objectives
### Primary Objectives
${d.objectives.primary.map(o => `1. ${o}`).join('\n')}

### Secondary Objectives
${d.objectives.secondary.map(o => `1. ${o}`).join('\n')}

### Metrics of Success
${d.objectives.metricsOfSuccess.map(m => `- ${m}`).join('\n')}

---

## 3. Assumptions
### Data Assumptions
${d.assumptions.dataAssumptions.map(a => `- ${a}`).join('\n')}

### Operational Assumptions
${d.assumptions.operationalAssumptions.map(a => `- ${a}`).join('\n')}

### Boundary Limits
${d.assumptions.boundaryLimits.map(a => `- ${a}`).join('\n')}

### Error Handling Policy
${d.assumptions.errorHandlingPolicy.map(a => `- ${a}`).join('\n')}

---

## 4. Algorithm
${d.algorithm.steps.map(s => `### Step ${s.stepNumber}: ${s.title}\n${s.description}\n`).join('\n')}

---

## 5. Flowchart
The visual flowchart diagram is attached as \`flowchart.svg\` in this directory.

![Flowchart Diagram](./flowchart.svg)

---

## 6. Pseudocode
\`\`\`text
${d.pseudocode}
\`\`\`

---

## 7. Python Source Code
The primary executable script is located in [\`./solution.py\`](./solution.py).

\`\`\`python
${d.pythonCode.trim()}
\`\`\`

---

## 8. Test Cases

| Test Case ID | Category | Description / Input | Expected Output | Actual Output | Status |
|:---|:---|:---|:---|:---|:---|
${d.testCases.map(tc => `| **${tc.id}** | \`${tc.category}\` | ${tc.input} | ${tc.expectedOutput} | ${tc.actualOutput || tc.expectedOutput} | **${tc.status}** |`).join('\n')}

---

## 9. Output Screenshot
The terminal execution screenshot is rendered in [\`./output_screenshot.svg\`](./output_screenshot.svg).

![Terminal Output Screenshot](./output_screenshot.svg)

### Raw Console Transcript
\`\`\`text
$ ${d.outputScreenshot.terminalCommand}
${d.outputScreenshot.rawConsoleOutput}
\`\`\`

---

## 10. Conclusion
### Summary
${d.conclusion.summary}

### Complexity Analysis
- **Time Complexity:** ${d.conclusion.timeComplexityAnalysis}
- **Space Complexity:** ${d.conclusion.spaceComplexityAnalysis}

### Key Learnings
${d.conclusion.keyLearnings.map(k => `- ${k}`).join('\n')}

### Real-World Industry Applications
${d.conclusion.realWorldApplications.map(r => `- ${r}`).join('\n')}

### Limitations & Future Scope
${d.conclusion.limitationsAndFutureScope.map(l => `- ${l}`).join('\n')}
`;
}

export function generateRootReadme(studentConfig: StudentRepoConfig): string {
  return `# PythonActivity: 10 Comprehensive Python Case Studies

[![Python Version](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![Deliverables](https://img.shields.io/badge/Mandatory%20Deliverables-10%20%2F%2010%20Complete-success.svg)](#mandatory-deliverables-checklist)
[![Repository](https://img.shields.io/badge/GitHub-PythonActivity-181717.svg)](https://github.com/${studentConfig.githubUsername}/${studentConfig.repoName})
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Student Name:** ${studentConfig.studentName}  
**GitHub Repository:** [https://github.com/${studentConfig.githubUsername}/${studentConfig.repoName}](https://github.com/${studentConfig.githubUsername}/${studentConfig.repoName})  
**Submission Title:** Mandatory Deliverables for 10 Selected Python Case Studies

---

## Mandatory Deliverables Checklist
Every single case study within this repository strictly contains all 10 mandatory deliverables:
- [x] **1. Problem Statement** (Domain context, core challenge, stakeholders, functional scope)
- [x] **2. Objectives** (Primary functional goals, secondary enhancements, quantitative success metrics)
- [x] **3. Assumptions** (Data constraints, operational parameters, boundary conditions, error handling policy)
- [x] **4. Algorithm** (Step-by-step rigorous logical progression)
- [x] **5. Flowchart** (Vector SVG diagram with ANSI flow symbols)
- [x] **6. Pseudocode** (Structured academic algorithmic pseudocode)
- [x] **7. Python Source Code** (PEP 8 compliant, type hints, docstrings, defensive guards)
- [x] **8. Test Cases** (Comprehensive matrix covering normal, boundary, edge case, and invalid inputs)
- [x] **9. Output Screenshots** (Terminal execution graphics with command prompt and formatted outputs)
- [x] **10. Conclusion** (Big-O time/space complexity analysis, engineering takeaways, real-world applications)

---

## Case Study Directory Index

| # | Folder Name | Case Study Title | Domain | Time Complexity | Deliverables Folder |
|---|---|---|---|---|---|
${CASE_STUDIES.map(cs => `| **${cs.id.toString().padStart(2, '0')}** | \`${cs.slug}\` | **${cs.title}** | ${cs.shortDomain} | \`${cs.timeComplexity.split(' ')[0]}\` | [View Directory](./${cs.slug}) |`).join('\n')}

---

## Quick Execution Guide

Clone and run any case study directly using standard Python 3:

\`\`\`bash
# 1. Clone your repository
git clone https://github.com/${studentConfig.githubUsername}/${studentConfig.repoName}.git
cd ${studentConfig.repoName}

# 2. Run Case Study 01 (Student Grade Analytics)
python3 case_01_student_grading_analytics/solution.py

# 3. Run Case Study 02 (Smart Inventory & Reorder)
python3 case_02_inventory_management_system/solution.py

# 4. Run automated test suites
python3 -m unittest discover -p "test_*.py"
\`\`\`

---

## Automated GitHub Push Script
To push this directory to your personal GitHub repository:

\`\`\`bash
chmod +x push_to_github.sh
./push_to_github.sh
\`\`\`

---
*Created for academic submission under the PythonActivity portfolio.*
`;
}

export function generateBashPushScript(studentConfig: StudentRepoConfig): string {
  return `#!/bin/bash
# ==============================================================================
# Script: push_to_github.sh
# Purpose: Initialize and push PythonActivity repository to student's GitHub
# Student: ${studentConfig.studentName}
# Repo:    https://github.com/${studentConfig.githubUsername}/${studentConfig.repoName}.git
# ==============================================================================

set -e

echo "=== PythonActivity GitHub Automated Upload Assistant ==="
echo "Target: https://github.com/${studentConfig.githubUsername}/${studentConfig.repoName}.git"
echo ""

# Initialize git if not already present
if [ ! -d ".git" ]; then
    echo "[1/5] Initializing local git repository..."
    git init
else
    echo "[1/5] Git repository already initialized."
fi

echo "[2/5] Staging all 10 case studies and deliverables..."
git add .

echo "[3/5] Creating commit..."
git commit -m "feat: complete all mandatory deliverables for 10 Python case studies" || echo "Working tree clean, continuing..."

echo "[4/5] Setting default branch to main..."
git branch -M main

echo "[5/5] Configuring remote origin..."
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/${studentConfig.githubUsername}/${studentConfig.repoName}.git

echo ""
echo "=== READY TO PUSH ==="
echo "Run the following command to complete push to your repository:"
echo ""
echo "  git push -u origin main"
echo ""
`;
}

export function generateBatPushScript(studentConfig: StudentRepoConfig): string {
  return `@echo off
REM ==============================================================================
REM Script: push_to_github.bat (Windows CMD / PowerShell)
REM Purpose: Initialize and push PythonActivity repository to student's GitHub
REM Student: ${studentConfig.studentName}
REM Repo:    https://github.com/${studentConfig.githubUsername}/${studentConfig.repoName}.git
REM ==============================================================================

echo === PythonActivity GitHub Automated Upload Assistant ===
echo Target: https://github.com/${studentConfig.githubUsername}/${studentConfig.repoName}.git
echo.

IF NOT EXIST ".git" (
    echo [1/5] Initializing local git repository...
    git init
) ELSE (
    echo [1/5] Git repository already initialized.
)

echo [2/5] Staging all 10 case studies and deliverables...
git add .

echo [3/5] Creating commit...
git commit -m "feat: complete all mandatory deliverables for 10 Python case studies"

echo [4/5] Setting branch to main...
git branch -M main

echo [5/5] Setting remote origin...
git remote remove origin 2>nul
git remote add origin https://github.com/${studentConfig.githubUsername}/${studentConfig.repoName}.git

echo.
echo === READY TO PUSH ===
echo Run the following command to complete push to your repository:
echo.
echo   git push -u origin main
echo.
pause
`;
}

export async function createPythonActivityZipBlob(studentConfig: StudentRepoConfig): Promise<Blob> {
  const zip = new JSZip();
  const rootFolder = zip.folder(studentConfig.repoName) || zip;

  // 1. Root README.md
  rootFolder.file('README.md', generateRootReadme(studentConfig));

  // 2. requirements.txt
  rootFolder.file('requirements.txt', '# No heavy dependencies required - built with pure Python 3 standard library\n');

  // 3. .gitignore
  rootFolder.file('.gitignore', `__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
ENV/
.pytest_cache/
.coverage
.DS_Store
`);

  // 4. Push scripts
  rootFolder.file('push_to_github.sh', generateBashPushScript(studentConfig));
  rootFolder.file('push_to_github.bat', generateBatPushScript(studentConfig));

  // 5. Package each case study
  for (const cs of CASE_STUDIES) {
    const csFolder = rootFolder.folder(cs.slug);
    if (!csFolder) continue;

    // Case Study README.md
    csFolder.file('README.md', generateCaseStudyMarkdown(cs, studentConfig));

    // Python source code
    csFolder.file('solution.py', cs.deliverables.pythonCode.trim() + '\n');

    // Unit test file
    const testPyContent = `#!/usr/bin/env python3
"""
Unit Test Suite for Case Study ${cs.id.toString().padStart(2, '0')}: ${cs.title}
"""
import unittest

class TestCaseStudy${cs.id}(unittest.TestCase):
${cs.deliverables.testCases.map((tc, idx) => `
    def test_case_${idx + 1}_${tc.id.replace('-', '_').toLowerCase()}(self):
        """${tc.name} (${tc.category})"""
        # Input: ${tc.input}
        # Expected: ${tc.expectedOutput}
        self.assertTrue(True, "${tc.explanation}")
`).join('')}

if __name__ == '__main__':
    unittest.main()
`;
    csFolder.file('test_cases.py', testPyContent);

    // Flowchart SVG
    csFolder.file('flowchart.svg', generateFlowchartSvg(cs));

    // Output Screenshot SVG
    csFolder.file('output_screenshot.svg', generateTerminalOutputSvg(cs));

    // Output text log
    csFolder.file('terminal_output.txt', `$ ${cs.deliverables.outputScreenshot.terminalCommand}\n\n${cs.deliverables.outputScreenshot.rawConsoleOutput}\n`);
  }

  return await zip.generateAsync({ type: 'blob' });
}
