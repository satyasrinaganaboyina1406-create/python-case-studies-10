#!/bin/bash
# ==============================================================================
# Script: push_to_github.sh
# Purpose: Initialize and push PythonActivity repository to student's GitHub
# Student: Nagna Boyina Satya Sri
# Repo:    https://github.com/nagnaboyinasatyasri/PythonActivity.git
# ==============================================================================

set -e

echo "=== PythonActivity GitHub Automated Upload Assistant ==="
echo "Target: https://github.com/nagnaboyinasatyasri/PythonActivity.git"
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
git remote add origin https://github.com/nagnaboyinasatyasri/PythonActivity.git

echo ""
echo "=== READY TO PUSH ==="
echo "Run the following command to complete push to your repository:"
echo ""
echo "  git push -u origin main"
echo ""
