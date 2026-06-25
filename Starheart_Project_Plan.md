# Starheart / 星心 Web 应用项目策划

版本：v1.0  
用途：可直接交给 Codex / Cursor / Claude Code 作为项目开发说明  
项目类型：纯前端轻量级娱乐工具站  
部署目标：个人 VPS + Nginx 静态托管

---

## 一、项目定位

### 1. 项目名称

英文名：**Starheart**  
中文名：**星心**

### 2. 项目一句话介绍

**星心 Starheart** 是一个结合 MBTI、星座、AI 形象卡片、昵称生成和幸运号码生成的轻量级娱乐 Web 应用。

### 3. 项目核心功能

网站提供以下功能：

1. 免费 MBTI 测试
2. 星座性格讲解
3. 星座形象卡片
4. MBTI 形象卡片
5. 星座 + MBTI 组合展示
6. 根据星座和 MBTI 生成昵称
7. 根据星座、MBTI、时间种子和模板生成幸运号码
8. 支持自定义幸运号码模板
9. 内置双色球号码模板

### 4. 产品定位

这是一个开放访问的轻量级娱乐工具站，主要用于：

- 自我探索
- 个性展示
- 昵称灵感生成
- 星座 / MBTI 趣味解读
- 幸运号码娱乐生成
- 社交分享素材生成

网站内容仅供娱乐，不做严肃心理诊断、不做职业建议、不做彩票预测。

---

## 二、核心原则

### 1. 开放访问

- 不要求用户注册。
- 不要求用户登录。
- 所有页面直接访问。
- 不需要账号体系。
- 不需要后台管理系统。

### 2. 无数据库持久化

第一版不接入数据库。

不使用：

- MySQL
- PostgreSQL
- MongoDB
- Redis
- Supabase
- Firebase
- 其他持久化数据库

用户数据只存在于当前浏览器窗口的运行状态中。

页面关闭、刷新或连接释放后，用户临时数据可以自然消失。

### 3. 不保存用户数据

以下内容不保存到服务器：

- MBTI 答题记录
- MBTI 测试结果
- 星座选择
- 昵称生成历史
- 幸运号码生成历史
- 自定义幸运号码模板

### 4. 默认模板写死在前端

例如双色球模板直接写在代码中。

用户自定义模板只保存在当前页面状态中，不写数据库。

### 5. 纯静态优先

项目第一版建议做成纯前端 SPA。

VPS 只负责托管静态资源。

推荐部署方式：

```bash
Vite build -> dist -> Nginx
```

---

## 三、推荐技术栈

### 1. 前端

- React
- Vite
- TypeScript
- Tailwind CSS
- React Router
- lucide-react

### 2. 状态管理

优先使用 React 自带能力：

- useState
- useReducer
- Context

也可以使用 Zustand，但不要开启持久化插件。

### 3. 后端

第一版不需要后端。

### 4. 部署

- VPS
- Nginx
- 可选 Certbot 配置 HTTPS

### 5. 图片资源

- 图片离线生成
- 图片作为静态资源放入 `public/assets/cards/`
- 推荐格式：WebP
- 推荐尺寸：1024 × 1024

---

## 四、项目目录结构

推荐目录结构如下：

```text
starheart/
  README.md
  package.json
  index.html
  vite.config.ts
  tsconfig.json
  tailwind.config.js
  postcss.config.js

  public/
    assets/
      cards/
        placeholder.webp
        zodiac/
          aries.webp
          taurus.webp
          gemini.webp
          cancer.webp
          leo.webp
          virgo.webp
          libra.webp
          scorpio.webp
          sagittarius.webp
          capricorn.webp
          aquarius.webp
          pisces.webp
        mbti/
          intj.webp
          intp.webp
          entj.webp
          entp.webp
          infj.webp
          infp.webp
          enfj.webp
          enfp.webp
          istj.webp
          isfj.webp
          estj.webp
          esfj.webp
          istp.webp
          isfp.webp
          estp.webp
          esfp.webp

  src/
    main.tsx
    index.css

    app/
      App.tsx
      routes.tsx

    components/
      Layout/
        Header.tsx
        Footer.tsx
        PageContainer.tsx

      Common/
        Button.tsx
        Card.tsx
        Select.tsx
        Input.tsx
        Notice.tsx
        CopyButton.tsx
        Tag.tsx

      MBTI/
        MBTIQuestionCard.tsx
        MBTIProgress.tsx
        MBTIResultCard.tsx
        MBTIDimensionBar.tsx
        MBTIProfileCard.tsx

      Zodiac/
        ZodiacSelector.tsx
        ZodiacCard.tsx
        ZodiacProfilePanel.tsx
        ZodiacCardGrid.tsx

      Nickname/
        NicknameForm.tsx
        NicknameResultList.tsx

      Lucky/
        LuckyTemplateSelector.tsx
        LuckyTemplateEditor.tsx
        LuckyNumberForm.tsx
        LuckyNumberResultCard.tsx

      Starheart/
        StarheartComboPreview.tsx

    pages/
      HomePage.tsx
      MBTIPage.tsx
      MBTIResultPage.tsx
      ZodiacPage.tsx
      CardsPage.tsx
      NicknamePage.tsx
      LuckyPage.tsx
      AboutPage.tsx

    data/
      mbtiQuestions.ts
      mbtiProfiles.ts
      zodiacProfiles.ts
      nicknameWords.ts
      defaultLuckyTemplates.ts

    lib/
      mbti.ts
      zodiac.ts
      nickname.ts
      luckyNumber.ts
      random.ts
      validators.ts
      format.ts

    types/
      mbti.ts
      zodiac.ts
      nickname.ts
      lucky.ts
      common.ts
```

---

## 五、页面路由设计

推荐路由如下：

```text
/
首页

/mbti
MBTI 免费测试

/mbti/result
MBTI 测试结果页

/zodiac
星座性格讲解

/cards
星座卡片与 MBTI 卡片

/nickname
昵称生成器

/lucky
幸运号码生成器

/about
关于星心
```

如果希望开发更简单，也可以第一版做成单页 Tab 切换，但推荐使用 React Router，后续扩展更方便。

---

## 六、整体 UI 风格

### 1. 设计方向

整体风格：

```text
星空、宇宙、玻璃拟态、紫蓝渐变、柔和发光、圆角卡片、轻量动效
```

### 2. 视觉关键词

```text
starry, dreamy, glassmorphism, soft glow, purple blue gradient, clean card, cute 3D character, pastel light
```

### 3. 主色建议

