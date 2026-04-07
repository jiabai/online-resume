# 部署文档 - 阿里云 ECS 完整指南

## 文件说明

```
online-resume/
├── deploy-ecs.sh          # Linux/Mac 一键部署脚本
├── deploy-ecs.bat         # Windows 一键部署脚本  
├── .ecs-deploy-config     # 部署配置文件（自动生成）
└── scripts/
    ├── ecs-init.sh        # ECS 服务器初始化（首次执行）
    ├── ssl-setup.sh       # SSL 证书配置（可选）
    └── deploy.js          # GitHub Pages 部署脚本（原有）
```

## 部署架构（方式 A：服务器端构建）

```
本地源码 ──上传──▶ /var/www/resume (源码目录)
                      │
                   npm run build
                      │
                      ▼
              /var/www/resume/dist  ← Nginx root 指向这里
                      │
                   Nginx 托管
                      │
                      ▼
                 用户访问
```

**为什么选方式 A？**
- 源码统一管理在服务器，方便远程直接修改和构建
- 构建环境一致，避免本地/服务器 Node 版本差异
- 只需 `ssh` 就能完成全流程，无需本地装 Node.js

---

## 首次部署流程

### 第一步：ECS 服务器初始化（只需一次）

```bash
# 方式 1：将脚本复制到服务器执行
scp scripts/ecs-init.sh root@你的IP:/tmp/
ssh root@你的IP 'bash /tmp/ecs-init.sh [可选域名]'

# 方式 2：管道方式执行
cat scripts/ecs-init.sh | ssh root@你的IP bash -s resume.yourdomain.com
```

**初始化内容：**
- 安装并配置 Nginx（root 指向 `/var/www/resume/dist`）
- 安装 Node.js（用于服务端构建）
- 创建站点目录 `/var/www/resume`
- 开放防火墙端口 80/443
- 生成优化的 Nginx 配置

### 第二步：本地一键部署

```bash
# Linux / Mac
chmod +x deploy-ecs.sh
./deploy-ecs.sh root@120.xx.xx.xx

# Windows
deploy-ecs.bat root@120.xx.xx.xx
```

**脚本自动完成的步骤：**
1. 上传源码到 `/var/www/resume`（排除 node_modules、dist、.git）
2. 远程执行 `npm install && npm run build`
3. 验证 `/var/www/resume/dist/index.html` 是否存在
4. 重载 Nginx 使新构建生效

**首次执行会提示输入服务器地址，之后保存在 `.ecs-deploy-config` 中**

### 第三步：（可选）配置 HTTPS

```bash
cat scripts/ssl-setup.sh | ssh root@你的IP bash -s resume.yourdomain.com
```

> **注意：** 使用自定义域名需要先在阿里云完成 ICP 备案

---

## 后续更新流程

修改代码后只需重新执行：

```bash
./deploy-ecs.sh          # Linux/Mac
deploy-ecs.bat           # Windows
```

脚本会自动完成：**上传源码 → 服务器安装依赖 → 服务器构建 → 重载 Nginx → 验证结果**

### 仅重新构建（不更新源码）

如果只是想清理缓存重新 build，可以直接 SSH 到服务器执行：

```bash
ssh root@你的IP 'cd /var/www/resume && rm -rf dist && npm run build'
```

---

## 目录结构说明

```
/var/www/resume/          ← 源码目录（从本地同步）
├── src/
├── public/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── node_modules/         ← 服务端安装的依赖
└── dist/                 ← 构建产物（Nginx 直接托管这个目录）
    ├── index.html
    ├── assets/
    └── ...
```

Nginx 配置中的 `root /var/www/resume/dist;` 确保用户请求的是构建产物而非源码。

---

## 阿里云控制台配置要点

### 安全组规则

确保以下入方向规则已添加：

| 协议 | 端口范围 | 授权对象 | 说明 |
|------|---------|---------|------|
| TCP | 22 | 你的 IP | SSH 管理 |
| TCP | 80 | 0.0.0.0/0 | HTTP |
| TCP | 443 | 0.0.0.0/0 | HTTPS |

### 域名解析（如需绑定域名）

在阿里云域名解析控制台添加：

| 记录类型 | 主机记录 | 记录值 |
|---------|---------|--------|
| A | @ | ECS 公网 IP |
| A | www | ECS 公网 IP |

---

## 故障排查

### 连接超时
```bash
# 检查安全组是否开放 22 端口
# 检查 ECS 公网带宽是否足够（建议 ≥ 1Mbps）
```

### 403 Forbidden
```bash
# 检查 dist 目录权限
ssh root@你的IP "ls -la /var/www/resume/dist/"
ssh root@你的IP "chown -R nginx:nginx /var/www/resume/dist"   # CentOS
ssh root@你的IP "chown -R www-data:www-data /var/www/resume/dist"  # Ubuntu
```

### 页面显示旧版本（缓存问题）
```bash
# 清除浏览器缓存后刷新 (Ctrl+Shift+R)
# 或检查 Nginx 缓存配置是否生效
```

### Nginx 启动失败
```bash
# 查看错误日志
ssh root@你的IP "tail -50 /var/log/nginx/error.log"

# 检查配置语法
ssh root@你的IP "nginx -t"

# 检查 dist 目录是否存在
ssh root@你的IP "ls -la /var/www/resume/dist/"

# 重启服务
ssh root@你的IP "systemctl restart nginx"
```

### 远程构建失败
```bash
# SSH 到服务器手动调试
ssh root@你的IP
cd /var/www/resume
npm install   # 单独检查依赖安装
npm run build # 查看具体报错信息
node -v       # 确认 Node 版本 >= 18
```
