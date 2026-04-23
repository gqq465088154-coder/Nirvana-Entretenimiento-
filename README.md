# Nirvana-Entretenimiento-

生产级 Monorepo，包含 Phoenix 火凤凰世界杯门户、Node.js API、PocketClaw 配对脚本与 Docker 部署能力。

## 目录结构

```text
.
├── apps/web/                     # Next.js 前端
│   ├── app/                      # 页面与样式模块
│   ├── components/               # 涅槃重生入场动画组件
│   ├── lib/i18n/                 # 多语言（zh-CN/es-AR/es-CL/en-US/pt-BR）
│   ├── lib/theme/                # Phoenix 主题 tokens
│   ├── .env.example
│   └── tsconfig.json
├── backend/                      # Node.js + Express API
│   ├── src/config/               # 环境变量
│   ├── src/db/                   # PostgreSQL / Redis 连接
│   ├── src/middleware/           # JWT 与错误处理中间件
│   ├── src/routes/               # health/auth/sportsbook/casino
│   └── .env.example
├── check.sh                      # 系统环境检查
├── install.sh                    # 依赖 + ClawPilot 安装
├── pair.sh                       # OpenClaw/Hermes 配对码生成
├── deploy.sh                     # Docker 一键部署
├── runtime-check.sh              # 运行时可用性检查
├── create-release-zip.sh         # 发布 ZIP 打包脚本
├── docker-compose.yml            # PostgreSQL + Redis + API + Web
├── Dockerfile                    # 多阶段构建
└── package.json                  # Monorepo 脚本
```

## 功能清单

### Web 前端（apps/web）
- Phoenix 主题系统（colors/typography/shadows/animations）
- 涅槃重生 3.8 秒入场动画（黑暗 → 火焰 → 凤凰爆发 → 淡入）
- 多语言国际化：`zh-CN` `es-AR` `es-CL` `en-US` `pt-BR`
- 2026 世界杯首页：导航、凤凰 Logo、宣传 Hero、游戏卡片
- CSS Modules 响应式样式

### 后端（backend）
- JWT 登录与鉴权中间件
- 体育博彩 API：`/api/sportsbook/markets` `POST /api/sportsbook/bets`
- Casino API：`/api/casino/games` `POST /api/casino/spin`
- PostgreSQL 与 Redis 配置 + 健康检测：`GET /api/health`
- 日志与统一错误处理

### 部署与配对脚本
- `./check.sh`：检查 Docker / Node.js / Git
- `./install.sh`：安装项目依赖和 ClawPilot
- `./pair.sh`：生成配对码（OpenClaw/Hermes）
- `./deploy.sh`：Docker 一键部署
- `./deploy.ps1`：Windows PowerShell 一键部署
- `./runtime-check.sh`：检查 Web/API 可用性
- `./create-release-zip.sh`：打包发布 ZIP

## 快速开始

```bash
# 1) 安装依赖
npm install

# 2) 本地开发
npm run dev:web
npm run dev:backend

# 3) 系统检查
./check.sh

# 4) 安装部署依赖
./install.sh

# 5) 生成配对码（默认 OpenClaw）
./pair.sh
# 或
PAIR_RUNTIME=Hermes ./pair.sh

# 6) Docker 一键部署
./deploy.sh

# Windows PowerShell
./deploy.ps1
```

## 环境变量

复制示例配置：

```bash
cp .env.example .env
cp apps/web/.env.example apps/web/.env
cp backend/.env.example backend/.env
```

如本机已有服务占用端口，可在 `.env` 中覆盖以下主机端口：

```bash
HTTP_PORT=8080
HTTPS_PORT=8443
WEB_HOST_PORT=3001
API_HOST_PORT=4001
POSTGRES_HOST_PORT=5433
REDIS_HOST_PORT=6380
```

## API 快速验证

```bash
# 获取 token
curl -s http://localhost:4000/api/auth/login \
  -H 'content-type: application/json' \
  -d '{"username":"nirvana-admin","password":"nirvana-2026"}'

# 用 token 访问受保护接口
curl -s http://localhost:4000/api/sportsbook/markets -H "authorization: Bearer <TOKEN>"
```

## 生成可运行 ZIP

```bash
./create-release-zip.sh
# 输出: release/Nirvana-Entretenimiento-v<version>-<branch>-YYYYmmdd-HHMMSS.zip
```

Windows 也可直接运行：

```powershell
powershell -ExecutionPolicy Bypass -File .\create-release-zip.ps1
```

## License

MIT