```text
深蓝黑：#090B1A
星紫色：#7C3AED
星蓝色：#2563EB
粉紫色：#EC4899
浅文字：#F8FAFC
弱文字：#94A3B8
卡片边框：rgba(255,255,255,0.14)
卡片背景：rgba(255,255,255,0.08)
```

### 4. 页面背景

建议使用：

- 深色渐变背景
- 星点纹理
- 模糊光斑
- 半透明卡片

### 5. 按钮

主按钮：

```text
紫蓝渐变 + 圆角 + 轻微阴影
```

次按钮：

```text
半透明背景 + 白色边框 + hover 高亮
```

### 6. 移动端适配

必须保证：

- 手机端不卡横向滚动
- 卡片单列展示
- 表单宽度 100%
- 按钮易点击
- 图片自适应

---

## 七、首页设计

### 1. 首页标题

```text
Starheart 星心
```

### 2. 首页副标题

```text
在星座、MBTI 与时间种子中，找到属于你的个性符号。
```

### 3. 首页功能入口

首页展示 5 个功能卡片：

1. 免费 MBTI 测试
2. 星座性格讲解
3. 星座 / MBTI 形象卡片
4. 昵称生成器
5. 幸运号码生成器

### 4. 首页底部提示

```text
本网站内容仅供娱乐和自我探索参考，不构成心理诊断、人生建议、职业建议或彩票购买建议。
```

---

## 八、MBTI 免费测试功能

### 1. 功能目标

用户完成 MBTI 测试后，系统计算出 16 型人格之一，例如：

- INFP
- INTJ
- ENTP
- ESFJ

并展示：

- MBTI 类型
- 中文称号
- 英文称号
- 四个维度倾向
- 简短性格描述
- 优势特点
- 可能短板
- 关键词
- 适合昵称风格
- 对应 AI 形象卡

### 2. MBTI 维度

MBTI 分为四组维度：

```text
E / I：外向 / 内向
S / N：实感 / 直觉
T / F：思考 / 情感
J / P：判断 / 知觉
```

### 3. 题目数量

MVP 版本使用 32 道题：

- E/I：8 道
- S/N：8 道
- T/F：8 道
- J/P：8 道

后续可以扩展到 48 道或 60 道。

### 4. 答题形式

每道题使用 5 档选择：

```text
1 非常不同意
2 比较不同意
3 不确定
4 比较同意
5 非常同意
```

### 5. MBTI 题目数据结构

```ts
export type MBTIDimension = "EI" | "SN" | "TF" | "JP";

export type MBTILetter = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";

export type MBTIQuestion = {
  id: string;
  text: string;
  dimension: MBTIDimension;
  positive: MBTILetter;
};
```

### 6. 题目示例

```ts
export const mbtiQuestions: MBTIQuestion[] = [
  {
    id: "ei-01",
    text: "我喜欢在社交场合中认识新朋友。",
    dimension: "EI",
    positive: "E"
  },
  {
    id: "ei-02",
    text: "长时间社交之后，我通常需要独处来恢复精力。",
    dimension: "EI",
    positive: "I"
  },
  {
    id: "sn-01",
    text: "相比抽象可能性，我更关注眼前具体事实。",
    dimension: "SN",
    positive: "S"
  },
  {
    id: "sn-02",
    text: "我经常会从一件小事联想到很多未来可能性。",
    dimension: "SN",
    positive: "N"
  }
];
```

### 7. 计分规则

每道题根据用户选择给正向字母和对立字母分别加分。

如果题目 positive 是 `E`，那么：

```text
选择 1：E + 0，I + 4
选择 2：E + 1，I + 3
选择 3：E + 2，I + 2
选择 4：E + 3，I + 1
选择 5：E + 4，I + 0
```

如果 positive 是 `I`，则反过来给 `I` 加正向分。

### 8. 计分函数要求

文件：

```text
src/lib/mbti.ts
```

导出：

```ts
export function calculateMBTIResult(
  answers: Record<string, number>,
  questions: MBTIQuestion[]
): MBTIResult
```

返回：

```ts
export type MBTIResult = {
  type: string;
  scores: {
    E: number;
    I: number;
    S: number;
    N: number;
    T: number;
    F: number;
    J: number;
    P: number;
  };
  uncertainDimensions: string[];
};
```

当某一维度分数相同，需要加入 `uncertainDimensions`。

结果页显示：

```text
该维度倾向不明显，结果仅供参考。
```

### 9. MBTI 结果数据结构

```ts
export type MBTIProfile = {
  type: string;
  nameZh: string;
  nameEn: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  keywords: string[];
  nicknameStyles: string[];
  image: string;
  cardTheme: {
    primaryColor: string;
    secondaryColor: string;
    aura: string;
  };
};
```

### 10. MBTI 示例数据

```ts
{
  type: "INFP",
  nameZh: "调停者",
  nameEn: "Mediator",
  summary: "温和、理想主义、重视内在价值，常常有丰富的想象力和共情能力。",
  strengths: ["共情能力强", "想象力丰富", "重视真实感受"],
  weaknesses: ["容易过度理想化", "有时逃避冲突", "行动节奏可能不稳定"],
  keywords: ["月光", "梦境", "森林", "诗意", "温柔"],
  nicknameStyles: ["治愈系", "梦幻系", "文艺系"],
  image: "/assets/cards/mbti/infp.webp",
  cardTheme: {
    primaryColor: "#A78BFA",
    secondaryColor: "#34D399",
    aura: "梦幻、温柔、月光、花朵"
  }
}
```

---

## 九、星座性格讲解功能

### 1. 功能目标

用户选择星座后，展示该星座的完整性格讲解和 AI 形象卡片。

支持 12 星座：

```text
白羊座、金牛座、双子座、巨蟹座、狮子座、处女座、
天秤座、天蝎座、射手座、摩羯座、水瓶座、双鱼座
```

### 2. 星座数据结构

```ts
export type ZodiacElement = "火象" | "土象" | "风象" | "水象";

export type ZodiacProfile = {
  id: string;
  nameZh: string;
  nameEn: string;
  dateRange: string;
  element: ZodiacElement;
  rulingPlanet: string;
  keywords: string[];
  summary: string;
  personality: string[];
  loveStyle: string;
  careerStyle: string;
  luckyColor: string;
  luckyKeywords: string[];
  image: string;
  cardTheme: {
    primaryColor: string;
    secondaryColor: string;
    aura: string;
  };
};
```

### 3. 星座示例数据

