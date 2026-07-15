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
