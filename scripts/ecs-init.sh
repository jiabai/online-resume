#!/bin/bash

# ============================================================
# 阿里云 ECS 服务器初始化脚本（首次部署执行一次）
# 用法: ssh root@你的ECS公网IP < ecs-init.sh
#       或: scp ecs-init.sh root@你的IP:/tmp/ && ssh root@你的IP 'bash /tmp/ecs-init.sh'
# ============================================================

set -e

echo "=========================================="
echo "  阿里云 ECS 初始化脚本"
echo "=========================================="

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'

info()  { echo -e "${CYAN}[INFO]${NC} $1"; }
ok()    { echo -e "${GREEN}[OK]${NC} $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# ---- 配置项 ----
RESUME_DIR="/var/www/resume"          # 站点文件目录
NGINX_CONF="/etc/nginx/conf.d/resume.conf"
DOMAIN="${1:-}"                        # 可选域名参数
SERVER_IP=$(curl -s ifconfig.me || echo "")

info "服务器 IP: ${SERVER_IP:-未知}"

# ---- 1. 安装 Nginx ----
if command -v nginx &>/dev/null; then
    ok "Nginx 已安装"
else
    info "安装 Nginx..."
    if command -v yum &>/dev/null; then
        yum install -y nginx
    elif command -v apt-get &>/dev/null; then
        apt-get update && apt-get install -y nginx
    else
        error "不支持的包管理器，请手动安装 Nginx"
    fi
    ok "Nginx 安装完成"
fi

# ---- 2. 创建站点目录 ----
info "创建站点目录: $RESUME_DIR"
mkdir -p "$RESUME_DIR"
chown -R $USER:$USER "$RESUME_DIR" 2>/dev/null || true
ok "站点目录就绪"

# ---- 3. 生成 Nginx 配置 ----
info "生成 Nginx 配置..."

# 如果提供了域名，同时配置 HTTP 和 HTTPS 跳转
if [ -n "$DOMAIN" ]; then
    SERVER_NAME="$DOMAIN"
else
    SERVER_NAME="${SERVER_IP:-_}"
fi

cat > "$NGINX_CONF" << 'NGINX_EOF'
server {
    listen 80;
    server_name __SERVER_NAME__;

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # 站点根目录
    root /var/www/resume;
    index index.html;

    # 日志
    access_log /var/log/nginx/resume_access.log;
    error_log /var/log/nginx/resume_error.log;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存 (30天)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # 禁止访问隐藏文件
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
NGINX_EOF

# 替换占位符
sed -i "s|__SERVER_NAME__|$SERVER_NAME|g" "$NGINX_CONF"

ok "Nginx 配置已生成: $NGINX_CONF"

# ---- 4. 测试并启动 Nginx ----
info "测试 Nginx 配置..."
nginx -t

info "启动并设置开机自启..."
systemctl start nginx 2>/dev/null || service nginx start
systemctl enable nginx 2>/dev/null || true

ok "Nginx 已启动"

# ---- 5. 防火墙检查 ----
if command -v firewall-cmd &>/dev/null; then
    info "检查防火墙规则..."
    firewall-cmd --state &>/dev/null && {
        firewall-cmd --permanent --add-service=http --quiet 2>/dev/null || true
        firewall-cmd --permanent --add-service=https --quiet 2>/dev/null || true
        firewall-cmd --reload --quiet 2>/dev/null || true
        ok "防火墙已开放 80/443 端口"
    }
elif command -v ufw &>/dev/null; then
    ufw allow 80/tcp 2>/dev/null || true
    ufw allow 443/tcp 2>/dev/null || true
    ok "防火墙已开放 80/443 端口"
fi

# ---- 6. 完成 ----
echo ""
echo "=========================================="
ok "初始化完成!"
echo "=========================================="
echo ""
echo "下一步操作:"
echo ""
echo "  1. 本地运行部署命令:"
echo "     ./deploy-ecs.sh ${SERVER_IP}"
echo ""
if [ -n "$DOMAIN" ]; then
    echo "  2. DNS 解析:"
    echo "     将 $DOMAIN A 记录指向 $SERVER_IP"
    echo ""
fi
echo "  3. 访问测试:"
if [ -n "$DOMAIN" ]; then
    echo "     http://$DOMAIN"
elif [ -n "$SERVER_IP" ]; then
    echo "     http://$SERVER_IP"
else
    echo "     http://<你的服务器IP>"
fi
echo ""

# ---- 可选：安装 SSL 证书 ----
if [ -n "$DOMAIN" ] && ! command -v certbot &>/dev/null; then
    warn "如需 HTTPS，请稍后执行:"
    echo "  certbot --nginx -d $DOMAIN"
    echo ""
fi