```ts
{
  id: "aries",
  nameZh: "白羊座",
  nameEn: "Aries",
  dateRange: "3月21日 - 4月19日",
  element: "火象",
  rulingPlanet: "火星",
  keywords: ["热情", "直接", "行动力", "冒险"],
  summary: "白羊座通常给人积极、直接、行动力强的印象，喜欢快速开始，也敢于表达自己的想法。",
  personality: ["反应快", "不喜欢拖延", "容易被新鲜事物吸引"],
  loveStyle: "表达直接，喜欢热烈、明确、有回应的关系。",
  careerStyle: "适合需要行动力、开拓精神和竞争意识的场景。",
  luckyColor: "红色",
  luckyKeywords: ["火焰", "晨光", "冲锋", "新开始"],
  image: "/assets/cards/zodiac/aries.webp",
  cardTheme: {
    primaryColor: "#EF4444",
    secondaryColor: "#F97316",
    aura: "火焰、晨光、冲锋感"
  }
}
```

### 4. 星座查询函数

文件：

```text
src/lib/zodiac.ts
```

导出：

```ts
export function getZodiacById(id: string): ZodiacProfile | undefined

export function getZodiacByDate(month: number, day: number): ZodiacProfile | undefined
```

---

## 十、星座卡片与 MBTI 卡片功能

### 1. 功能目标

网站需要提供专门的卡片展示页。

展示：

- 12 张星座形象卡片
- 16 张 MBTI 形象卡片

### 2. 卡片内容

星座卡片展示：

- AI 形象图
- 星座中文名
- 星座英文名
- 日期范围
- 星座元素
- 守护星
- 关键词
- 幸运色
- 一句话性格描述

MBTI 卡片展示：

- AI 形象图
- MBTI 类型
- 中文称号
- 英文称号
- 关键词
- 简短性格描述

### 3. 卡片文案复制

星座卡片复制文案示例：

```text
白羊座 Aries
日期：3月21日 - 4月19日
元素：火象
关键词：热情、直接、行动力、冒险
一句话：像清晨第一束火光，快速、明亮、敢于开始。
```

MBTI 卡片复制文案示例：

```text
INFP 调停者 Mediator
关键词：月光、梦境、森林、诗意、温柔
简介：温和、理想主义、重视内在价值，常常有丰富的想象力和共情能力。
```

---

## 十一、AI 形象卡片系统

### 1. 总体要求

Starheart 的星座卡片和 MBTI 卡片需要统一采用 AI 生成的 3D 卡通形象风格。

参考风格：

```text
3D 卡通人物、Q版比例、大头小身、软萌玩偶质感、轻微低多边形风格、柔和灯光、干净背景、青春感、治愈感、适合 Web 卡片展示。
```

英文关键词：

```text
3D chibi character, big head small body, cute toy-like figure, soft pastel colors, low-poly details, clean studio lighting, rounded shapes, friendly expression, stylized character, starry fantasy theme
```

禁止风格：

```text
写实人脸、恐怖风、暗黑血腥、过度性感、复杂背景、强烈真人肖像感、侵权动漫角色风格、带文字水印
```

### 2. 卡片数量

第一版需要：

```text
12 张星座形象卡
16 张 MBTI 形象卡
合计 28 张核心形象图
```

第一版不建议直接做 `12 × 16 = 192` 张组合卡，工作量太大。

### 3. 图片生成方式

第一版不要在网站中接入 AI 绘图 API。

原因：

1. 会增加后端服务复杂度。
2. 会带来 API Key 泄露风险。
3. 开放访问可能产生费用。
4. 纯静态部署更适合个人 VPS。

正确方式：

1. 使用 ComfyUI / Stable Diffusion / Midjourney / DALL·E 等工具离线生成图片。
2. 人工筛选满意图片。
3. 统一裁剪成 1:1。
4. 压缩为 WebP。
5. 放入 `public/assets/cards/` 目录。
6. 前端直接引用静态图片。

### 4. 图片资源路径

星座图片路径：

```text
/assets/cards/zodiac/aries.webp
/assets/cards/zodiac/taurus.webp
/assets/cards/zodiac/gemini.webp
/assets/cards/zodiac/cancer.webp
/assets/cards/zodiac/leo.webp
/assets/cards/zodiac/virgo.webp
/assets/cards/zodiac/libra.webp
/assets/cards/zodiac/scorpio.webp
/assets/cards/zodiac/sagittarius.webp
/assets/cards/zodiac/capricorn.webp
/assets/cards/zodiac/aquarius.webp
/assets/cards/zodiac/pisces.webp
```

MBTI 图片路径：

```text
/assets/cards/mbti/intj.webp
/assets/cards/mbti/intp.webp
/assets/cards/mbti/entj.webp
/assets/cards/mbti/entp.webp
/assets/cards/mbti/infj.webp
/assets/cards/mbti/infp.webp
/assets/cards/mbti/enfj.webp
/assets/cards/mbti/enfp.webp
/assets/cards/mbti/istj.webp
/assets/cards/mbti/isfj.webp
/assets/cards/mbti/estj.webp
/assets/cards/mbti/esfj.webp
/assets/cards/mbti/istp.webp
/assets/cards/mbti/isfp.webp
/assets/cards/mbti/estp.webp
/assets/cards/mbti/esfp.webp
```

占位图路径：

```text
/assets/cards/placeholder.webp
```

如果具体图片暂时不存在，前端先使用占位图。

### 5. 图片规格

推荐：

```text
尺寸：1024 × 1024
格式：WebP
背景：干净浅色或淡紫色
主体：单个 3D Q版人物
画幅：居中构图
```

前端展示尺寸：

```text
缩略图：240 × 240
详情图：420 × 420
移动端：宽度自适应
```

### 6. 图片加载要求

使用 lazy loading：

```tsx
<img
  src={profile.image}
  alt={`${profile.nameZh || profile.type} AI 形象卡片`}
  loading="lazy"
/>
```

### 7. 通用正向 Prompt

```text
3D chibi character, big head small body, cute toy-like figure, soft pastel colors, low-poly stylized details, clean studio lighting, rounded shapes, friendly expression, starry fantasy theme, clean pastel background, centered composition, high quality, no text, no watermark
```

### 8. 通用负向 Prompt

```text
realistic human face, horror, blood, gore, overly sexy, revealing clothes, violence, dark disturbing atmosphere, copyrighted anime character, celebrity likeness, text, watermark, logo, messy background, extra fingers, deformed hands, distorted face
```

---

## 十二、12 星座 AI 形象设定与 Prompt

### 1. 白羊座 Aries

形象方向：

```text
热情、冲劲、少年感、火焰、冒险家。
```

角色设计：

```text
红橙色短外套，头上有小羊角元素，手持小旗或火焰徽章，表情自信，向前迈步。
```

Prompt：

