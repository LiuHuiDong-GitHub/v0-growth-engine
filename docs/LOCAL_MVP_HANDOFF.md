# GrowthEngine 本地MVP联调交接说明

本文档给 OpenClaw / 你本人用于完成本地联调收尾操作。

## 1. 本地环境准备

1. 复制环境变量：
   - `cp .env.example .env.local`
2. 修改 `.env.local`：
   - `MYSQL_HOST=localhost`
   - `MYSQL_PORT=3306`
   - `MYSQL_USER=root`
   - `MYSQL_PASSWORD=`（按你本机实际）
   - `MYSQL_DATABASE=growthengineData`
   - `JWT_SECRET=任意长随机字符串`
   - `AI_BASE_URL=https://api.scnet.cn/api/llm/v1`
   - `AI_MODEL=MiniMax-M2.5`
   - `AI_API_KEY=你的可用key`

## 2. 启动

```bash
npm install
npm run dev
```

说明：后端使用 Next.js Route Handlers + MySQL；首次请求会自动建表并自动初始化种子数据（含测试账号和20条级别业务数据）。

## 3. 测试账号（固定密码）

- 创作者：`creator@test.com` / `123456`
- 开发者：`merchant@test.com` / `123456`
- 管理员：`admin@test.com` / `123456`
- 验证码：固定 `123456`（仅本地MVP）

## 4. 联调路径建议（冒烟）

1. 登录：`/auth/login` → 输入测试账号邮箱 → `/auth/verify-email` 输入 `123456`
2. 创作者链路：
   - `/creator/products` 查看待推广列表（DB）
   - 进入 `/products/[id]`，选择日期，点击加入推广（写DB）
   - `/creator/videos/new?projectId=...` 提交视频（写DB）
   - `/creator/dashboard` 查看视频数据（DB）
3. 开发者链路：
   - `/products/upload` 发布产品（写DB）
   - `/products` 查看我的产品（DB）
   - `/promotions` 查看推广列表（DB）
4. 管理员链路：
   - `/admin` 查看平台统计和用户列表
5. 消息中心：
   - `/messages` 查看历史 + 发送消息（写DB）

## 5. 性能与安全自测命令

### 5.1 压测（需要登录cookie）

先在浏览器登录后复制 `ge_token` cookie，拼成：

`AUTH_COOKIE="ge_token=xxxx"`

执行：

```bash
TARGET_URL="http://localhost:3001/api/v1/products/for-creator" AUTH_COOKIE="ge_token=xxxx" npm run perf:smoke
```

### 5.2 安全检查（手动）

- 未登录直接访问：
  - `/api/v1/me`
  - `/api/v1/products`
  - `/api/v1/promotions`
  - 预期：401
- 角色越权：
  - 创作者访问 `/api/v1/admin/overview`
  - 预期：403
- 输入校验：
  - `POST /api/v1/products` 缺少 `name/link/fullDescription`
  - 预期：400

## 6. OpenClaw 需要做的人为动作

1. 填好 `.env.local` 里的真实 MySQL 密码和 AI key
2. 本地启动后完整走一遍三角色链路
3. 执行一次压测并记录结果
4. 若失败，把错误日志交给我二次修复

## 7. 你本人可能需要手动处理的点

1. MySQL 权限问题（root 无本地登录权限时）
2. 本机防火墙导致 3306 不可达
3. AI 上游服务不可达或 key 配额不足（会自动降级到本地兜底文案）
