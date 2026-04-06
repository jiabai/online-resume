#!/bin/bash

# ============================================================
# SSL 证书自动配置脚本 (Let's Encrypt + Certbot)
# 在 ECS 服务器上执行，或在本地通过 ssh 执行
# ============================================================
#
# 用法 1 (直接在服务器上):
#   bash ssl-setup.sh your-domain.com
#
# 用法 2 (从本地远程执行):
#   cat ssl-setup.sh | ssh root@你的IP "bash -s your-domain.com"
#
# ============================================================

set -e

DOMAIN="${1:-}"

if [ -z "$DOMAIN" ]; then
    echo "用法: $0 <域名>"
    echo "示例: $0 resume.example.com"
    exit 1
fi

echo "=========================================="
echo "  SSL 证书配置"
echo "=========================================="
echo ""
echo "域名: $DOMAIN"
echo ""

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'

info()  { echo -e "${CYAN}[INFO]${NC} $1"; }
ok()    { echo -e "${GREEN}[OK]${NC} $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# ---- 前置检查 ----
info "前置检查..."

# 检查 Nginx 是否安装
command -v nginx >/dev/null 2>&1 || error "Nginx 未安装，请先执行 ecs-init.sh"

# 检查 DNS 解析
RESOLVED_IP=$(dig +short $DOMAIN A 2>/dev/null || nslookup $DOMAIN 2>/dev/null | grep Address | tail -1 | awk '{print $2}')
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null)

if [ -z "$RESOLVED_IP" ]; then
    warn "无法解析域名 DNS，请确认:"
    echo "  1. 域名已备案（阿里云要求）"
    echo "  2. A 记录指向此服务器 IP ($SERVER_IP)"
    echo ""
    read -rp "是否继续? [y/N]: " CONTINUE
    [ "$CONTINUE" != "y" ] && exit 1
elif [ -n "$SERVER_IP" ] && [ "$RESOLVED_IP" != "$SERVER_IP" ]; then
    warn "DNS 解析 IP ($RESOLVED_IP) 与当前服务器 IP ($SERVER_IP) 不一致!"
    read -rp "是否继续? [y/N]: " CONTINUE
    [ "$CONTINUE" != "y" ] && exit 1
fi
ok "DNS 解析正常 → $RESOLVED_IP"

# ---- 安装 Certbot ----
info "安装 Certbot..."

if command -v certbot &>/dev/null; then
    ok "Certbot 已安装"
else
    if command -v yum &>/dev/null; then
        yum install -y certbot python3-certbot-nginx
    elif command -v apt-get &>/dev/null; then
        apt-get update
        apt-get install -y certbot python3-certbot-nginx
    else
        error "不支持的包管理器"
    fi
    ok "Certbot 安装完成"
fi

# ---- 申请证书 ----
echo ""
info "申请 SSL 证书..."
echo ""

certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --email admin@"$(echo $DOMAIN | cut -d'.' -f2-)" --redirect

if [ $? -eq 0 ]; then
    ok "SSL 证书申请成功!"
else
    error "证书申请失败，请手动运行: certbot --nginx -d $DOMAIN"
fi

# ---- 设置自动续期 ----
info "配置自动续期..."

# 添加 cron 任务 (每天凌晨 3 点检查续期)
CRON_JOB="0 3 * * * certbot renew --quiet && systemctl reload nginx"

(crontab -l 2>/dev/null | grep -v "certbot renew" ; echo "$CRON_JOB") | crontab -

ok "自动续期已配置 (每日凌晨 3 点检查)"

# ---- 测试 HTTPS ----
echo ""
info "验证 HTTPS 配置..."

HTTP_CODE=$(curl -sI "https://$DOMAIN" 2>/dev/null | head -1 || true)

if echo "$HTTP_CODE" | grep -q "200"; then
    ok "HTTPS 访问正常"
else
    warn "HTTPS 可能未生效，请稍后重试或检查防火墙 443 端口"
fi

# ---- 完成 ----
echo ""
echo "=========================================="
ok "SSL 配置完成!"
echo "=========================================="
echo ""
echo "访问地址:"
echo "  https://$DOMAIN"
echo ""
echo "证书信息:"
certbot certificates 2>/dev/null || true
echo ""
echo "常用命令:"
echo "  续期证书:   certbot renew --force-renewal"
echo "  查看证书:   certbot certificates"
echo "  删除证书:   certbot delete --cert-name $DOMAIN"