```text
3D chibi character, big head small body, cute toy-like style, Aries zodiac theme, energetic young adventurer, small ram horn accessories, red and orange outfit, holding a tiny flame badge, confident smile, dynamic walking pose, soft pastel lighting, clean lavender background, low-poly stylized details, no text, no watermark
```

### 2. 金牛座 Taurus

形象方向：

```text
稳定、温和、自然、可靠、质感。
```

角色设计：

```text
绿色或棕色服装，牛角发饰，手捧小植物或金币，表情温和沉稳。
```

Prompt：

```text
3D chibi character, big head small body, Taurus zodiac theme, gentle and calm personality, small bull horn headband, earth green and warm brown outfit, holding a tiny plant and golden coin, soft smile, stable standing pose, toy-like texture, clean pastel background, low-poly stylized, no text, no watermark
```

### 3. 双子座 Gemini

形象方向：

```text
灵动、聪明、双重性、交流、好奇。
```

角色设计：

```text
蓝黄色搭配，手拿两张小卡片或双星符号，表情俏皮，动作轻快。
```

Prompt：

```text
3D chibi character, Gemini zodiac theme, playful curious young character, blue and yellow outfit, holding two little star cards, twin star accessories, lively expression, light floating pose, cute toy-like figure, big head small body, soft studio lighting, clean pastel background, no text, no watermark
```

### 4. 巨蟹座 Cancer

形象方向：

```text
温柔、守护、家庭感、月亮、水。
```

角色设计：

```text
浅蓝色斗篷，螃蟹小发夹，怀里抱着月亮抱枕，表情温柔。
```

Prompt：

```text
3D chibi character, Cancer zodiac theme, gentle guardian personality, light blue cloak, tiny crab hair clip, holding a crescent moon pillow, warm caring expression, soft water and moon inspired outfit, cute toy-like style, big head small body, clean dreamy background, no text, no watermark
```

### 5. 狮子座 Leo

形象方向：

```text
自信、舞台感、太阳、领导力。
```

角色设计：

```text
金黄色披风，狮鬃感头发或狮子耳饰，手持太阳权杖，表情明亮自信。
```

Prompt：

```text
3D chibi character, Leo zodiac theme, confident little leader, golden cape, lion mane inspired hair, tiny lion ear accessories, holding a small sun scepter, bright confident smile, warm golden outfit, cute toy-like style, big head small body, clean pastel studio background, no text, no watermark
```

### 6. 处女座 Virgo

形象方向：

```text
细致、理性、整洁、分析、纯净。
```

角色设计：

```text
白绿色学院风服装，手拿笔记本和羽毛笔，表情认真但可爱。
```

Prompt：

```text
3D chibi character, Virgo zodiac theme, neat and thoughtful young analyst, white and soft green outfit, holding a notebook and feather pen, clean elegant style, focused cute expression, organized personality, toy-like 3D figure, big head small body, soft lighting, clean pastel background, no text, no watermark
```

### 7. 天秤座 Libra

形象方向：

```text
优雅、平衡、审美、社交。
```

角色设计：

```text
粉紫色或浅蓝礼服，手持小天秤，姿态优雅，微笑。
```

Prompt：

```text
3D chibi character, Libra zodiac theme, elegant and balanced personality, pastel pink and light blue outfit, holding a tiny balance scale, graceful pose, friendly smile, aesthetic and charming style, toy-like 3D figure, big head small body, soft clean lighting, no text, no watermark
```

### 8. 天蝎座 Scorpio

形象方向：

```text
神秘、深邃、洞察力、夜色。
```

角色设计：

```text
深紫黑服装，小蝎尾装饰，手持紫色水晶，眼神冷静。
```

Prompt：

```text
3D chibi character, Scorpio zodiac theme, mysterious and deep personality, dark purple and black outfit, tiny scorpion tail accessory, holding a glowing purple crystal, calm intense eyes, cute but mysterious toy-like figure, big head small body, soft dramatic lighting, clean dark pastel background, no text, no watermark
```

### 9. 射手座 Sagittarius

形象方向：

```text
自由、远方、探索、乐观。
```

角色设计：

```text
旅行者装扮，背小包，手持小弓箭或指南针，表情开朗。
```

Prompt：

```text
3D chibi character, Sagittarius zodiac theme, cheerful little traveler, wearing adventure outfit, small backpack, holding a tiny bow and compass, optimistic smile, freedom and exploration theme, cute toy-like 3D style, big head small body, soft pastel background, no text, no watermark
```

### 10. 摩羯座 Capricorn

形象方向：

```text
坚韧、目标感、自律、山峰。
```

角色设计：

```text
深绿色或灰色服装，小山羊角，手持计划书或登山杖，表情坚定。
```

Prompt：

```text
3D chibi character, Capricorn zodiac theme, determined and disciplined young climber, dark green and gray outfit, small goat horn accessories, holding a tiny planner and hiking stick, mountain ambition theme, calm focused expression, cute toy-like figure, big head small body, clean pastel background, no text, no watermark
```

### 11. 水瓶座 Aquarius

形象方向：

```text
独特、未来感、创新、思想实验。
```

角色设计：

```text
蓝紫色未来感服装，手持水瓶或小型科技装置，发型略特别，表情聪明。
```

Prompt：

```text
3D chibi character, Aquarius zodiac theme, futuristic creative young inventor, blue and violet outfit, holding a glowing water jar and tiny tech device, unique hairstyle, clever expression, innovation and air element feeling, cute toy-like style, big head small body, clean pastel sci-fi background, no text, no watermark
```

### 12. 双鱼座 Pisces

形象方向：

```text
梦幻、浪漫、感性、海洋、幻想。
```

角色设计：

```text
浅紫蓝渐变服装，鱼尾或小鱼发饰，手捧星星或贝壳，表情温柔。
```

Prompt：

```text
3D chibi character, Pisces zodiac theme, dreamy and gentle young dreamer, pastel blue and lavender outfit, tiny fish hair accessories, holding a little star and seashell, ocean fantasy feeling, soft tender smile, cute toy-like 3D figure, big head small body, clean dreamy background, no text, no watermark
```

---

## 十三、16 MBTI AI 形象设定与 Prompt

### 1. INTJ 建筑师

角色设计：

```text
冷静的战略规划者，蓝黑色服装，手持星图或透明蓝图，眼神专注。
```

Prompt：

```text
3D chibi character, INTJ architect personality theme, calm strategic planner, dark blue and black outfit, round glasses, holding a glowing blueprint and star map, intelligent focused expression, cute toy-like 3D style, big head small body, soft studio lighting, clean pastel background, no text, no watermark
```

