#!/usr/bin/env node

// ============================================================
// 一键部署脚本 (Node.js 版本) - 跨平台通用
// 用法: npm run deploy [仓库名]
// 示例: npm run deploy              # 自动从 git remote 推断
//       npm run deploy my-resume     # 指定仓库名
// ============================================================

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const COLORS = { reset: '\x1b[0m', red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m', cyan: '\x1b[36m' };
const log = { info: m => console.log(`${COLORS.cyan}[INFO]${COLORS.reset} ${m}`), ok: m => console.log(`${COLORS.green}[OK]${COLORS.reset} ${m}`), warn: m => console.log(`${COLORS.yellow}[WARN]${COLORS.reset} ${m}`), err: m => { console.log(`${COLORS.red}[ERROR]${COLORS.reset} ${m}`); process.exit(1); } };

function run(cmd) { return execSync(cmd, { encoding: 'utf8', stdio: 'pipe' }).trim(); }
function tryRun(cmd) { try { return execSync(cmd, { encoding: 'utf8', stdio: 'pipe' }).trim(); } catch { return ''; } }

console.log('========================================');
console.log('  Resume Deploy Script (Node.js)');
console.log('========================================\n');

// ---- 确定仓库地址 ----
let repoName = process.argv[2];
if (!repoName) {
  const remoteUrl = tryRun('git config --get remote.origin.url');
  if (remoteUrl) {
    const match = remoteUrl.match(/github\.com[:\/](.*)\.git$/);
    if (match) repoName = match[1];
  }
}

if (!repoName) {
  log.warn('无法自动检测仓库名。请通过参数指定:');
  console.log('  用法: npm run deploy <用户名>/<仓库名>');
  log.err('必须提供仓库名');
}

log.info(`目标仓库: https://github.com/${repoName}`);

// ---- 检查 Git 仓库 ----
if (!tryRun('git rev-parse --is-inside-work-tree')) {
  log.info('初始化 Git 仓库...');
  run('git init && git add -A && git commit -m "Initial commit: resume site" || true');
} else {
  log.info('Git 仓库已存在');
}

// ---- 检查远程仓库 ----
const hasRemote = tryRun('git remote get-url origin');
if (!hasRemote) {
  log.info('添加远程仓库...');
  run(`git remote add origin https://github.com/${repoName}.git`);
}

// ---- 设置 base 路径 ----
process.env.GITHUB_PAGES_REPO_NAME = '/' + repoName.split('/')[1] + '/';

// ---- 安装依赖 ----
if (!fs.existsSync(path.join(process.cwd(), 'node_modules'))) {
  log.info('安装依赖...');
  run('npm install');
} else {
  log.ok('依赖已就绪');
}

// ---- 构建 ----
log.info('开始构建...');
try {
  run('npm run build');
} catch (e) {
  log.err('构建失败，请检查代码错误后重试');
}
log.ok('构建完成');

// ---- 部署到 gh-pages 分支 ----
const deployDir = path.join(process.cwd(), '.deploy_temp');
log.info('准备部署到 gh-pages 分支...');

// 清理旧目录
fs.rmSync(deployDir, { recursive: true, force: true });
fs.mkdirSync(deployDir, { recursive: true });

// 复制构建产物
function copyDir(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
copyDir(path.join(process.cwd(), 'dist'), deployDir);

// .nojekyll 文件（GitHub Pages 必需）
fs.writeFileSync(path.join(deployDir, '.nojekyll'), '');

// 初始化/更新 gh-pages 分支并推送
const cwd = process.cwd();
process.chdir(deployDir);

tryRun('git init');
run('git checkout -B gh-pages');
run('git add -A');
run(`git commit -m "Deploy ${new Date().toISOString().replace('T', ' ').slice(0, 19)}" --allow-empty`);
run('git push origin gh-pages --force');

process.chdir(cwd);

// 清理临时目录
fs.rmSync(deployDir, { recursive: true, force: true });

const [owner, repo] = repoName.split('/');
console.log('\n========================================');
log.ok('部署完成!');
console.log('========================================');
console.log(`\n你的简历已上线:\n  https://${owner}.github.io/${repo}\n`);
console.log('首次访问可能需要等待 1-2 分钟生效。\n如需自定义域名, 请在仓库 Settings > Pages 中配置。\n');
