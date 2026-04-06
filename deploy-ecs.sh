#!/bin/bash

# ============================================================
# 阿里云 ECS 一键部署脚本 (本地执行)
# 用法: ./deploy-ecs.sh [用户名@服务器IP]
# 示例: ./deploy-ecs.sh root@120.xx.xx.xx
#       ./deploy-ecs.sh                    # 使用配置文件中的默认值
# ============================================================

set -e

echo "=========================================="
echo "  Resume → 阿里云 ECS 部署"
echo "=========================================="

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'

info()  { echo -e "${CYAN}[INFO]${NC} $1"; }
ok()    { echo -e "${GREEN}[OK]${NC} $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# ---- 配置文件支持 ----
CONFIG_FILE=".ecs-deploy-config"
REMOTE_DIR="/var/www/resume"

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
info "远程目录:   $REMOTE_DIR"

# ---- 检查 SSH 连通性 ----
info "检查服务器连接..."
if ! timeout 5 bash -c "echo > /dev/tcp/${SERVER#*@}/${SERVER##*:-22}" 2>/dev/null; then
    # 提取 IP 用于检测
    TEMP_SERVER="$SERVER"
    TEMP_SERVER=${TEMP_SERVER#@}
    TEMP_SERVER=${TEMP_SERVER%:*}
    
    # 尝试 ping
    if ! ping -c 1 -W 3 "$TEMP_SERVER" &>/dev/null; then
        error "无法连接到服务器 $SERVER，请检查:"
        echo "  1. 服务器是否启动且公网可达"
        echo "  2. 安全组是否已放行 22 端口"
        echo "  3. IP 地址是否正确"
    fi
fi
ok "服务器连接正常"

# ---- 检查依赖 ----
command -v rsync >/dev/null 2>&1 || {
    warn "rsync 未安装，将使用 scp 替代（增量同步不可用）"
    USE_SCP=true
}

command -v npm >/dev/null 2>&1 || error "请先安装 Node.js: https://nodejs.org/"

# ---- Step 1: 本地构建 ----
echo ""
info "Step 1/4: 本地构建项目..."

if [ ! -d "node_modules" ]; then
    info "安装依赖..."
    npm install
fi

npm run build

if [ $? -ne 0 ]; then
    error "构建失败，请检查代码错误后重试"
fi

if [ ! -d "dist" ] || [ -z "$(ls -A dist 2>/dev/null)" ]; then
    error "构建产物为空，请检查 vite.config.js 的 outDir 设置"
fi

ok "构建完成 ($(du -sh dist | cut -f1))"

# ---- Step 2: 检查远程目录 ----
echo ""
info "Step 2/4: 检查远程环境..."

ssh "$SERVER" "test -d $REMOTE_DIR && echo EXISTS || echo NEW" 2>/dev/null | grep -q "NEW" && {
    warn "远程目录不存在，正在创建..."
    ssh "$SERVER" "sudo mkdir -p $REMOTE_DIR && sudo chown \$(whoami) $REMOTE_DIR"
}

ok "远程环境就绪"

# ---- Step 3: 上传文件 ----
echo ""
info "Step 3/4: 上传构建产物..."

START_TIME=$(date +%s)

if [ "${USE_SCP}" = "true" ]; then
    # SCP 方式：先删除再上传
    ssh "$SERVER" "rm -rf ${REMOTE_DIR:?}/*" 2>/dev/null || true
    scp -r dist/* "$SERVER:$REMOTE_DIR/"
else
    # Rsync 方式：增量同步（更快）
    rsync -avz --delete \
        --progress \
        --exclude='.git' \
        --exclude='*.log' \
        dist/ "$SERVER:$REMOTE_DIR/"
fi

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

ok "上传完成 (耗时 ${DURATION}s)"

# ---- Step 4: 验证部署 ----
echo ""
info "Step 4/4: 验证部署..."

REMOTE_SIZE=$(ssh "$SERVER" "du -sh $REMOTE_DIR | cut -f1")
FILE_COUNT=$(ssh "$SERVER" "find $REMOTE_DIR -type f | wc -l")

INDEX_CHECK=$(ssh "$SERVER" "test -f $REMOTE_DIR/index.html && echo OK || echo FAIL")

if [ "$INDEX_CHECK" = "OK" ]; then
    ok "验证通过: $FILE_COUNT 个文件, 总大小 $REMOTE_SIZE"
else
    error "部署验证失败: 未找到 index.html"
fi

# ---- 完成 ----
echo ""
echo "=========================================="
ok "部署完成!"
echo "=========================================="
echo ""

# 提取 IP 用于显示 URL
DISPLAY_URL=""
TEMP="$SERVER"
TEMP=${TEMP#*@}
TEMP=${TEMP%:*}

# 尝试从配置读取域名
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
echo ""

# ---- 可选：自动打开浏览器 ----
if command -v open &>/dev/null; then
    read -rp "是否在浏览器中打开? [y/N]: " OPEN_BROWSER
    if [ "$OPEN_BROWSER" = "y" ] || [ "$OPEN_BROWSER" = "Y" ]; then
        open "$DISPLAY_URL"
    fi
fi
