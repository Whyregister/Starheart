# Starheart 项目细节档案

> 本文件用于记录 Starheart 项目的结构、功能、资产、部署和维护细节。后续凡是修改页面、功能、图片资源、部署方式、命名规范或测试方式，都需要同步更新本文件。

## 1. 项目概览

- 项目名称：Starheart / 星心
- 仓库地址：https://github.com/Whyregister/Starheart.git
- 本地路径：`F:\codexProject\Startheart`
- 项目类型：静态单页 Web 应用
- 主要用途：围绕星座、MBTI、昵称生成和幸运号码生成，提供娱乐向的自我探索体验。
- 内容声明：所有星座、MBTI、昵称和幸运号码内容均为娱乐和自我探索参考，不构成心理诊断、人生建议、职业建议或彩票建议。

## 2. 技术栈

- 前端框架：React 18
- 构建工具：Vite 6
- 语言：TypeScript
- 路由：React Router DOM 6
- 样式：Tailwind CSS
- 图标：lucide-react
- 测试：Vitest
- 图片处理依赖：sharp
- 后端运行时：Node.js 内置 HTTP server
- 后端缓存：`server/cache/ssq-history.json`，该目录不提交 Git
- 部署产物目录：`dist`

常用命令：

```bash
npm install
npm run dev
npm run server
npm run build
npm run preview
npx vitest run
```

## 3. 目录结构

```text
.
├─ public/
│  └─ assets/
│     ├─ starheart-hero.png
│     └─ cards/
│        ├─ placeholder.svg
│        ├─ starheart-cast.webp
│        ├─ zodiac-grid.webp
│        ├─ mbti-grid.webp
│        ├─ zodiac/
│        └─ mbti/
├─ src/
│  ├─ app/
│  ├─ components/
│  ├─ data/
│  ├─ lib/
│  ├─ pages/
│  ├─ types/
│  ├─ index.css
│  └─ main.tsx
├─ server/
│  ├─ index.mjs
│  ├─ ssq-data.mjs
│  ├─ ssq-model.mjs
│  └─ sample-ssq-data.mjs
├─ docs/
├─ README.md
├─ Starheart_Project_Plan.md
├─ nginx-starheart.conf
├─ package.json
└─ detail.md
```

## 4. 应用入口与全局结构

- `src/main.tsx`：React 应用入口。
- `src/app/App.tsx`：包裹 `AppProvider` 和公共 `Layout`，再渲染路由。
- `src/app/routes.tsx`：集中定义所有页面路由。
- `src/app/AppContext.tsx`：保存页面间共享的临时状态。

全局状态内容：

- 当前选中的星座：默认 `cancer`
- 当前选中的 MBTI：默认 `INFP`
- MBTI 答题记录
- MBTI 计算结果
- 昵称生成历史
- 双色球生成仍读取当前星座与 MBTI 选择，但生成历史不持久化

注意：当前状态仅保存在前端运行内存中，刷新页面会重置。

## 5. 路由与页面

| 路径 | 页面文件 | 功能 |
| --- | --- | --- |
| `/` | `src/pages/HomePage.tsx` | 首页，展示主操作按钮、角色环绕和底部大合影 |
| `/mbti` | `src/pages/MBTIPage.tsx` | 免费 MBTI 测试答题页 |
| `/mbti/result` | `src/pages/MBTIResultPage.tsx` | MBTI 测试结果页 |
| `/zodiac` | `src/pages/ZodiacPage.tsx` | 星座性格讲解页 |
| `/cards` | `src/pages/CardsPage.tsx` | 星座和 MBTI 形象卡片展示页 |
| `/nickname` | `src/pages/NicknamePage.tsx` | 昵称生成器 |
| `/lucky` | `src/pages/LuckyPage.tsx` | 双色球生成器与最近走势 |
| `/about` | `src/pages/AboutPage.tsx` | 关于页面 |

## 6. 首页当前设计

文件：`src/pages/HomePage.tsx`

当前首页布局要求与实现：

- 主界面的操作按钮居中放置。
- 桌面端显示若干星座/MBTI 人物形象，分布在按钮上下和周围。
- 不再使用右侧单独的大图。
- 部分人物在视觉上靠近或藏在按钮区域周围，但不应遮挡按钮可读性和可点击性。
- 手机端不显示桌面端绝对定位的环绕人物，改为在主文案下方显示 4 张小角色图，避免图片、按钮、文字堆叠。
- 底部展示 28 人总合影：`/assets/cards/starheart-cast.webp`。

