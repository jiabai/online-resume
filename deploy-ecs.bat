@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo   Resume → 阿里云 ECS 部署 (Windows)
echo ========================================

:: ---- 配置文件 ----
set CONFIG_FILE=.ecs-deploy-config
set REMOTE_DIR=/var/www/resume

:: 读取配置
if exist "%CONFIG_FILE%" (
    for /f "usebackq tokens=1,* delims==" %%a in ("%CONFIG_FILE%") do (
        if "%%a"=="SERVER" set SERVER=%%b
        if "%%a"=="DOMAIN" set DOMAIN=%%b
    )
)

:: 参数或交互式输入服务器地址
if "%~1"=="" (
    if "%SERVER%"=="" (
        echo.
        echo [WARN] 未指定目标服务器:
        echo   用法: deploy-ecs.bat root@120.xx.xx.xx
        echo.
        set /p SERVER=请输入服务器地址 (例如 root@120.xx.xx.xx):
    )
) else (
    set SERVER=%~1
)

if "%SERVER%"=="" (
    echo [ERROR] 必须提供服务器地址
    pause & exit /b 1
)

:: 保存配置
echo SERVER=%SERVER%> "%CONFIG_FILE%"
echo # 部署时间: %date:~0,10% %time:~0,5%>> "%CONFIG_FILE%"

echo [INFO] 目标服务器: %SERVER%
echo [INFO] 远程目录:   %REMOTE_DIR%

:: ---- 检查依赖 ----
where npm >nul 2>&1 || (
    echo [ERROR] 请先安装 Node.js: https://nodejs.org/
    pause & exit /b 1
)

where rsync >nul 2>&1 && (
    set USE_SCP=false
) || (
    echo [INFO] rsync 未安装，将使用 scp 模式
    set USE_SCP=true
)

:: ---- Step 1: 本地构建 ----
echo.
echo [INFO] Step 1/4: 本地构建项目...

if not exist node_modules (
    echo [INFO] 安装依赖...
    call npm install
)

call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] 构建失败，请检查代码错误后重试
    pause & exit /b 1
)

for %%A in (dist) do set BUILD_SIZE=%%~zxA
echo [OK] 构建完成

:: ---- Step 2: 检查远程环境 ----
echo.
echo [INFO] Step 2/4: 检查远程环境...

ssh %SERVER% "test -d %REMOTE_DIR% && echo EXISTS || echo NEW" >nul 2>&1 | findstr "NEW" >nul && (
    echo [WARN] 远程目录不存在，正在创建...
    ssh %SERVER% "sudo mkdir -p %REMOTE_DIR% && sudo chown \$(whoami) %REMOTE_DIR%"
)

echo [OK] 远程环境就绪

:: ---- Step 3: 上传文件 ----
echo.
echo [INFO] Step 3/4: 上传构建产物...

if "%USE_SCP%"=="true" (
    :: SCP 模式
    ssh %SERVER% "rm -rf %REMOTE_DIR%/*" 2>nul
    scp -r dist\* %SERVER%:%REMOTE_DIR%/
) else (
    :: Rsync 模式
    rsync -avz --delete --progress dist\ %SERVER%:%REMOTE_DIR%/
)

echo [OK] 上传完成

:: ---- Step 4: 验证部署 ----
echo.
echo [INFO] Step 4/4: 验证部署...

ssh %SERVER% "test -f %REMOTE_DIR%/index.html" >nul 2>&1
if %errorlevel% equ 0 (
    for /f %%i in ('ssh %SERVER% "find %REMOTE_DIR% -type f ^| wc -l"') do set FILE_COUNT=%%i
    for /f %%i in ('ssh %SERVER% "du -sh %REMOTE_DIR%^| cut -f1"') do set REMOTE_SIZE=%%i
    echo [OK] 验证通过: !FILE_COUNT! 个文件，总大小 !REMOTE_SIZE!
) else (
    echo [ERROR] 部署验证失败: 未找到 index.html
    pause & exit /b 1
)

:: ---- 完成 ----
echo.
echo ========================================
echo   [OK] 部署完成!
echo ========================================
echo.

:: 提取显示 URL
set DISPLAY_IP=%SERVER:*@=%
set DISPLAY_IP=%DISPLAY_IP::=%

if defined DOMAIN (
    echo 访问地址: https://%DOMAIN%
) else (
    echo 访问地址: http://%DISPLAY_IP%
)
echo.
echo 常用命令:
echo   重新部署:   deploy-ecs.sh
echo   查看日志:   ssh %SERVER% 'tail -f /var/log/nginx/resume_access.log'
echo   进入服务器: ssh %SERVER%
echo.

pause
