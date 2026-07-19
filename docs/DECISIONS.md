# DECISIONS

记录本项目中的重要设计决策及其原因，供后续开发参考。

## 2026-07-15 首页改为 2×2 网格布局

- **决策**：首页直接嵌入四个地图，并以等大的 2×2 网格卡片展示。
- **原因**：用户希望一进入首页就能看到全部内容；纵向长列表首页价值低。
- **代价**：每个卡片内容超出时需独立滚动，模型时间轴在窄区域内显示不完整。

## 2026-07-15 卡片详情使用弹窗而非新页面

- **决策**：所有地图中的条目卡片点击后都在当前页打开弹窗展示详情。
- **原因**：减少页面跳转，保持浏览上下文；用户明确希望不打开新页面。
- **实现**：`ItemChip` 从 `Link` 改为 `button`，复用 `ItemModal`。

## 2026-07-15 提交按钮链接到 GitHub Issue 模板

- **决策**：导航栏「提交」按钮直接跳转到仓库的「添加产品」Issue 模板。
- **原因**：原有 `/submit` 路由不存在；Issue 表单更适合收集结构化产品信息。
- **模板**：`.github/ISSUE_TEMPLATE/add-product.yml`

## 2026-07-15 模型时间轴颜色自动循环分配

- **决策**：厂商按 A-Z 排序后，颜色从固定 palette 数组循环选取。
- **原因**：避免新增厂商时手动维护颜色；确保不同厂商可区分。

## 2026-07-15 模型时间轴加宽并压缩卡片

- **决策**：时间轴月份列最小宽度从 96px 提升到 130px，同时压缩卡片、行高和间距。
- **原因**：用户反馈时间轴太窄且数据量大时显得拥挤；需要在宽度和紧凑度之间取得平衡。
- **文件**：`components/maps/ModelsTimeline.tsx`、`components/maps/maps.module.css`

## 2026-07-15 Agent & Tools 数据补全

- **决策**：在 Agent & Tools 地图中新增框架、Coding Agent 和运行时/SDK 条目。
- **原因**：原地图内容稀疏，用户希望覆盖 LangChain、LlamaIndex、Coding CLI 等主流工具。
- **新增条目**：AutoGen、CrewAI、Dify、Flowise、Langflow、LlamaIndex、Mastra、n8n、PydanticAI、Semantic Kernel、Aider、Cline、Cody、Continue、Devin、GitHub Copilot、Kilo Code、OpenHands、Roo Code、OpenAI Codex CLI、Google ADK、Composio、MCP 等。

## 2026-07-15 应用与 SaaS 新增「聊天」分类

- **决策**：在 Apps & SaaS 地图下新增 `chat` 分类，并将主要 AI 助手/chat 产品归入其中。
- **原因**：各家都有 Chat 产品，原地图缺少这一类；用户明确要求添加。
- **新增条目**：ChatGPT、Claude、Gemini、Grok、Kimi 智能助手、豆包、文心一言、通义千问、讯飞星火、腾讯元宝、海螺 AI、智谱清言、Microsoft Copilot、Poe。

## 2026-07-15 模型基础设施数据补全

- **决策**：在模型基础设施地图中补充推理、训练、数据、评测可观测等类别的知名工具。
- **原因**：用户认为原数据太少，需要更全面地覆盖该领域。
- **新增条目**：Ollama、BentoML、TorchServe、TensorFlow Serving、DeepSpeed-MII、Fireworks AI、Together AI、Transformers、Nanotron、MaxText、XTuner、NVIDIA NeMo、Keras、PaddlePaddle、MindSpore、dbt、Dagster、Prefect、DVC、CVAT、Snorkel、LangSmith、Arize Phoenix、Evidently AI、HELM、XLA、Slurm 等。

## 2026-07-15 DeepSeek 与千问时间线补全

- **决策**：补充 DeepSeek 和 Qwen 系列模型的发布时间线条目。
- **原因**：用户反馈这两个厂商的模型数据不全，缺少 MoE、VL、Janus、Max、Omni 等版本。
- **新增条目**：DeepSeek-MoE、DeepSeek-Math、DeepSeek-VL、DeepSeek-VL2、DeepSeek-Janus、DeepSeek-Janus-Pro、DeepSeek-V2-Lite；Qwen1.5-MoE、Qwen2.5-Max、Qwen2.5-Turbo、Qwen2.5-Omni、Qwen3-Coder、Qwen3-VL、Qwen3.5-Max。