相关样式：

- `.home-stage-character`：桌面端环绕人物的圆形抠图和阴影。
- `.home-mobile-character`：手机端小角色图的圆形抠图和阴影。

## 7. 双色球生成页当前设计

文件：`src/pages/LuckyPage.tsx`

当前功能与设计：

- 页面专门生成双色球，不再展示通用自定义模板。
- 保留星座和 MBTI 选择，作为模型随机种子和个性因子。
- 点击“生成双色球”后生成 6 个红球和 1 个蓝球。
- 红球结果同时展示模型抽取原顺序和升序整理结果。
- 双色球页保留星座与 MBTI 两张形象图片。
- 双色球页不显示推荐昵称、生成昵称按钮、生成幸运号码按钮、组合标题和性格特点。
- 页面下方展示最近双色球走势图。
- 走势图不使用横向拖动轴，按页面宽度自适应压缩显示。
- 走势图左侧只显示日期，不显示期号。
- 走势图中红球圆点里的数字表示该期红球出球顺序。
- 走势图在窄屏下隐藏未命中的浅色数字，只保留命中圆点，避免 49 列数字重叠；宽屏下显示未命中数字。
- 蓝球用蓝色圆点标记。
- 数据优先来自后端 `/api/ssq/history`，失败时使用内置示例数据。
- 页面明确提示：模型结果仅供娱乐，不保证、不暗示、不预测中奖。

相关样式：

- `.ssq-ball`：双色球结果号码球通用样式。
- `.ssq-red-ball`：红球渐变。
- `.ssq-blue-ball`：蓝球渐变。
- `.ssq-trend-table`：走势图表格。
- `.trend-red-hit`：红球命中点，内部数字为出球顺序。
- `.trend-blue-hit`：蓝球命中点。

## 7.1 双色球后端

目录：`server/`

后端当前使用 Node.js 内置 HTTP server，不依赖 Express，部署轻量。

启动命令：

```bash
npm run server
```

默认监听：

```text
http://127.0.0.1:8787
```

接口：

| 接口 | 方法 | 用途 |
| --- | --- | --- |
| `/api/ssq/health` | GET | 健康检查 |
| `/api/ssq/history?limit=60` | GET | 获取最近双色球历史 |
| `/api/ssq/generate` | POST | 根据星座、MBTI、历史数据生成双色球 |
| `/api/ssq/sync` | POST | 强制同步远程开奖数据 |

数据抓取策略：

- 优先使用中彩网开奖详情 JSONP 接口。
- 期号列表接口：`transactionType=10001003`。
- 单期开奖详情接口：`transactionType=10001002`。
- 红球出球顺序字段：`seqFrontWinningNum`。
- 红球升序字段：`frontWinningNum`。
- 蓝球字段：`seqBackWinningNum` 或 `backWinningNum`。
- 如果中彩网接口失败，尝试使用中国福彩网普通开奖列表兜底。
- 如果远程抓取失败且无缓存，使用内置示例数据。

缓存策略：

- 同步成功后写入 `server/cache/ssq-history.json`。
- `server/cache/` 已加入 `.gitignore`，不提交运行时缓存。

模型策略：

- 前端模型文件：`src/lib/ssqModel.ts`。
- 后端模型文件：`server/ssq-model.mjs`。
- 当前为轻量历史加权模型，不是中奖预测模型。
- 使用历史频率、近期权重、星座、MBTI 和时间种子生成结果。
- 红球不重复，范围 01-33。
- 蓝球范围 01-16。

## 8. 星座资料

文件：`src/data/zodiacProfiles.ts`

星座 ID 和图片命名必须保持一致：

| ID | 中文 | 图片路径 |
| --- | --- | --- |
| `aries` | 白羊座 | `/assets/cards/zodiac/aries.webp` |
| `taurus` | 金牛座 | `/assets/cards/zodiac/taurus.webp` |
| `gemini` | 双子座 | `/assets/cards/zodiac/gemini.webp` |
| `cancer` | 巨蟹座 | `/assets/cards/zodiac/cancer.webp` |
| `leo` | 狮子座 | `/assets/cards/zodiac/leo.webp` |
| `virgo` | 处女座 | `/assets/cards/zodiac/virgo.webp` |
| `libra` | 天秤座 | `/assets/cards/zodiac/libra.webp` |
| `scorpio` | 天蝎座 | `/assets/cards/zodiac/scorpio.webp` |
| `sagittarius` | 射手座 | `/assets/cards/zodiac/sagittarius.webp` |
| `capricorn` | 摩羯座 | `/assets/cards/zodiac/capricorn.webp` |
| `aquarius` | 水瓶座 | `/assets/cards/zodiac/aquarius.webp` |
| `pisces` | 双鱼座 | `/assets/cards/zodiac/pisces.webp` |

