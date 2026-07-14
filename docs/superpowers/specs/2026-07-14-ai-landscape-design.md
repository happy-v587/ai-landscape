# AI Landscape 首版设计

## 目标与范围

构建一个面向全球用户、可中英文切换的公开 AI 生态目录。它借鉴 CNCF Landscape 的数据驱动与社区贡献方式，但不复用其代码、视觉语言、分类体系或页面结构。

首版以静态站点形式部署在 Vercel。YAML 是唯一业务数据源；网站在构建期校验 YAML、生成索引和静态页面。首版不引入数据库、账号体系、后台管理或依赖第三方 API 的实时数据同步。

网站的目标是帮助访客发现、筛选和理解 AI 厂商、模型、基础设施、开发工具、应用与 SaaS 产品之间的关系。每项信息都必须有可追溯来源和核查日期。

## 内容模型与分类原则

网站不是一张塞满所有条目的总图，而是“四张地图 + 统一目录”。每张地图服务一个不同的认知任务，访客可切换地图或通过全局搜索跨地图发现条目：

1. **Models**：模型厂商、模型家族与模型版本。以厂商纵向泳道、发布日期横轴的时间线表达模型演进；同时呈现模态、能力、开源状态和重要性标识。
2. **Model Infra**：按模型生命周期呈现预训练、后训练、Serving、数据、评测与观测、算力及调度等能力区域。
3. **Agent & Tools**：呈现 Coding Agent、IDE、CLI、个人助手、Agent Framework、Runtime、记忆、协议、工具调用、观测、API Proxy 与开发沙箱。
4. **Apps & SaaS**：呈现桌面与移动应用、企业应用、内容创作、办公生产力、销售与客服、数据分析与垂直行业 SaaS。

每个条目只能有一个 `map` 和一个 `category`，由这两个字段决定主地图位置和展示类型。条目的其他能力通过标签、属性和关联条目表达，不能为同一条目在多个主分类重复创建卡片。

示例：DeepSeek 是模型厂商；DeepSeek-V3 是基础模型；其 API 服务可以是独立的推理服务或 SaaS 条目。三者通过关联字段互相链接。

## 用户体验与页面

首页首先让访客选择四张地图，而不是直接进入巨型 Logo 墙。页面视觉采用独立的地图导航、留白比例、栅格和卡片体系；不会复用 CNCF 或参考图的名称、Logo、颜色、装饰标签、边框或页面布局。我们只借鉴“按认知任务拆图”和“按生命周期或能力分区”的信息组织原则。

### 视觉系统约束

根目录的 `DESIGN.md` 是实现页面的视觉规范，优先级高于本节的描述。网站使用其中定义的 Apple 式画廊语言承载生态数据：黑色 44px 全局导航，羊皮纸色的 52px 二级导航，白色、羊皮纸色与近黑色全幅区块交替，内容区通过大留白而非装饰性组件分隔。

- 唯一交互强调色为 Action Blue `#0066cc`；链接、按钮、键盘焦点和选中筛选都使用该色。开源/闭源、模型能力、地图层级等信息不能依赖第二种品牌色传达。
- 标题使用 SF Pro Display / 系统回退字体，600 字重并带轻微负字距；正文使用 SF Pro Text / 系统回退字体，17px、400 字重。非 Apple 系统可退回 Inter。
- 地图入口是四个交替明暗的全幅产品式 tile，每个 tile 只呈现地图名、一句说明、一个预览和蓝色行动入口；不在首页堆叠所有 Logo。
- 地图详情页使用大面积留白或近黑画布，信息密度集中在地图区域。地图中的分区采用中性背景、细发丝线和文字层级；不复制参考图的粉蓝竖条、粉色分类签、粗黑框或其卡片比例。
- 禁止装饰性渐变；按钮、卡片与文字禁止阴影。唯一可用阴影只属于置于画布上的地图预览或产品式可视化渲染，且遵循 `DESIGN.md` 的单一 product shadow。
- 行动按钮与搜索框使用胶囊形；地图入口 tile 保持直角全幅，目录或筛选工具卡仅可使用 18px 圆角和发丝线。
- 所有可点击控件必须至少为 44 × 44px；地图在 834px 以下改为单列并提供可横向平移或按区块查看的替代视图。

不同地图有不同的主展示组件：

| 地图 | 主展示组件 | 核心信息 |
| --- | --- | --- |
| Models | 厂商泳道时间线 | 发布时间、模型家族、版本、开源状态、模态、能力与重要性 |
| Model Infra | 生命周期能力地图 | 所属阶段、子能力、部署方式、代码仓库与生态兼容性 |
| Agent & Tools | 产品与运行时能力地图 | 产品形态、目标用户、协议、运行时能力与集成生态 |
| Apps & SaaS | 使用场景目录地图 | 目标角色、业务场景、行业、平台、定价和部署方式 |

分类决定条目卡片应突出的信息：

| 条目类型 | 卡片重点 |
| --- | --- |
| 模型厂商 | 地区、代表模型、开源策略 |
| 基础模型 | 模态、参数规模、上下文、许可证、提供方 |
| 训练与推理 | 开源状态、部署方式、硬件或云支持、代码仓库 |
| 数据集与测评集 | 任务、语言、规模、指标、许可证 |
| IDE、CLI、桌面应用 | 目标用户、支持平台、定价、模型支持 |
| AI SaaS | 业务场景、面向角色、行业、部署和集成能力 |

首版路由如下：

- `/zh` 与 `/en`：四张地图入口、全局搜索和常用筛选。
- `/zh/maps/[mapId]` 与 `/en/maps/[mapId]`：某张地图的专属探索页。
- `/zh/explore` 与 `/en/explore`：目录浏览、组合筛选和排序。
- `/zh/item/[id]` 与 `/en/item/[id]`：条目详情、关联条目和信息来源。
- `/submit`：收录与纠错表单。

