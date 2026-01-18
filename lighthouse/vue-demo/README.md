# vue-demo

Lighthouse 环境下的 Vue 3 + Vite 示例项目，提供现代化的工具界面，包含 Base64 工具与 JSON 格式化功能。

## 功能

- Base64 编码/解码，输出支持一键复制。
- JSON 格式化，错误提示友好。
- 支持对转义 JSON 字符串（如 Nginx JSON 日志输出）尽可能反转义并格式化。
- 左侧菜单切换工具的现代化 UI。

## 本地开发

在本目录执行：

```bash
npm install
npm run dev
```

浏览器访问 `http://localhost:5173`。

## 构建与预览

```bash
npm run build
npm run preview
```

默认预览地址为 `http://localhost:4173`。

## 测试

```bash
npm test
```

## Docker 与 https-portal 联动

该项目在 Lighthouse 的 `docker-compose.yml` 中作为 `vue-demo` 服务构建并运行，默认通过 `vite preview` 启动在 `4173` 端口。\
`https-portal` 会将 `demo.example.com` 代理到 `http://vue-demo:4173`。

在仓库根目录执行：

```bash
docker compose -f lighthouse/docker-compose.yml -f lighthouse/docker-compose.override.yml up --build
```

确保本地 hosts 或 DNS 中 `demo.example.com` 能解析到运行环境的 IP。

## 备注

- JSON 格式化逻辑在 `src/utils/jsonFormatter.js`。
- UI 入口在 `src/App.vue`。