每个星座资料包含：

- 中文名、英文名
- 日期范围
- 起止日期
- 元素
- 守护星
- 关键词
- 简介
- 性格讲解
- 感情风格
- 工作风格
- 幸运色
- 幸运关键词
- 卡片主题色
- 图片路径

## 9. MBTI 资料

文件：`src/data/mbtiProfiles.ts`

MBTI 类型和图片命名必须保持一致：

| 类型 | 中文称呼 | 图片路径 |
| --- | --- | --- |
| `INTJ` | 策划师 | `/assets/cards/mbti/intj.webp` |
| `INTP` | 思想家 | `/assets/cards/mbti/intp.webp` |
| `ENTJ` | 指挥官 | `/assets/cards/mbti/entj.webp` |
| `ENTP` | 辩论家 | `/assets/cards/mbti/entp.webp` |
| `INFJ` | 提灯者 | `/assets/cards/mbti/infj.webp` |
| `INFP` | 调停者 | `/assets/cards/mbti/infp.webp` |
| `ENFJ` | 引路人 | `/assets/cards/mbti/enfj.webp` |
| `ENFP` | 追光者 | `/assets/cards/mbti/enfp.webp` |
| `ISTJ` | 守序者 | `/assets/cards/mbti/istj.webp` |
| `ISFJ` | 守护者 | `/assets/cards/mbti/isfj.webp` |
| `ESTJ` | 执行官 | `/assets/cards/mbti/estj.webp` |
| `ESFJ` | 执政官 | `/assets/cards/mbti/esfj.webp` |
| `ISTP` | 工匠 | `/assets/cards/mbti/istp.webp` |
| `ISFP` | 艺术家 | `/assets/cards/mbti/isfp.webp` |
| `ESTP` | 冒险家 | `/assets/cards/mbti/estp.webp` |
| `ESFP` | 表演者 | `/assets/cards/mbti/esfp.webp` |

每个 MBTI 资料包含：

- 类型
- 中文称呼
- 英文称呼
- 简介
- 优势
- 弱点
- 关键词
- 推荐昵称风格
- 卡片主题色
- 图片路径

## 10. 图片资产规范

星座图片目录：

```text
public/assets/cards/zodiac/
```

MBTI 图片目录：

```text
public/assets/cards/mbti/
```

合成图片：

```text
public/assets/cards/zodiac-grid.webp
public/assets/cards/mbti-grid.webp
public/assets/cards/starheart-cast.webp
```

占位图：

```text
public/assets/cards/placeholder.svg
```

图片引用规则：

- 在 React 代码中使用站点根路径，例如 `/assets/cards/zodiac/aries.webp`。
- 在 GitHub README 中使用 raw 链接，例如：

```text
https://raw.githubusercontent.com/Whyregister/Starheart/main/public/assets/cards/zodiac/aries.webp
```

添加或替换图片时：

1. 保持 `.webp` 格式。
2. 文件名必须小写。
3. 文件名必须与 `zodiacProfiles.ts` 或 `mbtiProfiles.ts` 中的 ID 对应。
4. 替换图片后运行 `npm run build` 确认资源引用没有破坏。
5. 如果 README 或本文件中列出的图片发生变化，同步更新文档。

## 11. 公共组件

| 文件 | 用途 |
| --- | --- |
| `src/components/Layout/Layout.tsx` | 全站布局、导航和主体容器 |
| `src/components/Common/Button.tsx` | 通用按钮 |
| `src/components/Common/CopyButton.tsx` | 复制按钮 |
| `src/components/Common/ProfileImage.tsx` | 图片展示，加载失败时回退到占位图 |
| `src/components/Common/Section.tsx` | 页面分区标题和描述 |
| `src/components/Common/Tag.tsx` | 标签样式 |
| `src/components/Starheart/StarheartComboPreview.tsx` | 星座 + MBTI 组合预览 |

## 12. 业务逻辑文件