## 2026-07-15 使用 Vercel Analytics

- **决策**：引入 `@vercel/analytics` 并在根布局中插入 `<Analytics />`。
- **原因**：需要统计线上访问数据；Vercel 提供开箱即用的 Analytics 组件。

## 2026-07-15 建立知识沉淀机制

- **决策**：重要决策写入 `DECISIONS.md`，验证流程和踩坑记录写入 `RUNBOOK.md`，并在 `CLAUDE.md` 中引用。
- **原因**：避免把每次对话都塞进 `CLAUDE.md` 造成噪音；让长期可复用的知识结构化沉淀。

## 2026-07-15 Field Atlas UI 重构

- **决策**：采用 "Field Atlas" 视觉方向对全站 UI 进行重构。
- **原因**：原有界面偏 AI/SaaS 通用模板感（ pastel 药丸、Inter 全局、扁平细线卡片）；用户希望更有高级感、更不像普通 AI 生成界面。
- **方向**：把站点视为研究图鉴/展览手册，而非 Web 应用面板；用暖纸色画布、有个性的无衬线显示字体、降饱和颜料色，以及一条「坐标线」作为签名元素。
- **字体**：标题 `Bricolage Grotesque`、正文 `Inter`、元数据 `JetBrains Mono`，通过 `next/font/google` 加载。
- **签名元素**：`SectionCard` 顶部从分类标签向右延伸的 1px 坐标线，类似测量图注册线。
- **文件**：`app/globals.css`、`app/layout.tsx`、`DESIGN.md`、`components/site/GlobalNav.module.css`、`components/site/home.module.css`、`components/site/FullLandscape.tsx`、`components/maps/maps.module.css`、`components/maps/SectionCard.tsx`、`components/maps/ModelsTimeline.tsx`、`components/catalog/catalog.module.css`。

## 2026-07-15 CLAUDE.md 保持在仓库根目录

- **决策**：`CLAUDE.md` 放在仓库根目录，`DECISIONS.md` 和 `RUNBOOK.md` 放在 `docs/` 目录。
- **原因**：用户明确要求 `CLAUDE.md` 在根目录以便工具自动读取；决策/手册类文档统一放在 `docs/` 沉淀。
- **注意**：`AGENTS.md` 需同步指向 `./CLAUDE.md`。

## 2026-07-15 非模型地图改用图标展示

- **决策**：`model-infra`、`agent-tools`、`apps-saas` 三个地图的条目chip只展示图标（logo），不展示名称；图标优先从条目的 `logo` 字段读取，否则通过 Hunter Logo API (`https://logos.hunter.io/{domain}`) 根据 `website` 自动推导；无图标时回退到单色首字母 monogram。
- **原因**：用户希望非模型板块用图标展示，视觉更清爽；246 个条目手动搜索 logo 不现实，Hunter API 是免费的域名换 logo 服务，可自动覆盖大部分条目。
- **实现**：新增 `lib/catalog/logo.ts` 处理 logo URL 推导；`ItemChip` 新增 `mode="logo"` 支持纯图标展示；`CapabilityMap` 对非模型地图统一使用 `mode="logo"`；schema 中 `logo` 字段放宽为任意字符串（允许外部 URL）。
- **后续调整**：在 logo 下方增加 10px 小号名称标签，避免纯图标无法识别条目。
- **文件**：`lib/catalog/schema.ts`、`lib/catalog/logo.ts`、`components/maps/ItemChip.tsx`、`components/maps/CapabilityMap.tsx`、`components/maps/maps.module.css`、`tests/components/ItemChip.test.tsx`。

## 2026-07-15 弹窗使用 Portal 渲染到 body

- **决策**：条目详情弹窗通过 `createPortal` 直接挂载到 `document.body`，并锁定背景滚动。
- **原因**：弹窗原先随组件树渲染，在地图卡片等带 `overflow` 或层叠上下文的容器内可能被裁剪或定位异常；挂到 body 可确保它真正以整个屏幕/视口为中心，不被其他元素盖住。
- **文件**：`components/maps/ItemModal.tsx`。

