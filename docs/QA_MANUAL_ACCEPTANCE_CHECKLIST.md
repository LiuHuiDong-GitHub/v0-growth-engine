# GrowthEngine 手工验收清单（逐页点测版）

> 目标：让你像真实用户一样在前端逐页操作，快速确认 **无阻断 Bug**、**数据/权限正确**、**核心链路闭环**。

## 0. 准备

- 启动：`npm run dev`
- 测试账号：
  - 创作者：`creator@test.com`（验证码 `123456`）
  - 商家：`merchant@test.com`（验证码 `123456`）
  - 管理员：`admin@test.com`（验证码 `123456`）

---

## 1. 通用（所有角色）

- **登录**
  - 打开 `/auth/login` → 输入邮箱 → 下一步
  - 打开 `/auth/verify-email` → 输入 `123456`
  - 预期：成功进入对应角色主页（创作者→`/creator/products`；商家→`/products`；管理员可访问 `/admin`）

- **Header**
  - 右上角头像菜单可打开
  - 点击「留言」跳转 `/messages`
  - 点击「帮助中心」跳转 `/help`
  - 点击「退出登录」回到 `/auth/login`，再次进入受限页会被拦截

---

## 2. 创作者链路（浏览产品 → 投稿 → 去发布 → 提交视频 → 仪表盘）

1) 打开 `/creator/products`
   - 预期：列表有数据，点击任一卡片进入 `/products/[id]`

2) 在 `/products/[id]`
   - 点击「确定发布时间」的 `请选择`，弹出日历并可选日期
   - 点击「我要投稿」
   - 预期：跳转 `/promotions`

3) 在 `/promotions`
   - 预期：能看到列表，不出现「无权限访问」
   - 点击某条「去发布」跳转 `/creator/videos/new?projectId=...`

4) 在 `/creator/videos/new`
   - 填写至少 1 条视频链接（如 `https://www.youtube.com/watch?v=demo`）
   - 点击「提交视频」
   - 预期：跳转 `/creator/dashboard`

5) 在 `/creator/dashboard`
   - 预期：视频列表中出现「新提交视频」或新增项目；无报错弹窗；页面可完整渲染

---

## 3. 商家链路（发布产品 → 我的产品 → 推广详情）

1) 打开 `/products/upload`
   - 填写：产品名、简介、链接（需 `http(s)://` 或 `www.`）、描述文档、联系人信息
   - 勾选协议（若有）
   - 点击「发布」
   - 预期：成功后跳转 `/products`

2) 打开 `/products`
   - 预期：能看到「我的产品」列表，且 `status` 标签正常（matching/confirmed/published/observing/ended）
   - 点击任一产品卡片
   - 预期：进入 `/promotions/[productId]`，能看到推广详情（不报错）

---

## 4. 管理员链路（控制台统计 + 用户列表 + 慢查询）

1) 打开 `/admin`
   - 预期：统计卡片非 0（至少 users=3、products>0、promotions>0、videos>0）
   - 预期：最新用户列表可见

2) 可选：慢查询导出（接口）
   - `GET /api/v1/admin/slow-queries`
   - 预期：200；若无慢查询则 top 为空数组

---

## 5. 消息中心（文本 + 附件）

1) 打开 `/messages`
   - 预期：能加载历史消息

2) 发送纯文本消息
   - 输入框输入内容 → 发送
   - 预期：列表追加新消息

3) 发送带附件消息（可选）
   - 选择一个小文件（<10MB，如 png/pdf）→ 发送
   - 预期：消息带附件展示

---

## 6. 一键回归（建议每次改动后跑）

```bash
npm run test:smoke
npm run test:security
SLOW_QUERY_MS=120 BASE_URL="http://localhost:3001" npm run preflight
```