### 2. INTP 逻辑学家

角色设计：

```text
好奇的研究者，白蓝实验风，手持公式板或小机器人，表情若有所思。
```

Prompt：

```text
3D chibi character, INTP logician personality theme, curious little researcher, white and blue lab-inspired outfit, holding a tiny robot and formula board, thoughtful expression, messy cute hair, toy-like 3D style, big head small body, clean soft background, no text, no watermark
```

### 3. ENTJ 指挥官

角色设计：

```text
自信领导者，深红或深紫外套，手持指挥棒或战略棋子。
```

Prompt：

```text
3D chibi character, ENTJ commander personality theme, confident little leader, dark red and purple outfit, holding a command baton and chess piece, determined smile, powerful but cute pose, toy-like 3D style, big head small body, clean pastel background, no text, no watermark
```

### 4. ENTP 辩论家

角色设计：

```text
灵感型辩论者，橙蓝撞色，手持麦克风和灯泡，表情机灵。
```

Prompt：

```text
3D chibi character, ENTP debater personality theme, clever energetic idea maker, orange and blue outfit, holding a tiny microphone and glowing light bulb, playful confident expression, dynamic pose, cute toy-like 3D style, big head small body, clean background, no text, no watermark
```

### 5. INFJ 提倡者

角色设计：

```text
温柔的引路人，紫白长袍感服装，手持灯笼或羽毛，气质安静。
```

Prompt：

```text
3D chibi character, INFJ advocate personality theme, gentle quiet guide, soft purple and white outfit, holding a small lantern and feather, warm thoughtful eyes, mystical calm aura, cute toy-like 3D figure, big head small body, clean dreamy background, no text, no watermark
```

### 6. INFP 调停者

角色设计：

```text
梦幻诗意角色，浅绿浅紫服装，手捧书本、月亮或小花。
```

Prompt：

```text
3D chibi character, INFP mediator personality theme, dreamy poetic little character, pastel green and lavender outfit, holding a small book, crescent moon and tiny flower, gentle emotional expression, soft fantasy aura, cute toy-like style, big head small body, clean pastel background, no text, no watermark
```

### 7. ENFJ 主人公

角色设计：

```text
温暖的鼓舞者，金白色服装，手持星光话筒，表情亲和。
```

Prompt：

```text
3D chibi character, ENFJ protagonist personality theme, warm inspiring little speaker, golden and white outfit, holding a glowing star microphone, friendly confident smile, supportive leader aura, cute toy-like 3D style, big head small body, clean soft background, no text, no watermark
```

### 8. ENFP 竞选者

角色设计：

```text
元气创意家，彩色外套，手持气球、画笔或星星。
```

Prompt：

```text
3D chibi character, ENFP campaigner personality theme, energetic creative dreamer, colorful pastel jacket, holding balloons, paintbrush and little stars, bright excited smile, playful pose, cute toy-like 3D style, big head small body, clean pastel background, no text, no watermark
```

### 9. ISTJ 物流师

角色设计：

```text
可靠秩序型角色，制服感穿搭，手持清单和工具箱。
```

Prompt：

```text
3D chibi character, ISTJ logistician personality theme, reliable organized little worker, navy and gray uniform-inspired outfit, holding a checklist and toolbox, calm serious expression, neat posture, cute toy-like 3D figure, big head small body, clean background, no text, no watermark
```

### 10. ISFJ 守卫者

角色设计：

```text
温和守护者，奶油色和浅棕色服装，手捧爱心或小盾牌。
```

Prompt：

```text
3D chibi character, ISFJ defender personality theme, gentle caring guardian, cream and soft brown outfit, holding a tiny heart shield, warm protective smile, kind and dependable aura, cute toy-like 3D style, big head small body, clean soft background, no text, no watermark
```

### 11. ESTJ 总经理

角色设计：

```text
执行型管理者，西装感服装，手持计划板和印章，表情自信。
```

Prompt：

```text
3D chibi character, ESTJ executive personality theme, practical confident little manager, smart suit-inspired outfit, holding a planning board and stamp, confident direct expression, organized leadership aura, cute toy-like 3D style, big head small body, clean background, no text, no watermark
```

### 12. ESFJ 执政官

角色设计：

```text
亲和社交型角色，粉白色服装，手持花束或派对邀请卡。
```

Prompt：

```text
3D chibi character, ESFJ consul personality theme, friendly social helper, pink and white outfit, holding a bouquet and invitation card, warm cheerful smile, welcoming personality, cute toy-like 3D style, big head small body, clean pastel background, no text, no watermark
```

### 13. ISTP 鉴赏家

角色设计：

```text
冷静动手派，工装风，手持扳手、小机械或无人机。
```

Prompt：

```text
3D chibi character, ISTP virtuoso personality theme, calm hands-on maker, black and olive workwear outfit, holding a tiny wrench and mechanical drone, cool focused expression, practical inventor aura, cute toy-like 3D style, big head small body, clean background, no text, no watermark
```

### 14. ISFP 探险家

角色设计：

```text
自由艺术家，浅色艺术服装，手持画笔或相机，表情安静灵动。
```

Prompt：

```text
3D chibi character, ISFP adventurer personality theme, gentle artistic free spirit, soft pastel outfit, holding a paintbrush and small camera, quiet lively expression, creative natural aura, cute toy-like 3D figure, big head small body, clean dreamy background, no text, no watermark
```

### 15. ESTP 企业家

角色设计：

```text
行动派挑战者，运动夹克，手持滑板、闪电或奖牌。
```

Prompt：

```text
3D chibi character, ESTP entrepreneur personality theme, bold action-oriented challenger, sporty jacket, holding a skateboard, lightning icon and medal, confident playful grin, dynamic pose, cute toy-like 3D style, big head small body, clean background, no text, no watermark
```

### 16. ESFP 表演者

角色设计：

```text
舞台型开心果，亮色服装，手持麦克风、彩带或聚光灯。
```

Prompt：

```text
3D chibi character, ESFP entertainer personality theme, joyful little performer, bright colorful outfit, holding a microphone and party ribbons, sparkling spotlight aura, big happy smile, cute toy-like 3D style, big head small body, clean pastel background, no text, no watermark
```

---

## 十四、星座 + MBTI 组合展示

### 1. 功能目标

当用户同时选择了星座和 MBTI 后，可以展示一个组合预览区。

标题示例：

```text
你的星心形象：
白羊座 × INFP
```

展示内容：

1. 星座形象卡
2. MBTI 形象卡
3. 组合关键词
4. 推荐昵称
5. 幸运号码入口

### 2. 组合关键词逻辑