## 2026-07-15 项目本地 Skill 目录

- **决策**：以 `.agents/skills/frontend-design/` 为唯一正本，`.claude/skills/frontend-design/` 和 `.codex/skills/frontend-design/` 用符号链接指向正本。
- **原因**：用户希望后续针对 AI Landscape 的 Field Atlas 方向持续迭代这个 skill，但不想同时维护两份内容；Claude Code 扫描 `.claude/skills/<name>/SKILL.md`，Codex 扫描 `.codex/skills/<name>/SKILL.md`，通过 symlink 可以只改正本就同步到两个工具，同时保留工具可识别的完整 SKILL.md 内容。
- **文件**：
  - 正本：`.agents/skills/frontend-design/SKILL.md`、`.agents/skills/frontend-design/LICENSE.txt`
  - 符号链接：`.claude/skills/frontend-design/SKILL.md`、`.claude/skills/frontend-design/LICENSE.txt`、`.codex/skills/frontend-design/SKILL.md`、`.codex/skills/frontend-design/LICENSE.txt`

## 2026-07-15 导航栏添加 GitHub 图标链接

- **决策**：在全局导航右上角添加 GitHub 图标，点击跳转到项目仓库主页。
- **原因**：方便访问者快速找到项目源码；用户明确要求放在网页右上角。
- **文件**：`components/site/GlobalNav.tsx`、`components/site/GlobalNav.module.css`。

## 2026-07-15 首页 2×2 地图卡片改为等高图版

- **决策**：桌面端把四个地图卡片固定为等高 2×2 网格，卡片主体内部滚动，底部加探索入口；移动端恢复单列自适应。
- **原因**：原 `grid-auto-rows: minmax(520px, auto)` 导致不同内容量的卡片高度不一致，有的很长、有的很窄，视觉上不舒服；等高图版更像统一尺寸的地图图版，也更有 Field Atlas 的图鉴感。
- **文件**：`components/site/home.module.css`、`components/site/FullLandscape.tsx`。

## 2026-07-15 首页改为 Atlas Index 引导卡片

- **决策**：移除首页嵌入的四个地图预览，改为四个大型引导卡片（Atlas Index Plates），每张卡片展示地图名称、一句话介绍、数据统计、关键洞察和探索入口，点击跳转到对应地图页。
- **原因**：用户认为嵌入地图的 2×2 框视觉上不舒服；希望首页更像目录/引导页，有数据总结、介绍说明，并带苹果风格的交互艺术感。
- **交互**：卡片进入有错落淡入动画；hover 时卡片上浮、边框变色、出现柔和阴影，其他卡片轻微变暗；按下时轻微缩放。
- **文件**：`components/site/FullLandscape.tsx`、`components/site/home.module.css`、`app/[locale]/page.tsx`、`tests/e2e/landscape.spec.ts`。

## 2026-07-15 首页改为纵向 Atlas Guide 列表

- **决策**：将首页的 2×2 卡片网格改为四个纵向排列的引导条目（Atlas Guides），每个条目包含索引编号、地图名称、一句话说明、数据统计、洞察句子和分析短评，点击跳转到对应地图页。
- **原因**：用户认为 2×2 卡片在内容量不同时视觉上仍不舒服，希望更像目录/引导页；纵向列表更像展览目录或年度索引，阅读节奏更稳定，也更容易展示数据总结和分析。
- **交互**：进入时有错落淡入动画；hover 时条目整体右移，左侧出现地图色竖线，其他条目变暗以聚焦当前项；按下时轻微回缩。保留了 Apple 风格的弹性缓动和克制动效。
- **文件**：`components/site/FullLandscape.tsx`、`components/site/home.module.css`、`tests/e2e/landscape.spec.ts`。

## 2026-07-15 为非模型条目添加显式 logo

- **决策**：为 `model-infra`、`agent-tools`、`apps-saas` 三个地图的全部条目添加显式 `logo:` 字段，优先使用 Simple Icons CDN、GitHub 组织头像或官方站点 logo，不再依赖 `logos.hunter.io` 自动推导。
- **原因**：原 hunter.io 回退不可靠，导致大量条目只显示首字母 Monogram；用户希望非模型地图以图标为主、名称为辅，需要可加载的真实 logo。
- **实现**：共更新 116 个 YAML 文件；Simple Icons 46 个、GitHub 头像 37 个、官方站点/press kit 33 个；避免错误匹配（如 Flowise≠wise、Grok≠ngrok、Mastra≠astra）。
- **文件**：`data/items/*.yaml`（116 个文件）。

