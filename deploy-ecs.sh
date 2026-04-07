#!/bin/bash

# ============================================================
# 阿里云 ECS 一键部署脚本 (本地执行) - 方式A: 服务器端构建
# 流程: 上传源码 → 服务器 npm install & build → Nginx 托管 dist
# 用法: ./deploy-ecs.sh [用户名@服务器IP]
# 示例: ./deploy-ecs.sh root@120.xx.xx.xx
#       ./deploy-ecs.sh                    # 使用配置文件中的默认值
# ============================================================

set -e

echo "=========================================="
echo "  Resume → 阿里云 ECS 部署 (服务器构建)"
echo "=========================================="

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'

info()  { echo -e "${CYAN}[INFO]${NC} $1"; }
ok()    { echo -e "${GREEN}[OK]${NC} $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# ---- 配置文件支持 ----
CONFIG_FILE=".ecs-deploy-config"
REMOTE_DIR="/var/www/resume"        # 源码目录
DIST_DIR="/var/www/resume/dist"     # 构建产物目录 (Nginx root 指向这里)

# 从配置或参数获取目标服务器
get_server() {
    if [ -n "$1" ]; then
        echo "$1"
    elif [ -f "$CONFIG_FILE" ]; then
        grep "^SERVER=" "$CONFIG_FILE" | cut -d'=' -f2
    fi
}

SERVER=$(get_server "$1")

if [ -z "$SERVER" ]; then
    echo ""
    warn "未指定目标服务器，请选择:"
    echo "  1. 命令行传入:  ./deploy-ecs.sh root@120.xx.xx.xx"
    echo "  2. 配置文件:    在 .ecs-deploy-config 中写入 SERVER=root@你的IP"
    echo ""
    read -rp "请输入服务器地址 (例如 root@120.xx.xx.xx): " SERVER
fi

if [ -z "$SERVER" ]; then
    error "必须提供服务器地址"
fi

# 保存配置到本地（方便下次使用）
echo "SERVER=$SERVER" > "$CONFIG_FILE"
echo "# 部署时间: $(date '+%Y-%m-%d %H:%M:%S')" >> "$CONFIG_FILE"

info "目标服务器: $SERVER"
info "远程源码:   $REMOTE_DIR"
info "构建产物:   $DIST_DIR (Nginx root)"

# ---- 检查 SSH 连通性 ----
info "检查服务器连接..."
TEMP_S="$SERVER"; TEMP_S=${TEMP_S#@}; TEMP_S=${TEMP_S%:*}
if ! ping -c 1 -W 3 "$TEMP_S" &>/dev/null; then
    error "无法连接到服务器 $SERVER，请检查:"
    echo "  1. 服务器是否启动且公网可达"
    echo "  2. 安全组是否已放行 22 端口"
    echo "  3. IP 地址是否正确"
fi
ok "服务器连接正常"

# ---- 检查依赖 ----
command -v rsync >/dev/null 2>&1 || {
    warn "rsync 未安装，将使用 scp 替代（增量同步不可用）"
    USE_SCP=true
}

command -v npm >/dev/null 2>&1 || warn "本地未安装 Node.js (不影响部署，构建在服务器执行)"

# 排除列表（不上传的文件/目录）
RSYNC_EXCLUDES=(
    --exclude='node_modules'
    --exclude='dist'
    --exclude='.git'
    --exclude='.deploy_temp'
    --exclude='.ecs-deploy-config'
    --exclude='*.log'
)

# ---- Step 1: 上传源码到服务器 ----
echo ""
info "Step 1/4: 上传源码到服务器..."

START_TIME=$(date +%s)

# 确保远程目录存在
ssh "$SERVER" "mkdir -p $REMOTE_DIR" 2>/dev/null || true

if [ "${USE_SCP}" = "true" ]; then
    # SCP 方式
    info "使用 SCP 上传..."
    # 先清理旧的 node_modules 和 dist（保留源码）
    ssh "$SERVER" "rm -rf ${REMOTE_DIR}/node_modules ${REMOTE_DIR}/dist" 2>/dev/null || true
    
    # 使用 tar 打包后传输（比逐个 scp 快得多）
    tar --exclude='node_modules' \
        --exclude='dist' \
        --exclude='.git' \
        --exclude='.deploy_temp' \
        --exclude='.ecs-deploy-config' \
        -czf - . | ssh "$SERVER" "tar -xzf - -C $REMOTE_DIR"
else
    # Rsync 方式（增量同步，更快）
    info "使用 Rsync 增量同步..."
    rsync -avz --progress "${RSYNC_EXCLUDES[@]}" \
        ./ "$SERVER:$REMOTE_DIR/"
fi

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

ok "上传完成 (耗时 ${DURATION}s)"

# ---- Step 2: 服务器端安装依赖并构建 ----
echo ""
info "Step 2/4: 服务器端构建..."

BUILD_START=$(date +%s)

# 远程执行: 安装依赖 + 构建
ssh "$SERVER" bash -s << 'REMOTE_BUILD'
set -e
cd /var/www/resume

# 检测 Node.js 是否存在
if ! command -v node &>/dev/null; then
    echo "[ERROR] 服务器未安装 Node.js，正在安装..."
    curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
    yum install -y nodejs 2>/dev/null || apt-get install -y nodejs 2>/dev/null
fi

echo "[INFO] Node 版本: $(node -v)"
echo "[INFO] NPM 版本: $(npm -v)"

# 清理旧构建产物
rm -rf dist

# 安装依赖（仅在 node_modules 不存在或 package-lock 变化时）
if [ ! -d "node_modules" ] || [ "package-lock.json" -nt "node_modules" ] 2>/dev/null; then
    echo "[INFO] 安装依赖..."
    npm install --prefer-offline
else
    echo "[OK] 依赖已就绪，跳过安装"
fi

# 构建
echo "[INFO] 开始构建..."
npm run build

if [ ! -d "dist" ] || [ -z "$(ls -A dist 2>/dev/null)" ]; then
    echo "[ERROR] 构建失败，产物为空"
    exit 1
fi

echo "[OK] 构建完成 ($(du -sh dist | cut -f1))"
REMOTE_BUILD

BUILD_END=$(date +%s)
BUILD_DURATION=$((BUILD_END - BUILD_START))

ok "服务器构建完成 (耗时 ${BUILD_DURATION}s)"

# ---- Step 3: 验证部署 ----
echo ""
info "Step 3/4: 验证部署结果..."

REMOTE_SIZE=$(ssh "$SERVER" "du -sh $DIST_DIR | cut -f1")
FILE_COUNT=$(ssh "$SERVER" "find $DIST_DIR -type f | wc -l")
INDEX_CHECK=$(ssh "$SERVER" "test -f $DIST_DIR/index.html && echo OK || echo FAIL")

if [ "$INDEX_CHECK" = "OK" ]; then
    ok "验证通过: $FILE_COUNT 个文件, 总大小 $REMOTE_SIZE"
else
    error "部署验证失败: 未找到 $DIST_DIR/index.html"
fi

# ---- Step 4: 重载 Nginx ----
echo ""
info "Step 4/4: 重载 Nginx 配置..."

ssh "$SERVER" "nginx -t && systemctl reload nginx" 2>/dev/null || {
    warn "Nginx 重载失败（可能未运行），尝试启动..."
    ssh "$SERVER" "systemctl start nginx" 2>/dev/null || true
}

ok "Nginx 已重载"

# ---- 完成 ----
echo ""
echo "=========================================="
ok "部署完成!"
echo "=========================================="
echo ""

# 显示访问地址
DISPLAY_URL=""
TEMP="$SERVER"
TEMP=${TEMP#*@}
TEMP=${TEMP%:*}

if [ -f "$CONFIG_FILE" ]; then
    DOMAIN=$(grep "^DOMAIN=" "$CONFIG_FILE" 2>/dev/null | cut -d'=' -f2)
    if [ -n "$DOMAIN" ]; then
        DISPLAY_URL="https://$DOMAIN"
    fi
fi

if [ -z "$DISPLAY_URL" ]; then
    DISPLAY_URL="http://$TEMP"
fi

echo "访问地址: ${GREEN}$DISPLAY_URL${NC}"
echo ""
echo "常用命令:"
echo "  重新部署:  ./deploy-ecs.sh"
echo "  查看日志:  ssh $SERVER 'tail -f /var/log/nginx/resume_access.log'"
echo "  进入服务器: ssh $SERVER"
echo "  服务器构建: ssh $SERVER 'cd /var/www/resume && npm run build'"
echo ""

# ---- 可选：自动打开浏览器 ----
if command -v open &>/dev/null; then
    read -rp "是否在浏览器中打开? [y/N]: " OPEN_BROWSER
    if [ "$OPEN_BROWSER" = "y" ] || [ "$OPEN_BROWSER" = "Y" ]; then
        open "$DISPLAY_URL"
    fi
fi
