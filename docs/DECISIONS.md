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

## 2026-07-15 项目本地 Skill 目录

- **决策**：以 `.agents/skills/frontend-design/` 为唯一正本，`.claude/skills/frontend-design/` 和 `.codex/skills/frontend-design/` 保存复制件；每个复制件顶部用注释写明正本相对路径，并提供 `npm run sync-skills` 脚本自动同步。
- **原因**：用户希望后续针对 AI Landscape 的 Field Atlas 方向持续迭代这个 skill，但不想同时维护两份内容；Claude Code 扫描 `.claude/skills/<name>/SKILL.md`，Codex 扫描 `.codex/skills/<name>/SKILL.md`，通过「正本 + 同步脚本」可以只改一处就同步到两个工具，同时文件内部保留对正本的引用说明。
- **文件**：
  - 正本：`.agents/skills/frontend-design/SKILL.md`、`.agents/skills/frontend-design/LICENSE.txt`
  - 复制件：`.claude/skills/frontend-design/SKILL.md`、`.codex/skills/frontend-design/SKILL.md`
  - 同步脚本：`scripts/sync-skills.js`