## 2026-07-15 移除地图页左侧 rail

- **决策**：移除地图详情页左侧的彩色竖条 rail（`MapRail`），地图内容区占满整宽。
- **原因**：用户认为左侧竖条不好看；去掉后页面更干净，内容区更宽，阅读体验更开阔。
- **文件**：`components/maps/MapShell.tsx`、`components/maps/maps.module.css`、`app/globals.css`、`DESIGN.md`；删除 `components/maps/MapRail.tsx`。

## 2026-07-18 首页改为全目录密集 Logo 墙

- **决策**：首页从四个引导条目（Atlas Guides）改为 `LandscapeOverview`：把四张地图的全部分类按 CNCF Landscape 式密集网格直接编排在首页（非 iframe），单元格为直角（无圆角）、固定 80px 高、4px 间距；顶部保留精简标题栏与吸顶的彩色地图索引条。地图详情页的 `.itemLogo` 同步改为直角密集网格。
- **原因**：用户希望打开首页即可一览全局，图标像 CNCF Landscape 一样紧密排列、直角边框；引导页式首页需要多次点击才能看到条目。
- **实现**：新增 `components/site/LandscapeOverview.tsx`（服务端组件，按 categories.yaml 顺序分组、按名称排序）；`ItemChip` 增加 logo 加载失败回退 Monogram 与 `loading="lazy"`；`.subcategoryItems` 改为 `auto-fill` 网格。
- **文件**：`components/site/LandscapeOverview.tsx`、`components/site/LandscapeOverview.module.css`、`components/maps/ItemChip.tsx`、`components/maps/maps.module.css`、`app/[locale]/page.tsx`、`tests/components/LandscapeOverview.test.tsx`、`tests/components/ItemChip.test.tsx`、`tests/e2e/landscape.spec.ts`；删除 `components/site/FullLandscape.tsx`、`components/site/home.module.css`、`tests/components/HomeMapDirectory.test.tsx`。

### 2026-07-18 补充：分类盒子按内容定宽并排排列

- **决策**：首页同一地图内的分类盒子不再各占一行，而是按条目数分档定宽（2/4/6/8 列单元格宽或通栏），用 flex-wrap 紧密并排，行内允许右侧留白（与 CNCF Landscape 一致）；单元格最小宽 86px，盒子宽度按 86px 单元 + 4px 间距 + 内边距 + 边框精确计算，保证 auto-fill 网格落在整数列上；同时压缩标题栏、分区间距和盒子内边距。
- **原因**：用户反馈第一版"每个分类一行"太松散，希望像 CNCF Landscape 官网那样多个分类盒子排布在一起、更密。
- **排查记录**：改动后 e2e `homepage links to map pages` 失败，定位为 Next.js 客户端导航的 RSC fetch 被本机大量挂起的外网图片请求（github avatars 等）阻塞——属测试环境网络问题而非布局问题；修复方式是在 Playwright `beforeEach` 中拦截并 abort 所有非 localhost 请求，使 e2e 不再依赖外部 CDN（同时大幅提速）。注意不要在本机以挂起状态复用旧 `next start` 进程：重建 `.next` 后旧进程引用失效的 CSS chunk 会导致页面无样式。

### 2026-07-18 补充：首页改为 CNCF 式分层堆叠

- **决策**：首页改为分层堆叠布局——页面铺满全宽（去掉 1440px 限宽），层顺序自上而下为 Apps & SaaS → Agent & Tools → Model Infra → Models（模型作为地基在页面最底部）；每层左侧为竖排的层标签条（地图色方块 + 层名 + 条目数，点击进地图页），层内分类盒子同行列并排（flex-wrap）。Models 层只展示模型厂商（8 个），基础模型以虚线磁贴（"Foundation Models 122 entries →"）链接到模型地图页，通过 `homepageCategories` 白名单控制各层在首页展示哪些分类。移动端层标签条退化为横向层头，盒子通栏。
- **原因**：用户明确参考 CNCF Landscape 官网的分层结构：铺满全屏、从左到右、分层展示、细分分类并列；且首页不需要罗列全部 122 个基础模型。
- **文件**：`components/site/LandscapeOverview.tsx`、`components/site/LandscapeOverview.module.css`、`tests/components/LandscapeOverview.test.tsx`。

