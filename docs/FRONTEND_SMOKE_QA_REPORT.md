# 前端冒烟与意图反推（持续更新）

> 说明：本文件记录「模拟真实用户」走查后的缺陷、已修复项与仍属占位/未开发能力，便于与 `docs/QA_MANUAL_ACCEPTANCE_CHECKLIST.md` 对照。

## 一、本轮已修复（代码已落地）

| 问题 | 处理 |
|------|------|
| 首页 `isLoggedIn` 恒为 `false`，已登录用户仍被送去登录页 | 挂载时请求 `/api/v1/me`，按 `role` 分流 |
| 「上传产品」「推广产品」共用同一逻辑，与业务不符 | 上传：商家/管理员→`/products/upload`，创作者→`/creator/products`；推广：创作者→`/creator/products`，商家→`/promotions`，管理员→`/admin` |
| 服务区块「查看详情」无交互 | 跳转帮助中心锚点 `#getting-started` / `#blogger-verification` |
| 页脚大量 `href="#"`、空 `<li>`、版权年份过期 | 改为站内 `Link`（功能案例、帮助、留言等），版权 2026 |
| 登录/注册页 Google 等按钮无实现却可点（误导） | 禁用并 `title="即将支持"`，登录页增加说明文案 |
| 自媒体卡片下文案明显乱码 | 替换为可读中文说明 |

## 二、仍属未完善 / 未开发（接受范围或后续迭代）

| 项 | 说明 |
|----|------|
| 第三方 OAuth（Google/Apple/微信等） | 无后端与回调配置，当前明确禁用 |
| 手机号登录 / 忘记密码手机分支 | 后端返回 501，仅邮箱链路可用 |
| 首页「展示案例」视频条 | 仍为静态展示，未接真实播放或数据 |
| 页脚社交媒体外链 | 仍为 `#`，无官方账号 URL 时不强链 |
| 历史重复路由（如 `/blogger-dashboard`、`/upload-product` 等） | 与 `/auth/*`、`/creator/*` 并存，建议逐步重定向或下线 |
| 设置弹窗（`HomeHeader` + `settings-context`）内账单/2FA 等 | 大量为 UI 占位，未接支付与真实会话管理 |
| 博主认证页 | 提交仍为前端模拟延时，未持久化审核状态到 DB |

## 三、建议回归命令

```bash
npm run test:smoke && npm run test:security && npm run test:e2e:merchant
npm run build
```

## 四、与设计意图的对照（简）

- **闭环 A（商家）**：登录 → 发布产品 → 我的产品 → 推广详情 —— 主路径已在 API + 页面联调；首页 CTA 已与角色对齐。
- **闭环 B（创作者）**：登录 → 浏览产品 → 申请推广 → 提交视频 → 仪表盘 —— 以 `QA_MANUAL_ACCEPTANCE_CHECKLIST` 为准逐页点测。
- **闭环 C（管理员）**：`/admin` + 慢查询等接口 —— 以后台数据为准。
