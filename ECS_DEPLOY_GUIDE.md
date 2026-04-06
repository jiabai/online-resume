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
- 安装并配置 Nginx
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

脚本会自动完成：构建 → 上传 → 同步 → 验证

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
# 检查目录权限
ssh root@你的IP "ls -la /var/www/resume/"
ssh root@你的IP "chown -R nginx:nginx /var/www/resume/"  # CentOS
ssh root@你的IP "chown -R www-data:www-data /var/www/resume/"  # Ubuntu
```

### Nginx 启动失败
```bash
# 查看错误日志
ssh root@你的IP "tail -50 /var/log/nginx/error.log"

# 检查配置语法
ssh root@你的IP "nginx -t"

# 重启服务
ssh root@你的IP "systemctl restart nginx"
```