组合关键词由以下数据合并：

```text
星座 keywords + MBTI keywords + luckyKeywords
```

去重后展示前 6 到 10 个。

### 3. 组合展示示例

```text
白羊座 × INFP

关键词：
热情、理想主义、行动力、温柔、梦境、火光

推荐昵称：
火光调停者
白羊梦旅人
晨星INFP
```

### 4. 组合组件

推荐组件：

```text
src/components/Starheart/StarheartComboPreview.tsx
```

Props：

```ts
type StarheartComboPreviewProps = {
  zodiac?: ZodiacProfile;
  mbti?: MBTIProfile;
};
```

---

## 十五、昵称生成器

### 1. 功能目标

用户选择：

- 星座
- MBTI 类型
- 昵称风格
- 生成数量

系统生成若干个适合用户的昵称。

### 2. 昵称风格

内置风格：

```text
梦幻系
冷淡系
元气系
神秘系
高级感
可爱系
赛博系
古风系
二次元系
英文系
```

### 3. 昵称生成逻辑

昵称由多个词库组合生成。

数据来源：

- 星座关键词
- MBTI 关键词
- 昵称风格词库
- 前缀词库
- 核心词库
- 后缀词库
- 装饰符号

### 4. 词库示例

```ts
const prefixWords = ["星", "月", "云", "夜", "森", "岚", "光", "雾"];
const coreWords = ["旅人", "信使", "收藏家", "观察者", "梦游者", "拾光者"];
const suffixWords = ["Heart", "Star", "Echo", "Moon", "Nova", "Soul"];
```

### 5. 昵称示例

```text
星河调停者
月雾INFP
白羊小火星
INTJ观星者
天蝎夜行者
Nova狮子心
```

### 6. 输入类型

```ts
export type NicknameInput = {
  zodiacId: string;
  mbtiType: string;
  style: string;
  count: number;
};
```

### 7. 输出类型

```ts
export type NicknameResult = {
  value: string;
  source: {
    zodiac: string;
    mbti: string;
    style: string;
  };
};
```

### 8. 功能要求

- 一次默认生成 10 个。
- 最多一次生成 50 个。
- 结果去重。
- 支持点击复制昵称。
- 支持重新生成。
- 支持清空结果。
- 昵称不能出现明显冒犯、低俗、政治敏感、歧视性词汇。

### 9. 核心函数

文件：

```text
src/lib/nickname.ts
```

导出：

```ts
export function generateNicknames(input: NicknameInput, count: number): NicknameResult[]
```

---

## 十六、幸运号码生成器

### 1. 功能目标

用户可以根据：

- 星座
- MBTI
- 时间种子
- 数字数量
- 数字范围
- 是否允许重复
- 是否排序
- 是否补零
- 模板配置

生成幸运号码。

### 2. 重要说明

幸运号码仅供娱乐，不预测任何彩票结果，也不保证中奖。

页面必须展示：

```text
幸运号码仅为随机娱乐结果，不预测任何彩票开奖结果，也不保证中奖。
```

### 3. 可复现伪随机

幸运号码不要使用单纯 `Math.random()`。

需要使用可复现伪随机算法。

也就是说，同样的：

```text
星座 + MBTI + 时间种子 + 模板配置
```

应该生成同样的号码。

### 4. 时间种子

默认时间种子格式：

```text
YYYYMMDDHHmmss
```

示例：

```text
20260625221530
```

用户也可以手动输入种子。

最终种子字符串：

```ts
const seedText = `${zodiacId}-${mbtiType}-${timeSeed}-${templateConfigHash}`;
```

### 5. 随机算法

文件：

```text
src/lib/random.ts
```

实现：

```ts
export function xmur3(str: string) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

export function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createSeededRandom(seedText: string) {
  const seed = xmur3(seedText)();
  return mulberry32(seed);
}
```

### 6. 幸运号码模板数据结构

```ts
export type LuckyNumberGroup = {
  id: string;
  label: string;
  count: number;
  min: number;
  max: number;
  unique: boolean;
  sort: "asc" | "desc" | "none";
  padLength: number;
};

export type LuckyNumberTemplate = {
  id: string;
  name: string;
  description: string;
  groups: LuckyNumberGroup[];
};
```

### 7. 生成结果类型

```ts
export type LuckyNumberResult = {
  templateId: string;
  templateName: string;
  seed: string;
  groups: {
    label: string;
    numbers: string[];
  }[];
  createdAt: string;
};
```

### 8. 默认模板：双色球

项目必须内置双色球模板。

```ts
export const doubleColorBallTemplate: LuckyNumberTemplate = {
  id: "double-color-ball",
  name: "双色球",
  description: "红球 6 个，范围 1-33，不重复；蓝球 1 个，范围 1-16。",
  groups: [
    {
      id: "red",
      label: "红球",
      count: 6,
      min: 1,
      max: 33,
      unique: true,
      sort: "asc",
      padLength: 2
    },
    {
      id: "blue",
      label: "蓝球",
      count: 1,
      min: 1,
      max: 16,
      unique: true,
      sort: "asc",
      padLength: 2
    }
  ]
};
```

展示示例：

```text
红球：03 08 12 19 24 31
蓝球：09
```

### 9. 自定义模板功能

用户可以在当前窗口内创建自定义模板。

字段：

- 模板名称
- 模板说明
- 分组数量
- 每组名称
- 每组数字个数
- 每组最小值
- 每组最大值
- 是否允许重复
- 是否升序排序
- 补零位数

示例：大乐透

```text
前区 5 个，1-35，不重复，升序，2 位补零
后区 2 个，1-12，不重复，升序，2 位补零
```

### 10. 模板保存规则

由于网站不要求登录、不保存数据：

- 用户创建的模板只保存在当前页面运行状态中。
- 页面关闭后自定义模板消失。
- 默认模板写死在代码中，每次打开都有。
- 不写入数据库。
- 默认不写入 localStorage。
- 后续可以增加“导出模板 JSON / 导入模板 JSON”功能。

### 11. 校验规则

生成前必须校验：

1. `count > 0`
2. `min <= max`
3. `padLength >= 0`
4. 如果 `unique = true`，则：

```ts
count <= max - min + 1
```

否则提示：

```text
当前配置要求数字不重复，但数量超过了范围容量，请调整数量或范围。
```

### 12. 核心函数

文件：

```text
src/lib/luckyNumber.ts
```

导出：

```ts
export function generateLuckyNumbers(input: {
  zodiacId: string;
  mbtiType: string;
  timeSeed: string;
  template: LuckyNumberTemplate;
}): LuckyNumberResult

export function validateLuckyTemplate(template: LuckyNumberTemplate): {
  valid: boolean;
  errors: string[];
}
```

