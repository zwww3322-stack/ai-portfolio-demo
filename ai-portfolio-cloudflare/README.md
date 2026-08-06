# 张唯个人 AI 作品集

本项目已整理为 Cloudflare Workers 可部署的 Vinext 应用。

## 本地运行

```bash
npm install
npm run dev
```

## 上传 GitHub

将本目录内的所有文件上传到 GitHub 仓库根目录。`package.json` 应直接出现在仓库首页，不要上传 `node_modules` 或 `dist`。

## Cloudflare Workers Builds

在 Cloudflare 的 Workers & Pages 中连接 GitHub 仓库，使用以下设置：

- Production branch: `main`
- Build command: `npm run build`
- Deploy command: `npm run deploy`
- Root directory: `/`

第一次部署成功后会获得 `*.workers.dev` 网址，之后可在 Cloudflare 中绑定独立域名。
