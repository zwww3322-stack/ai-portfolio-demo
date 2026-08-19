# 张唯个人 AI 作品集

本项目同时支持 Cloudflare Workers 和阿里云 ECS 静态部署。

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

## 阿里云 ECS 部署

生成可以由 Nginx 直接托管的静态文件：

```bash
npm install
npm run build:aliyun
```

构建结果位于 `out/` 目录。将其中的文件上传到服务器：

```text
/www/wwwroot/awinways.com
```

线上地址：<https://awinways.com>

`out/` 是自动生成的构建产物，不需要提交到 GitHub。服务器已经配置 Nginx、HTTPS 和证书自动续期。