### 2026-07-18 补充：band 交替着色

- **决策**：`bandStrip` 与 `categoryLabel`（分类盒子标题栏，改为通栏色条）共享同一背景色 `--band-bg`；四个 band 按 `:nth-of-type(even/odd)` 在两种色调间交替（青绿 `#e6f5ee` / 钢蓝 `#e6f0f9`，取自 globals 的 pill 色系），自上而下为 绿/蓝/绿/蓝。
- **原因**：用户要求每个 band 用颜色标识、strip 与分类标题栏同色、全页两种颜色交替。
- **文件**：`components/site/LandscapeOverview.module.css`。

### 2026-07-18 补充：分类盒子弹性撑满行

- **决策**：分类盒子从固定宽度改为 `flex: 1 1 auto` + 分档 `min-width`（2/4/6/8 列单元格下限），同行盒子按比例吸收剩余空间、每行铺满；大分类（>24 条）仍独占一行；移动端重置 `min-width: 0` 防止溢出。
- **原因**：固定宽度导致 Training 这类通栏盒子上下行右侧留空，用户反馈布局不够紧凑。代价是不同盒子内单元格宽度略有差异（86–110px），换取零水平空档。
- **文件**：`components/site/LandscapeOverview.module.css`。

### 2026-07-18 补充：同层盒子按条目数比例分配宽度

- **决策**：废弃按条目数分档定宽（boxSize 2/4/6/8 列 + 通栏）的方案，改为同层所有分类盒子排在同一行、宽度按条目数比例分配（行内 `flex-grow = 条目数`，`flex-basis: 0`），保底 3 列宽（≤2 条保底 2 列）。Model Infra 层因此从三行（Inference 行 / Training 通栏行 / Data+Eval 行）变为四个盒子并列一行。
- **原因**：分档定宽里 ">24 条通栏" 的规则导致 Training 独占一行、上下留空；用户希望同层细分分类像 CNCF 参考图那样并列展示。
- **文件**：`components/site/LandscapeOverview.tsx`、`components/site/LandscapeOverview.module.css`。

### 2026-07-18 补充：移除地图索引条、修正竖排中文、导航全宽

- **决策**：移除首页 masthead 下方的地图索引条（rail），band 的 scroll-margin 相应改为只避让 64px 导航；`stripName` 去掉 `rotate(180deg)`，竖排文字改为自上而下阅读（中文保持字形正立、顺序正确，英文亦自上而下）；`GlobalNav` 的 `.inner` 去掉 1440px 限宽，导航栏铺满全屏，与首页全宽布局一致。
- **原因**：用户反馈索引条多余；竖排中文经 180° 旋转后字序颠倒、观感不适；导航限宽与全宽页面不协调。
- **文件**：`components/site/LandscapeOverview.tsx`、`components/site/LandscapeOverview.module.css`、`components/site/GlobalNav.module.css`。

### 2026-07-18 补充：移除首页 masthead

- **决策**：删除首页的 masthead（大标题、副标题、四项统计）及其样式与统计计算，页面从全宽导航直接进入分层墙；品牌名由 GlobalNav 的 "AI Landscape" 承担。band 双色交替的 `:nth-of-type` 奇偶规则相应对调，保持各 band 原有配色不变。
- **原因**：用户认为标题栏多余，希望打开页面即为全景墙。
- **文件**：`components/site/LandscapeOverview.tsx`、`components/site/LandscapeOverview.module.css`。

## 2026-07-18 模型时间线改为倒序（最新在左）

- **决策**：`/maps/models` 时间线的月份轴改为倒序——最新月份在最左、历史月份向右延伸，月内卡片也按日期倒序（最新在最上）；同时去掉末尾 +1 个月的未来空白列，最左列即当前月。
- **原因**：原顺序（旧→新）要求用户横向滚动到最后才能看到最新发布的模型；倒序后打开页面即可见最新动态。
- **文件**：`components/maps/ModelsTimeline.tsx`、`tests/components/ModelsTimeline.test.tsx`（新增月份倒序用例）。
