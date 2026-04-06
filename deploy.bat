@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo   Resume Deploy Script (Windows)
echo ========================================

:: ---- 检查前置条件 ----
where git >nul 2>&1 || (
    echo [ERROR] 请先安装 Git: https://git-scm.com/download/win
    pause & exit /b 1
)
where node >nul 2>&1 || (
    echo [ERROR] 请先安装 Node.js: https://nodejs.org/
    pause & exit /b 1
)

:: ---- 确定仓库地址 ----
set REPO_NAME=%~1
if "%REPO_NAME%"=="" (
    for /f %%i in ('git config --get remote.origin.url 2^>nul') do set REMOTE_URL=%%i
    if defined REMOTE_URL (
        set REPO_NAME=%REMOTE_URL:*github.com:=%
        set REPO_NAME=%REPO_NAME:.git=%
    )
)

if "%REPO_NAME%"=="" (
    echo.
    echo [WARN] 无法自动检测仓库名，请手动指定:
    echo   用法: deploy.bat ^<用户名/仓库名^>
    echo.
    set /p REPO_NAME=输入 GitHub 仓库名 (例如 aaron/resume):
)

if "%REPO_NAME%"=="" (
    echo [ERROR] 必须提供仓库名
    pause & exit /b 1
)

echo [INFO] 目标仓库: https://github.com/%REPO_NAME%

:: ---- 检查 Git 仓库 ----
if not exist .git (
    echo [INFO] 初始化 Git 仓库...
    git init
    git add -A
    git commit -m "Initial commit: resume site"
) else (
    echo [INFO] Git 仓库已存在
)

:: ---- 检查远程仓库 ----
set HAS_REMOTE=
for /f %%i in ('git remote get-url origin 2^>nul') do set HAS_REMOTE=%%i
if not defined HAS_REMOTE (
    echo [INFO] 添加远程仓库...
    git remote add origin https://github.com/%REPO_NAME%.git
)

:: ---- 安装依赖 ----
if not exist node_modules (
    echo [INFO] 安装依赖...
    call npm install
) else (
    echo [OK] 依赖已就绪
)

:: ---- 构建 ----
echo [INFO] 开始构建...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] 构建失败，请检查代码错误后重试
    pause & exit /b 1
)
echo [OK] 构建完成

:: ---- 部署到 gh-pages 分支 ----
set DEPLOY_DIR=.deploy_temp
echo [INFO] 准备部署到 gh-pages 分支...

:: 清理旧目录
if exist %DEPLOY_DIR% rmdir /s /q %DEPLOY_DIR%

mkdir %DEPLOY_DIR% 2>nul
xcopy dist\*.* %DEPLOY_DIR%\ /E /Y /Q >nul

cd /d %DEPLOY_DIR%

:: 初始化并提交
if not exist .git (
    git init
)

:: 清除旧文件并复制新构建产物
for /d %%d in (*) do if not "%%d"==".git" rmdir /s /q "%%d" 2>nul
for %%f in (*) do if not "%%f"==".gitignore" del /q "%%f" 2>nul
xcopy ..\dist\*.* .\ /E /Y /Q >nul

:: 创建 .nojekyll 文件（GitHub Pages 必需）
type nul > .nojekyll

git add -A
git commit -m "Deploy %date:~0,10% %time:~0,5%" --allow-empty 2>nul

:: 推送到 gh-pages 分支
git branch -M gh-pages
git push origin gh-pages --force

cd /d ..
rmdir /s /q %DEPLOY_DIR%

echo.
echo ========================================
echo   [OK] 部署完成!
echo ========================================
echo.
echo 你的简历已上线:
echo   https://%REPO_NAME:/=/.github.io/%
echo.
echo 首次访问可能需要等待 1-2 分钟生效。
echo 如需自定义域名, 请在仓库 Settings ^> Pages 中配置。
echo.

pause