全站支持中英文切换。缺少某语言内容的条目不能通过数据校验；不采用只显示半套语言内容的降级方案。公共筛选包含地图、分类、开源状态、地区、模态、许可证、部署方式与面向用户；地图专属属性可在详情页筛选或展示。

## 数据目录与 YAML 规范

数据按分类定义和单条目文件拆分，以降低多人贡献时的 Git 冲突：

```text
data/
├─ categories.yaml
├─ filters.yaml
└─ items/
   └─ <id>.yaml
assets/logos/
```

`categories.yaml` 定义分类的 ID、所属地图、父层级、双语名称、排序和展示类型。`filters.yaml` 定义可用筛选值及其双语文案。每一个 `items/<id>.yaml` 文件只包含一个可公开展示的条目。

条目的统一字段如下：

```yaml
id: deepseek-v3
kind: foundation-model
map: models
category: foundation-models
name:
  en: DeepSeek-V3
  zh: DeepSeek-V3
summary:
  en: Open-weight mixture-of-experts language model.
  zh: 开放权重的混合专家语言模型。
logo: /logos/deepseek.svg
website: https://www.deepseek.com/
organization: deepseek
tags: [llm, text, open-weights, moe, china]
regions: [CN]
status: active
links:
  github: https://github.com/deepseek-ai/DeepSeek-V3
  paper: https://arxiv.org/abs/2412.19437
related: [deepseek, deepseek-r1]
facts:
  modalities: [text]
  license: MIT
  parameters: 671B
  context_window: 128K
timeline:
  released_at: 2024-12-26
  provider_lane: deepseek
  capabilities: [reasoning]
sources:
  - url: https://www.deepseek.com/
    checked_at: 2026-07-14
```

`facts` 是分类可扩展的属性对象；Schema 根据 `map`、`kind` 和 `category` 限定允许字段。`presentation` 由分类配置决定，可为 `provider-lane`、`timeline`、`lifecycle-map`、`capability-map` 或 `scenario-map`。模型厂商使用 `provider-lane`，作为时间线的泳道定义；模型版本使用 `timeline`，必须提供 `released_at`、`provider_lane` 和至少一个能力标签。其他地图不允许伪造时间线字段。每个来源必须有 URL 和 ISO 日期。Logo 使用项目本地托管的 SVG；贡献者必须确认其有权使用或该商标允许该用途，并在贡献指南中明确说明该要求。

## 构建、部署与贡献流程

技术栈为 Next.js 静态站点，部署目标为 Vercel。构建流程如下：

```text
YAML 与本地 SVG
      ↓
Schema、关联、翻译、URL 与资源路径校验
      ↓
生成浏览器使用的 JSON 搜索与筛选索引
      ↓
生成 Next.js 静态页面
      ↓
Vercel Preview 或 Production
```

浏览器不直接加载或解析 YAML，避免把校验、聚合和大文件加载成本交给访问者。搜索、排序和筛选使用预生成的 JSON 索引，在客户端完成；详情页在构建时生成。

贡献有两条入口：

1. 维护者或社区成员直接提交 YAML 与 Logo 的 GitHub Pull Request。
2. 网站表单将收录或纠错请求提交为结构化 GitHub Issue；Issue 包含建议的分类、双语名称、网站、来源、备注和联系信息。审核者核实后将其转换为 YAML Pull Request。

每个 Pull Request 都运行校验与构建，并由 Vercel 自动生成 Preview。合并到 `main` 后自动部署 Production。Schema 校验失败、重复 ID、未知分类、缺少双语字段、错误关联、无效 URL、缺失 Logo、缺少来源或不符合分类的 `facts` 字段都会阻断合并和部署。

## 质量、错误处理与非目标

测试覆盖以下层面：

- YAML Schema、分类约束、关联完整性和双语字段的单元测试。
- 对数据构建器的测试，确保稳定生成目录与搜索索引。
- 静态构建测试，确保每个条目都能生成对应的详情页。
- 浏览器端到端测试，覆盖语言切换、搜索、组合筛选和详情页关联跳转。

无效数据属于构建错误，必须在 Preview 阶段修复，不能发布为半可用网站。访问不存在的分类或条目时返回本地化的 404 页面；空筛选结果提供清除筛选的操作。网站会显示数据更新时间，但不承诺实时性。

首版明确不包含用户登录、在线 YAML 编辑器、自动抓取 GitHub/公司数据库、榜单实时排名、付费订阅、广告或人工审核后台。它们只有在内容规模与维护流程稳定后才单独设计。

## 验收标准

以下条件同时满足时，首版可发布：

1. Vercel 上可访问中英文首页、四张地图页、探索页、详情页和提交页。
2. Models 可按厂商泳道和发布时间呈现模型，Model Infra 可按生命周期分区，Agent & Tools 与 Apps & SaaS 各自呈现对应能力或场景分区。
3. 至少包含厂商、模型、训练或推理、数据或测评、IDE 或 CLI、桌面或应用、SaaS 各一类示例，并使用各自的展示类型。
4. YAML 是所有公开条目信息的唯一来源；修改 YAML 后能通过构建更新页面。
5. 任意条目只在一个主分类出现，但可通过标签、属性和关联被跨分类发现。
6. 无效 YAML、缺失翻译、无效关联、缺少来源或与展示类型不匹配的数据会使本地与 CI 校验失败。
7. 网站可搜索、筛选、查看来源，并可通过表单创建结构化 GitHub Issue。
8. 页面实现遵循根目录 `DESIGN.md`：只使用单一蓝色交互强调、无装饰渐变、无 UI 阴影，并以交替明暗的全幅地图入口 tile 组织首页。
