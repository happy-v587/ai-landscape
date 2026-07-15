# RUNBOOK

本项目的验证流程、常见踩坑记录和可复用模式。

## 验证流程

每次代码变更后运行：

```bash
npm test && npm run build && npm run test:e2e
```

## 常见踩坑

### `next-env.d.ts` 被意外修改

Next.js 构建后可能会修改 `next-env.d.ts`。提交前应恢复：

```bash
git checkout HEAD -- next-env.d.ts
```

### Vercel 本地验证时看到的是旧服务

如果 `npm run start` 因端口 3000 被占用而失败，浏览器可能仍在访问旧进程。解决：

```bash
kill $(lsof -t -i:3000)
npm run start
```

### 模型时间轴截图只显示旧月份

时间轴默认从最左侧（最早月份）开始展示，近期模型在右侧，需要横向滚动或调大视口才能看到。

## 复用模式

### 新增一个数据条目

1. 用 `Write` 创建 `data/items/<id>.yaml`
2. 保持 schema 一致：`id`、`kind`、`map`、`category`、`name`、`summary`、`website`、`tags`、`regions`、`status`、`related`、`facts`、`sources`
3. 运行 `npm test` 验证 schema

### 新增一个地图分类

1. 在 `data/categories.yaml` 中添加分类，指定 `map` 和 `presentation`
2. 在条目 YAML 中设置对应的 `category`（和 `subcategory`）
3. 重新构建以生成静态页面

### 新增模型时间轴条目

1. 创建 `data/items/<id>.yaml`
2. 设置 `timeline.released_at`（ISO 日期）、`timeline.provider_lane`（厂商标识，用于排序和颜色）、`timeline.capabilities`
3. 模型地图按 `provider_lane` A-Z 排序，颜色从 `lanePalette` 循环分配

### 新增 Agent / 模型基础设施条目

- Agent 框架：`category: agent-frameworks`，`map: agent-tools`
- Coding Agent：`category: coding-agents`，`map: agent-tools`
- Agent 运行时：`category: agent-runtimes`，`map: agent-tools`
- 模型基础设施：参考 `data/categories.yaml` 中已有的 `category` 和条目里的 `subcategory`

### 部署到 Vercel

```bash
git push origin main
npx vercel --prod --yes
```

首次部署需要登录 Vercel CLI。部署后 Vercel 会自动关联 GitHub 仓库，后续 push 到 `main` 会自动重新部署。

### 用 Playwright 截图验证

```bash
npm run start
npx playwright screenshot --viewport-size=1600,1200 http://localhost:3000/zh /tmp/screenshot.png
```

如果截图看起来是旧样式，先检查端口 3000 是否被旧进程占用。

### 提交前检查清单

- `npm test` 通过
- `npm run build` 通过
- `npm run test:e2e` 通过
- `next-env.d.ts` 未被意外修改
- 没有未跟踪的临时文件
- 知识文档已按规则更新（大/小任务均需记录）

### 大型 UI 重构的工作流程

1. 先用 Superpower/PlanMode 输出设计计划，明确方向、配色、字体、签名元素。
2. 更新 `DESIGN.md` 作为新的视觉系统单一事实来源；**任何视觉改动都应先改 DESIGN.md，再改代码**。
3. 先改 `globals.css` 和 `app/layout.tsx`（字体），再逐个组件替换样式。
4. 每次改完后跑完整验证：`npm test && npm run build && npm run test:e2e`。
5. 提交前检查 `git status`，警惕 `next-env.d.ts` 或文档文件被意外移动。
6. 若 DESIGN.md 和代码实现出现偏差，以 DESIGN.md 为准并同步修正代码；避免让旧描述持续存在。

### 知识沉淀补录

如果对话中忘记即时记录，应在任务结束后补录：

- 决策和原因 → `docs/DECISIONS.md`
- 验证流程、踩坑、可复用模式 → `docs/RUNBOOK.md`
- 保持 `CLAUDE.md` 简洁，只放索引规则和引用