---

## 十七、应用状态管理

不使用数据库，不做持久化。

建议状态类型：

```ts
export type AppState = {
  selectedZodiacId?: string;
  selectedMBTIType?: string;
  mbtiAnswers: Record<string, number>;
  mbtiResult?: MBTIResult;
  nicknameHistory: NicknameResult[];
  luckyTemplates: LuckyNumberTemplate[];
  luckyHistory: LuckyNumberResult[];
};
```

保存位置：

- React state
- Context
- useReducer
- 或 Zustand 非持久化 store

刷新页面后状态可以清空。

---

## 十八、页面详细说明

### 1. `/` 首页

页面内容：

- Starheart 星心 Logo 文案
- 大标题
- 副标题
- 5 个功能入口卡片
- 免责声明

首页功能卡片：

```text
免费 MBTI 测试
星座性格讲解
形象卡片宇宙
昵称生成器
幸运号码生成器
```

### 2. `/mbti` MBTI 测试页

页面内容：

- 标题：免费 MBTI 测试
- 简短说明
- 答题进度条
- 当前题目卡片
- 5 档选项按钮
- 上一题 / 下一题
- 完成测试按钮

结果展示：

- MBTI 类型，例如 `INFP`
- 中文名，例如 `调停者`
- 英文名，例如 `Mediator`
- AI 形象卡
- 四维分数条
- 性格摘要
- 优势
- 可能短板
- 关键词
- 适合昵称风格
- 跳转到昵称生成器

### 3. `/zodiac` 星座讲解页

页面内容：

- 星座选择器
- 12 星座入口卡片
- 选中后展示详细说明

展示字段：

- AI 形象卡
- 日期范围
- 元素
- 守护星
- 关键词
- 性格讲解
- 感情风格
- 工作风格
- 幸运色

### 4. `/cards` 卡片页

页面内容：

- 星座卡片区域
- MBTI 卡片区域
- 卡片网格
- 复制卡片文案按钮

### 5. `/nickname` 昵称生成器页

输入项：

- 星座
- MBTI 类型
- 昵称风格
- 生成数量

按钮：

```text
生成昵称
```

结果示例：

```text
星河调停者
白羊小火星
INTJ观星者
月雾旅人
Nova狮子心
```

功能：

- 点击复制
- 一键重新生成
- 清空结果
- 显示星座 + MBTI 小型组合预览

### 6. `/lucky` 幸运号码生成器页

输入项：

- 星座
- MBTI
- 时间种子
- 模板选择
- 自定义模板编辑
- 是否使用当前时间种子

默认模板：

- 双色球

结果展示：

```text
模板：双色球
种子：aries-INFP-20260625221530

红球：03 08 12 19 24 31
蓝球：09
```

功能：

- 重新生成
- 复制号码
- 复制种子
- 新增当前窗口模板
- 删除自定义模板
- 恢复默认模板
- 显示星座 + MBTI 小型组合预览

页面提示：

```text
幸运号码由星座、MBTI、时间种子和模板配置共同生成，仅供娱乐参考。
```

### 7. `/about` 关于星心

页面内容：

- Starheart 是什么
- 无登录、无数据库、隐私友好说明
- 娱乐性免责声明
- 图片素材说明
- 部署说明入口

---

## 十九、组件设计要求

### 1. 通用 Card 组件

应支持：

- title
- description
- children
- image
- hover 效果
- glassmorphism 样式

### 2. CopyButton 组件

功能：

- 点击复制文本
- 成功后显示“已复制”
- 1.5 秒后恢复

### 3. ZodiacCard 组件

Props：

```ts
type ZodiacCardProps = {
  profile: ZodiacProfile;
  onClick?: () => void;
  compact?: boolean;
};
```

### 4. MBTIProfileCard 组件

Props：

```ts
type MBTIProfileCardProps = {
  profile: MBTIProfile;
  compact?: boolean;
};
```

### 5. LuckyTemplateEditor 组件

功能：

- 新建模板
- 编辑分组
- 添加分组
- 删除分组
- 校验
- 保存到当前状态

---

## 二十、部署方案

### 1. 本地开发

```bash
pnpm install
pnpm dev
```

### 2. 构建

```bash
pnpm build
```

构建产物：

```text
dist/
```

### 3. VPS 目录

建议部署目录：

```text
/var/www/starheart
```

将 `dist` 目录内容上传到：

```text
/var/www/starheart
```

### 4. Nginx 配置

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/starheart;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss image/svg+xml;
}
```

### 5. HTTPS

可选使用 Certbot：

```bash
certbot --nginx -d your-domain.com
```

---

## 二十一、开发阶段划分

### 第一阶段：MVP

必须完成：

- 首页
- MBTI 测试
- MBTI 结果页
- 星座讲解
- 星座卡片
- MBTI 卡片
- 昵称生成器
- 幸运号码生成器
- 双色球默认模板
- 自定义模板当前窗口保存
- AI 图片路径支持
- 占位图 fallback
- VPS 静态部署

### 第二阶段：体验优化

可以增加：

- 星座卡片下载为图片
- MBTI 结果分享图
- 星座 + MBTI 组合图
- 深色 / 浅色主题切换
- 更多昵称风格
- 更多幸运号码默认模板
- 导入 / 导出模板 JSON

### 第三阶段：内容扩展

可以增加：

- MBTI + 星座组合解读
- 每日星心签
- 每日幸运关键词
- 情侣 MBTI / 星座匹配
- 社交媒体分享文案生成
- 192 种星座 + MBTI 组合卡

---

## 二十二、免责声明

页脚和相关页面都需要展示：

```text
星心 Starheart 提供的 MBTI、星座、昵称和幸运号码内容仅供娱乐和自我探索参考，不构成心理诊断、人生建议、职业建议或彩票购买建议。
```

幸运号码页面额外提示：

```text
幸运号码仅为随机娱乐结果，不预测任何彩票开奖结果，也不保证中奖。
```

MBTI 页面额外提示：

```text
MBTI 测试结果仅供娱乐和自我观察参考，不代表专业心理测评或医学诊断。
```

---

## 二十三、验收标准

开发完成后必须满足：

1. 首页可以正常进入所有功能。
2. MBTI 测试可以完整答题并生成结果。
3. MBTI 结果页展示对应 AI 形象图。
4. 星座讲解可以查看 12 星座。
5. 星座卡片可以展示并复制文案。
6. MBTI 卡片可以展示并复制文案。
7. 昵称生成器可以根据星座和 MBTI 生成不重复昵称。
8. 幸运号码生成器可以使用默认双色球模板。
9. 自定义幸运号码模板可以在当前页面状态中新增、使用和删除。
10. 页面刷新后用户临时数据允许丢失。
11. 不存在登录、注册、数据库连接逻辑。
12. 不存在后端 AI 绘图 API 调用。
13. 图片资源不存在时可以使用占位图。
14. `pnpm build` 可以成功生成 `dist`。
15. `dist` 可以通过 Nginx 静态部署。
16. 移动端页面无明显布局错乱。
17. 所有娱乐性内容都有免责声明。

---

## 二十四、给 Codex 的完整开发提示词

下面这段可以直接复制给 Codex / Cursor / Claude Code：

```text
请开发一个名为 Starheart / 星心 的 Web 应用。

