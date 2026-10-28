@echo off
REM ==============================================================================
REM Script: push_to_github.bat (Windows CMD / PowerShell)
REM Purpose: Initialize and push PythonActivity repository to student's GitHub
REM Student: Nagna Boyina Satya Sri
REM Repo:    https://github.com/nagnaboyinasatyasri/PythonActivity.git
REM ==============================================================================

echo === PythonActivity GitHub Automated Upload Assistant ===
echo Target: https://github.com/nagnaboyinasatyasri/PythonActivity.git
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
git remote add origin https://github.com/nagnaboyinasatyasri/PythonActivity.git

echo.
echo === READY TO PUSH ===
echo Run the following command to complete push to your repository:
echo.
echo   git push -u origin main
echo.
pause
