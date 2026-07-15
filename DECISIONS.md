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
