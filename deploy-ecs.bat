@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo   Resume → 阿里云 ECS 部署 (Windows)
echo   方式A: 上传源码 → 服务器构建
echo ========================================

::: ---- 配置文件 ----
set CONFIG_FILE=.ecs-deploy-config
set REMOTE_DIR=/var/www/resume
set DIST_DIR=%REMOTE_DIR%\dist

::: 读取配置
if exist "%CONFIG_FILE%" (
    for /f "usebackq tokens=1,* delims==" %%a in ("%CONFIG_FILE%") do (
        if "%%a"=="SERVER" set SERVER=%%b
        if "%%a"=="DOMAIN" set DOMAIN=%%b
    )
)

::: 参数或交互式输入服务器地址
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

::: 保存配置
echo SERVER=%SERVER%> "%CONFIG_FILE%"
echo # 部署时间: %date:~0,10% %time:~0,5%>> "%CONFIG_FILE%"

echo [INFO] 目标服务器: %SERVER%
echo [INFO] 远程源码:   %REMOTE_DIR%
echo [INFO] 构建产物:   %DIST_DIR% (Nginx root)

::: ---- 检查依赖 ----
where rsync >nul 2>&1 && (
    set USE_SCP=false
) || (
    echo [INFO] rsync 未安装，将使用 tar+ssh 模式
    set USE_SCP=true
)

::: ---- Step 1: 上传源码到服务器 ----
echo.
echo [INFO] Step 1/4: 上传源码到服务器...

ssh %SERVER% "mkdir -p %REMOTE_DIR%" >nul 2>&1

if "%USE_SCP%"=="true" (
    :: 使用 tar 打包后传输（高效）
    echo [INFO] 使用 tar+ssh 传输源码...
    ssh %SERVER% "rm -rf %REMOTE_DIR%/node_modules %REMOTE_DIR%/dist" 2>nul
    tar --exclude=node_modules --exclude=dist --exclude=.git --exclude=.deploy_temp --exclude=.ecs-deploy-config -czf - . | ssh %SERVER% "tar -xzf - -C %REMOTE_DIR%"
) else (
    :: Rsync 增量同步
    echo [INFO] 使用 Rsync 增量同步...
    rsync -avz --progress --exclude=node_modules --exclude=dist --exclude=.git --exclude=.deploy_temp --exclude=.ecs-deploy-config .\ %SERVER%:%REMOTE_DIR%\
)

echo [OK] 源码上传完成

::: ---- Step 2: 服务器端安装依赖并构建 ----
echo.
echo [INFO] Step 2/4: 服务器端构建...

ssh %SERVER% bash^ -s ^<^< REMOTE_EOF
set -e
cd /var/www/resume

if ! command -v node ^&^>/dev/null; then
    echo "[INFO] 安装 Node.js..."
    curl -fsSL https://rpm.nodesource.com/setup_20.x ^| bash -
    yum install -y nodejs 2>/dev/null ^|^| apt-get install -y nodejs 2>/dev/null
fi

rm -rf dist

if [ ! -d "node_modules" ]; then
    echo "[INFO] 安装依赖..."
    npm install --prefer-offline
else
    echo "[OK] 依赖已就绪"
fi

echo "[INFO] 开始构建..."
npm run build

if [ ! -d "dist" ] ^|^| [ -z "$(ls -A dist 2>/dev/null)" ]; then
    echo "[ERROR] 构建失败"
    exit 1
fi

echo "[OK] 构建完成 ($(du -sh dist ^| cut -f1))"
REMOTE_EOF

if %errorlevel% neq 0 (
    echo [ERROR] 远程构建失败，请检查日志
    pause & exit /b 1
)

echo [OK] 服务器构建完成

::: ---- Step 3: 验证部署 ----
echo.
echo [INFO] Step 3/4: 验证部署结果...

for /f %%i in ('ssh %SERVER% "test -f %DIST_DIR%/index.html ^&^& echo OK ^|^| echo FAIL"') do set INDEX_CHECK=%%i

if "%INDEX_CHECK%"=="OK" (
    for /f %%i in ('ssh %SERVER% "find %DIST_DIR% -type f ^| wc -l"') do set FILE_COUNT=%%i
    for /f %%i in ('ssh %SERVER% "du -sh %DIST_DIR%^| cut -f1"') do set REMOTE_SIZE=%%i
    echo [OK] 验证通过: !FILE_COUNT! 个文件，总大小 !REMOTE_SIZE!
) else (
    echo [ERROR] 部署验证失败: 未找到 %DIST_DIR%\index.html
    pause & exit /b 1
)

::: ---- Step 4: 重载 Nginx ----
echo.
echo [INFO] Step 4/4: 重载 Nginx...

ssh %SERVER% "nginx -t ^&^& systemctl reload nginx" >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARN] Nginx 重载失败，尝试启动...
    ssh %SERVER% "systemctl start nginx" >nul 2>&1
)

echo [OK] Nginx 已重载

::: ---- 完成 ----
echo.
echo ========================================
echo   [OK] 部署完成!
echo ========================================
echo.

::: 显示访问 URL
set DISPLAY_IP=%SERVER:*@=%
set DISPLAY_IP=%DISPLAY_IP::=%

if defined DOMAIN (
    echo 访问地址: https://%DOMAIN%
) else (
    echo 访问地址: http://%DISPLAY_IP%
)
echo.
echo 常用命令:
echo   重新部署:     deploy-ecs.bat
echo   查看日志:     ssh %SERVER% 'tail -f /var/log/nginx/resume_access.log'
echo   进入服务器:   ssh %SERVER%
echo   仅远程构建:   ssh %SERVER% 'cd /var/www/resume && npm run build'
echo.

pause
