# AI Landscape

一份双语、静态生成的全球 AI 生态地图。

[English README](./README.md)

**在线站点：**[llm-landscape.vercel.app](https://llm-landscape.vercel.app)

## 这是什么？

AI Landscape 把快速变化的 AI 领域整理成四张可视化地图：

- **Models（模型）** — 模型厂商与基础模型发布 timeline。
- **Model Infra（模型基础设施）** — 推理、训练、数据、评测与可观测性工具。
- **Agent & Tools（Agent 与工具）** — Agent 框架、编程 Agent、运行时与 SDK。
- **Apps & SaaS（应用与 SaaS）** — 聊天应用、生产力工具、研究与知识产品。

站点基于 [Next.js](https://nextjs.org/) 构建并静态导出，所有地图、分类和条目页面都能快速加载，无需运行时数据库。

## 技术栈

- **框架：** Next.js 16 App Router + React 19 + TypeScript
- **样式：** CSS Modules + 位于 `app/globals.css` 的设计令牌系统
- **数据：** `data/` 下的 YAML 文件，构建时通过 Zod 校验
- **国际化：** 通过 `[locale]` 路由支持英文（`en`）和中文（`zh`）
- **分析：** Vercel Analytics
- **测试：** Vitest + jsdom，Playwright 端到端测试

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 类型检查
npm run check

# 运行单元测试
npm run test

# 运行端到端测试（需要先构建生产版本）
npm run build
npm run test:e2e
```

## 项目结构

```
app/              # Next.js App Router 页面
components/       # React 组件（站点导航、地图、目录）
data/             # YAML 数据：地图、分类与条目
lib/              # 目录加载、schema 校验、查询、国际化
tests/            # Vitest 与 Playwright 测试
```

## 贡献数据

目录条目存放在 `data/items/*.yaml`。如果你想添加或更新一个产品，请使用 `.github/ISSUE_TEMPLATE/add-product.yml` 中的 **Add product** 模板提交 issue。

## 许可证

本项目为私有项目，目前没有开放再分发许可。
