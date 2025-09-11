@echo off
echo ========================================
echo    GitHub Deployment Helper Script
echo ========================================
echo.

echo This script will help you deploy your React project to GitHub.
echo.

echo Step 1: Navigate to your project directory
cd human-project

echo.
echo Step 2: Initialize Git repository (if not already done)
git init

echo.
echo Step 3: Add all files to Git
git add .

echo.
echo Step 4: Commit your changes
git commit -m "Initial commit - Ready for deployment"

echo.
echo ========================================
echo    Next Steps (Manual):
echo ========================================
echo.
echo 1. Go to GitHub.com and create a new repository
echo 2. Copy the repository URL
echo 3. Run these commands in your terminal:
echo.
echo    git branch -M main
echo    git remote add origin YOUR_REPOSITORY_URL
echo    git push -u origin main
echo.
echo 4. Go to repository Settings ^> Pages
echo 5. Set Source to "GitHub Actions"
echo 6. Your site will be available at: https://YOUR_USERNAME.github.io/REPOSITORY_NAME
echo.
echo ========================================
pause
