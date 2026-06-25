# Starheart / 星心

Starheart 是一个纯前端轻量娱乐工具站，包含 MBTI 测试、星座讲解、形象卡片、昵称生成器和幸运号码生成器。

## 本地开发

```bash
npm install
npm run dev
```

## 测试与构建

```bash
npm test -- --run
npm run build
```

如果本机 pnpm 可用，也可以运行：

```bash
pnpm install
pnpm build
```

## 静态部署

构建产物位于 `dist/`。可将其中内容上传到 VPS 的 `/var/www/starheart`，并使用 `nginx-starheart.conf` 中的配置。

## 说明

- 不包含登录、注册、后台管理或数据库。
- 用户数据只保存在当前页面运行状态中。
- AI 形象图第一版使用静态资源路径和占位图 fallback，不接入运行时绘图 API。
- 所有 MBTI、星座、昵称和幸运号码内容仅供娱乐参考。
