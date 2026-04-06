#!/usr/bin/env bash

# ============================================================
# 一键部署脚本 - 将简历站点部署到 GitHub Pages
# 用法: ./deploy.sh [仓库名]
# 示例: ./deploy.sh              # 自动从 git remote 推断
#       ./deploy.sh my-resume     # 指定仓库名
# ============================================================

set -e

echo "========================================"
echo "  Resume Deploy Script"
echo "========================================"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

info()  { echo -e "${CYAN}[INFO]${NC} $1"; }
ok()    { echo -e "${GREEN}[OK]${NC} $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# ---- 检查前置条件 ----
command -v git >/dev/null 2>&1 || error "请先安装 Git"
command -v node >/dev/null 2>&1 || error "请先安装 Node.js"

# ---- 确定仓库地址 ----
REPO_NAME="$1"
if [ -z "$REPO_NAME" ]; then
  REMOTE_URL=$(git config --get remote.origin.url 2>/dev/null || true)
  if [ -n "$REMOTE_URL" ]; then
    REPO_NAME=$(echo "$REMOTE_URL" | sed -E 's|.*github\.com[:/](.*)\.git$|\1|')
  fi
fi

if [ -z "$REPO_NAME" ]; then
  warn "无法自动检测仓库名，请手动指定："
  echo "  用法: ./deploy.sh <用户名>/<仓库名>"
  echo ""
  read -rp "输入 GitHub 仓库名 (例如 aaron/resume): " REPO_NAME
fi

if [ -z "$REPO_NAME" ]; then
  error "必须提供仓库名"
fi

info "目标仓库: https://github.com/$REPO_NAME"

# ---- 检查是否已初始化 Git ----
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  info "初始化 Git 仓库..."
  git init
  git add -A
  git commit -m "Initial commit: resume site"
else
  info "Git 仓库已存在"
fi

# ---- 检查远程仓库 ----
HAS_REMOTE=$(git remote get-url origin 2>/dev/null || echo "")
if [ -z "$HAS_REMOTE" ]; then
  info "添加远程仓库..."
  git remote add origin "https://github.com/${REPO_NAME}.git"
fi

# ---- 安装依赖 ----
if [ ! -d "node_modules" ]; then
  info "安装依赖..."
  npm install
else
  ok "依赖已就绪"
fi

# ---- 构建 ----
info "开始构建..."
npm run build

if [ $? -ne 0 ]; then
  error "构建失败，请检查代码错误后重试"
fi

ok "构建完成"

# ---- 部署到 gh-pages 分支 ----
DEPLOY_DIR=".deploy_temp"
info "准备部署到 gh-pages 分支..."

rm -rf "$DEPLOY_DIR"

mkdir -p "$DEPLOY_DIR"
cp -r dist/* "$DEPLOY_DIR/"

cd "$DEPLOY_DIR"

if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  rm -rf * .* 2>/dev/null || true
  cp -r ../dist/* .
else
  git init
  cp -r ../dist/* .
fi

touch .nojekyll

git add -A
git commit -m "Deploy $(date '+%Y-%m-%d %H:%M:%S')" \
  --allow-empty || true

git branch -M gh-pages
git force-push origin gh-pages 2>/dev/null || \
  git push origin gh-pages --force

cd ..
rm -rf "$DEPLOY_DIR"
git worktree prune 2>/dev/null || true

echo ""
echo "========================================"
ok "部署完成!"
echo "========================================"
echo ""
echo "你的简历已上线:"
echo "  ${GREEN}https://${REPO_NAME%%/*}.github.io/${REPO_NAME#*/}${NC}"
echo ""
echo "首次访问可能需要等待 1-2 分钟生效。"
echo "如需自定义域名, 请在仓库 Settings > Pages 中配置。"