技术栈要求：
- 使用 React + Vite + TypeScript
- 使用 Tailwind CSS
- 推荐使用 React Router
- 不接入数据库
- 不做登录注册
- 不做后台管理系统
- 所有用户数据只保存在当前页面运行状态中
- 默认模板写死在前端代码中
- 构建后可以通过 Nginx 静态托管部署到 VPS

项目定位：
Starheart / 星心 是一个结合 MBTI、星座、AI 形象卡片、昵称生成和幸运号码生成的轻量级娱乐工具站。

整体视觉：
- 深色星空背景
- 紫蓝渐变
- 玻璃拟态卡片
- 柔和光效
- 移动端适配
- AI 形象图为 3D Q版卡通人物，大头小身、玩偶质感、柔和灯光、干净背景

核心页面：
1. 首页 /
2. MBTI 测试 /mbti
3. MBTI 结果页 /mbti/result
4. 星座讲解 /zodiac
5. 星座与 MBTI 卡片 /cards
6. 昵称生成器 /nickname
7. 幸运号码生成器 /lucky
8. 关于页面 /about

功能要求：
1. 首页
   - 展示 Starheart 星心 品牌
   - 展示功能入口：MBTI 测试、星座讲解、星座卡片、昵称生成器、幸运号码生成器
   - 页面整体风格为深色星空、紫蓝渐变、玻璃拟态卡片

2. MBTI 免费测试
   - 内置 32 道 MBTI 题目
   - 每题 5 档选择：非常不同意、比较不同意、不确定、比较同意、非常同意
   - 根据 E/I、S/N、T/F、J/P 四组维度计算结果
   - 展示 16 种 MBTI 中的一种
   - 展示四维分数、类型说明、优势、短板、关键词
   - 展示对应 AI 形象卡
   - 结果仅保存在当前页面状态中

3. 星座性格讲解
   - 内置 12 星座数据
   - 每个星座包含中文名、英文名、日期范围、元素、守护星、关键词、性格摘要、感情风格、工作风格、幸运色、AI 图片路径
   - 用户可选择星座并查看详情

4. 星座卡片和 MBTI 卡片
   - 星座图片共 12 张，MBTI 图片共 16 张
   - 图片作为静态资源存放在 public/assets/cards/zodiac 和 public/assets/cards/mbti
   - 图片格式优先使用 webp
   - 图片推荐尺寸为 1024×1024
   - 前端展示时使用 lazy loading
   - 如果图片文件暂时不存在，请先使用统一占位图 /assets/cards/placeholder.webp
   - 卡片支持复制文案

5. 昵称生成器
   - 用户选择星座、MBTI、昵称风格、生成数量
   - 根据星座关键词、MBTI 关键词、风格词库组合生成昵称
   - 一次默认生成 10 个，最多 50 个
   - 结果去重
   - 支持复制昵称
   - 显示星座 + MBTI 小型组合预览

6. 幸运号码生成器
   - 用户选择星座、MBTI、时间种子、号码模板
   - 时间种子默认为当前时间 YYYYMMDDHHmmss，也允许用户手动输入
   - 使用可复现伪随机算法 xmur3 + mulberry32
   - 同样的 星座 + MBTI + 时间种子 + 模板配置 应生成同样结果
   - 支持自定义模板
   - 模板字段包括：模板名称、说明、分组、每组数字数量、最小值、最大值、是否不重复、是否排序、补零位数
   - 自定义模板只保存在当前页面运行状态中
   - 必须内置默认模板：双色球
     - 红球：6 个，1-33，不重复，升序，2 位补零
     - 蓝球：1 个，1-16，不重复，升序，2 位补零
   - 生成结果示例：
     红球：03 08 12 19 24 31
     蓝球：09
   - 显示星座 + MBTI 小型组合预览

7. AI 形象图要求
   - 第一版不接入 AI 绘图 API
   - 不在用户访问时实时生成图片
   - 图片离线生成后作为静态资源使用
   - 视觉风格为：3D Q版卡通人物、大头小身、玩偶质感、柔和灯光、轻微低多边形、干净背景
   - 不要写实真人脸
   - 不要恐怖、血腥、低俗、过度性感元素
   - 不要文字、水印、Logo
   - 不要明显模仿已有动漫或游戏角色

8. 组合预览
   - 当用户同时选择星座和 MBTI 后，展示“星座 × MBTI”的组合预览
   - 展示星座图、MBTI 图、组合关键词、推荐昵称入口、幸运号码入口

页面免责声明：
- 本网站内容仅供娱乐和自我探索参考，不构成心理诊断、人生建议、职业建议或彩票购买建议。
- 幸运号码仅为随机娱乐结果，不预测任何彩票开奖结果，也不保证中奖。
- MBTI 测试结果仅供娱乐和自我观察参考，不代表专业心理测评或医学诊断。

请完成：
- 完整项目结构
- 核心数据文件
- 核心类型定义
- 核心算法函数
- 页面组件
- Tailwind 样式
- 响应式布局
- 图片路径与占位图 fallback
- README 部署说明
- Nginx 静态部署说明
- pnpm build 可成功通过
```

---

## 二十五、最终建议

第一版 Starheart 最适合采用：

```text
纯前端 SPA + 静态部署 + 无数据库 + 无后端 + 离线 AI 图片资源
```

推荐工作流：

```text
1. 先让 Codex 完成项目代码结构和所有功能逻辑
2. 图片先使用 placeholder.webp 占位
3. 再用 ComfyUI 或其他 AI 绘图工具批量生成 28 张形象图
4. 将图片统一转为 webp
5. 按命名规则放入 public/assets/cards/
6. pnpm build
7. 上传 dist 到 VPS
8. 使用 Nginx 托管
```

这样项目维护成本最低，VPS 压力最小，也最符合开放访问、无登录、无持久化的设计目标。