| 文件 | 用途 |
| --- | --- |
| `src/lib/mbti.ts` | 计算 MBTI 结果 |
| `src/lib/zodiac.ts` | 星座日期判断等逻辑 |
| `src/lib/nickname.ts` | 昵称生成逻辑 |
| `src/lib/luckyNumber.ts` | 幸运号码模板验证和号码生成 |
| `src/lib/random.ts` | 可复现随机数 |
| `src/lib/format.ts` | 日期种子格式化 |
| `src/lib/validators.ts` | 通用校验 |
| `src/lib/celestial.ts` | 根据当前时间返回太阳/月亮模式 |
| `src/lib/ssqModel.ts` | 前端双色球历史加权模型和数据标准化 |
| `server/ssq-model.mjs` | 后端双色球历史加权模型 |
| `server/ssq-data.mjs` | 双色球远程抓取、出球顺序清洗和缓存 |
| `server/index.mjs` | 后端 API 服务入口 |

## 13. 测试文件

当前测试文件：

```text
src/lib/mbti.test.ts
src/lib/zodiac.test.ts
src/lib/nickname.test.ts
src/lib/luckyNumber.test.ts
src/lib/celestial.test.ts
src/lib/ssqModel.test.ts
```

每次改动后建议至少运行：

```bash
npx vitest run
npm run build
```

## 14. README 规则

`README.md` 当前用于 GitHub 仓库展示：

- 项目介绍
- 功能说明
- 图片展示
- 星座与 MBTI 形象图表格
- 一行两张图片
- 图片下方标注对应星座或 MBTI
- 图片链接使用 `raw.githubusercontent.com` 形式

如果新增、删除、改名图片，需要同步检查 README。

## 15. VPS / Nginx 部署

当前项目已经包含前端和后端。前端构建后是静态文件，后端需要独立运行 Node 服务。

建议路径：

```text
/var/www/starheart
```

后端建议路径：

```text
/opt/starheart
```

Nginx 示例配置文件：

```text
nginx-starheart.conf
```

关键配置：

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

这个配置用于支持 React Router 的前端路由，避免刷新 `/mbti`、`/cards` 等路径时返回 404。

如果同域名反代后端 API，Nginx 需要增加：

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:8787;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

注意：

- 如果服务器没有 `/etc/nginx`，通常说明 Nginx 未安装。
- Ubuntu 可先安装：`apt update && apt install -y nginx`
- 安装后再检查：`nginx -v` 和 `ls /etc/nginx`
- 如果使用宝塔、1Panel、Caddy 或其他面板，配置路径可能与标准 Nginx 不同。
- 后端可用 PM2 或 systemd 保持常驻，例如 `npm run server`。

## 16. 当前 Git 状态备注

截至 2026-07-09，本地存在未提交改动：

- `.gitignore`
- `detail.md`
- `docs/superpowers/plans/2026-07-09-ssq-backend-model.md`
- `package.json`
- `vite.config.ts`
- `src/index.css`
- `src/pages/HomePage.tsx`
- `src/pages/LuckyPage.tsx`
- `src/lib/celestial.ts`
- `src/lib/celestial.test.ts`
- `src/lib/ssqModel.ts`
- `src/lib/ssqModel.test.ts`
- `src/types/ssq.ts`
- `src/data/sampleSsqDraws.ts`
- `server/index.mjs`
- `server/ssq-data.mjs`
- `server/ssq-model.mjs`
- `server/sample-ssq-data.mjs`
- `public/assets/cards/zodiac-grid.webp`
- `public/assets/cards/mbti-grid.webp`
- `public/assets/cards/starheart-cast.webp`
- `QQ20260625-231656.png` 在工作区显示为已删除

这些改动对应最近的首页视觉调整、双色球后端与页面改造、太阳/月亮逻辑、合成图片资源和项目档案更新。提交或推送前需要再次确认是否保留删除的旧截图文件。

## 17. 维护规则

以后每次修改项目时，同步检查并更新本文件：

- 新增或删除页面：更新“路由与页面”。
- 改首页布局：更新“首页当前设计”。
- 改幸运号码逻辑或样式：更新“幸运号码页当前设计”。
- 改星座资料：更新“星座资料”。
- 改 MBTI 资料：更新“MBTI 资料”。
- 改图片路径、命名、格式或合成图：更新“图片资产规范”。
- 新增公共组件：更新“公共组件”。
- 新增业务逻辑：更新“业务逻辑文件”。
- 新增测试：更新“测试文件”。
- 改部署方式：更新“VPS / Nginx 部署”。
- 提交、推送或出现重要工作区状态变化：更新“当前 Git 状态备注”。

维护原则：这个文件要记录“项目现在真实是什么样”，不要只记录计划。
