# Nirvana Entretenimiento Monorepo

火凤凰风格初始化项目，包含 Next.js 前端与 Node.js 后端，可直接继续开发和扩展。

## Monorepo 结构

```text
.
├── apps/
│   └── web/                  # Next.js Web 前端
│       ├── app/              # App Router 页面与全局样式
│       ├── components/       # 动画组件（涅槃重生）
│       └── lib/
│           ├── i18n/         # 多语言配置与文案
│           └── theme/        # Phoenix 主题（colors/typography/effects）
├── backend/                  # Node.js Express 服务端
│   └── src/server.js
├── package.json              # 根工作区与脚本
└── README.md
```

## 快速开始

```bash
npm install
```

### 启动 Web 前端

```bash
npm run dev:web
```

### 启动 Backend 服务

```bash
npm run dev:backend
```

健康检测接口：`GET http://localhost:4000/api/health`

## 已包含能力

- Phoenix 风格主题配置（颜色、字体、特效）
- 世界杯 2026 主题首页（多语言、导航、Logo 动画、亮点区块）
- 涅槃重生动画组件
- 国际化语言：`zh-CN`、`es-AR`、`es-CL`、`en-US`、`pt-BR`
- Express 健康检测与后续 JWT / 多区域货币扩展预留
