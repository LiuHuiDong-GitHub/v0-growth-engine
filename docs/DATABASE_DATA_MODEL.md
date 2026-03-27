# GrowthEngine 数据库数据模型

> **文档性质**：为「当前已存在的业务功能」设计的最小且完整数据库结构；100% 支撑前端已实现功能与《前端数据契约 & 后端 API 接口规范》。  
> **约束**：所有表与字段均能在前端代码或数据契约中找到使用依据；不为未来功能提前设计；不冗余存储可计算字段；不引入未使用的业务概念。

---

## 一、核心实体总览

### 1.1 表清单与业务含义

| 表名                  | 业务含义                          | 前端使用场景                                                                         |
| --------------------- | --------------------------------- | ------------------------------------------------------------------------------------ |
| `users`               | 用户账号（创作者/商家）           | 登录、Header 用户信息、设置弹窗；区分「我的产品」与「待推广产品」列表归属。          |
| `verification_codes`  | 邮箱/手机验证码（登录、忘记密码） | `/auth/login` 发码、`/auth/verify-email` 校验、忘记密码发码与重置。                  |
| `notifications`       | 用户站内通知                      | Header 铃铛下拉、未读角标。                                                          |
| `testimonials`        | 首页案例/评价（可选）             | `/`、`/home` 案例区轮播；卡片点击跳转 `/products/${id}`。                            |
| `products`            | 商家发布的产品                    | 创作者待推广列表、商家我的产品列表、产品详情、发布产品表单。                         |
| `product_documents`   | 产品资料（可下载文档）            | 产品详情页「资料」列表与下载；契约要求按产品+文档定位下载。                          |
| `promotions`          | 推广任务（商家侧「我的推广」）    | 我的推广列表（待发布/已发布）、推广任务详情；创作者「加入推广」即创建/关联推广任务。 |
| `promotion_videos`    | 推广任务下的视频                  | 推广任务详情「我的视频表现」、创作者仪表盘视频项目、提交视频页提交内容。             |
| `messages`            | 消息中心单条消息                  | `/messages` 列表展示与发送。                                                         |
| `message_attachments` | 消息附件                          | 消息列表与发送时展示/上传附件。                                                      |

### 1.2 表与表之间的关系

| 关系                                 | 说明                                                            |
| ------------------------------------ | --------------------------------------------------------------- |
| **users** ← notifications            | 一对多：一个用户有多条通知。                                    |
| **users** ← products                 | 一对多：一个用户（商家）可发布多个产品。                        |
| **users** ← promotions（creator_id） | 一对多：一个用户（创作者）可参与多个推广任务。                  |
| **users** ← messages                 | 一对多：一个用户可发送多条消息。                                |
| **products** ← product_documents     | 一对多：一个产品有多份可下载文档。                              |
| **products** ← promotions            | 一对多：一个产品可有多个推广任务（不同创作者/不同档期）。       |
| **promotions** ← promotion_videos    | 一对多：一个推广任务下有多条视频。                              |
| **messages** ← message_attachments   | 一对多：一条消息可有多个附件。                                  |
| **testimonials** → products          | 多对一（可选）：案例可关联产品 id，用于跳转 `/products/${id}`。 |

**【风险点】** 前端「我的产品」列表点击卡片跳转为 `href={/promotions/${product.id}}`，即 URL 中 `id` 为 **product_id**；推广任务详情接口若按 `id` 查询，需约定该 `id` 为 product_id 并按 product_id 查推广任务（取一条或列表）。本模型按「promotions.product_id 外键」设计，后端可按 product_id 查询 promotions。

---

## 二、表结构详细设计（逐表）

### 2.1 users

| 项目       | 说明                                                                                             |
| ---------- | ------------------------------------------------------------------------------------------------ |
| **表名**   | `users`                                                                                          |
| **表用途** | 存储用户账号；Header 展示 name/email/avatar；区分创作者与商家以决定待推广列表/我的产品列表归属。 |

| 字段名     | 类型                | 必填 | 主键/外键 | 前端使用依据                                                                                                   |
| ---------- | ------------------- | ---- | --------- | -------------------------------------------------------------------------------------------------------------- |
| id         | UUID 或 BIGINT 自增 | 是   | PK        | 所有关联表外键；API 当前用户。                                                                                 |
| name       | VARCHAR(255)        | 否   | —         | Header 与设置弹窗展示（契约 2.2.1）。                                                                          |
| email      | VARCHAR(255)        | 是   | 唯一      | 登录、注册、验证码、Header 展示；唯一登录标识。                                                                |
| avatar_url | VARCHAR(1024)       | 否   | —         | Header 头像（契约 2.2.1）。                                                                                    |
| role       | VARCHAR(32)         | 否   | —         | 选择角色后区分创作者/商家；契约与业务文档「博主/创作者」「投流者/开发者」。建议枚举：`creator` \| `merchant`。 |
| created_at | TIMESTAMP           | 是   | —         | 审计、排序。                                                                                                   |
| updated_at | TIMESTAMP           | 是   | —         | 审计。                                                                                                         |

- **索引建议**：`UNIQUE(email)`；按需 `INDEX(role)`。
- **说明**：密码由认证系统（如 Supabase Auth）管理时可不在此表存 `password_hash`；若自建邮箱密码登录，则增加 `password_hash VARCHAR(255)` 且必填由业务约定。

---

### 2.2 verification_codes

| 项目       | 说明                                        |
| ---------- | ------------------------------------------- |
| **表名**   | `verification_codes`                        |
| **表用途** | 存储登录/忘记密码验证码；校验后一次性失效。 |

| 字段名     | 类型         | 必填 | 主键/外键 | 前端使用依据                                    |
| ---------- | ------------ | ---- | --------- | ----------------------------------------------- |
| id         | BIGINT 自增  | 是   | PK        | —                                               |
| email      | VARCHAR(255) | 是   | —         | 契约 2.1.1、2.1.2：发送与验证均用 email。       |
| code       | VARCHAR(10)  | 是   | —         | 6 位数字验证码（契约 2.1.2）。                  |
| purpose    | VARCHAR(32)  | 否   | —         | 区分 `login` / `password_reset`（契约 2.1.4）。 |
| expires_at | TIMESTAMP    | 是   | —         | 校验时判断是否过期；前端有 42 秒重发倒计时。    |
| used_at    | TIMESTAMP    | 否   | —         | 一次性使用，用后标记。                          |
| created_at | TIMESTAMP    | 是   | —         | 审计。                                          |

- **索引建议**：`INDEX(email, purpose)`、`INDEX(expires_at)`（清理过期用）。
- **说明**：忘记密码支持手机号时，可增加 `phone VARCHAR(32)`、`country_code VARCHAR(8)`，与 email 二选一；当前契约以邮箱为主，手机为可选扩展，不强制加列。

---

### 2.3 notifications

| 项目       | 说明                                  |
| ---------- | ------------------------------------- |
| **表名**   | `notifications`                       |
| **表用途** | 站内通知；Header 铃铛列表与未读角标。 |

| 字段名     | 类型          | 必填 | 主键/外键     | 前端使用依据                                                       |
| ---------- | ------------- | ---- | ------------- | ------------------------------------------------------------------ |
| id         | BIGINT 自增   | 是   | PK            | 列表 key（契约 2.2.2）。                                           |
| user_id    | BIGINT / UUID | 是   | FK → users.id | 通知归属用户。                                                     |
| title      | VARCHAR(255)  | 是   | —             | 契约 2.2.2。                                                       |
| message    | TEXT          | 是   | —             | 契约 2.2.2。                                                       |
| unread     | BOOLEAN       | 是   | —             | 契约 2.2.2；未读角标与样式。                                       |
| created_at | TIMESTAMP     | 是   | —             | 排序与「time」展示（如「5分钟前」可由 API 根据 created_at 计算）。 |

- **索引建议**：`INDEX(user_id)`、`INDEX(user_id, unread)`。
- **说明**：契约中 `time` 为展示用字符串，由后端按 `created_at` 生成即可，不单独存字段。

---

### 2.4 testimonials

| 项目       | 说明                                              |
| ---------- | ------------------------------------------------- |
| **表名**   | `testimonials`                                    |
| **表用途** | 首页案例/评价；契约为可选接口，可继续用静态数据。 |

| 字段名      | 类型          | 必填 | 主键/外键        | 前端使用依据                                                 |
| ----------- | ------------- | ---- | ---------------- | ------------------------------------------------------------ |
| id          | BIGINT 自增   | 是   | PK               | 卡片 key；跳转 `/products/${testimonial.id}`（契约 2.3.1）。 |
| image       | VARCHAR(1024) | 否   | —                | 契约 2.3.1 卡片背景图。                                      |
| avatar      | VARCHAR(1024) | 否   | —                | 契约 2.3.1。                                                 |
| company     | VARCHAR(255)  | 否   | —                | 契约 2.3.1。                                                 |
| title       | VARCHAR(255)  | 否   | —                | 契约 2.3.1。                                                 |
| description | TEXT          | 否   | —                | 契约 2.3.1。                                                 |
| metrics     | JSONB         | 否   | —                | 契约 2.3.1：`[{ label, value, color }]`。                    |
| quote       | TEXT          | 否   | —                | 契约 2.3.1。                                                 |
| author      | VARCHAR(255)  | 否   | —                | 契约 2.3.1。                                                 |
| product_id  | BIGINT / UUID | 否   | FK → products.id | 可选；跳转 `/products/${id}` 时可与产品关联，便于后台配置。  |

- **索引建议**：按需 `INDEX(product_id)`。
- **说明**：若后端不提供该接口，可省略本表，前端继续用静态数据。

---

### 2.5 products

| 项目       | 说明                                                                             |
| ---------- | -------------------------------------------------------------------------------- |
| **表名**   | `products`                                                                       |
| **表用途** | 商家发布的产品；支撑创作者待推广列表、商家我的产品列表、产品详情、发布产品接口。 |

| 字段名                | 类型                | 必填 | 主键/外键     | 前端使用依据                                                                                 |
| --------------------- | ------------------- | ---- | ------------- | -------------------------------------------------------------------------------------------- |
| id                    | BIGINT 自增 或 UUID | 是   | PK            | 路由 `/products/[id]`、列表 key、加入推广 productId、跳转 `/promotions/${product.id}`。      |
| user_id               | BIGINT / UUID       | 是   | FK → users.id | 产品归属商家；「我的产品」列表筛选。                                                         |
| name                  | VARCHAR(255)        | 是   | —             | 契约 2.4、2.6、2.7、2.8；列表与详情标题。                                                    |
| description           | TEXT                | 否   | —             | 契约 2.4 短描述；列表 line-clamp-3。                                                         |
| full_description      | TEXT                | 否   | —             | 契约 2.4 长描述可折叠；发布产品 fullDescription。                                            |
| link                  | VARCHAR(1024)       | 否   | —             | 契约 2.4 产品链接；发布产品必填。                                                            |
| avatar_url            | VARCHAR(1024)       | 否   | —             | 契约 2.6、2.7、2.12.1 列表/详情 Logo（avatar、logoUrl）。                                    |
| contact_name          | VARCHAR(255)        | 是   | —             | 契约 2.4 contact.name；发布产品 contactName。                                                |
| contact_email         | VARCHAR(255)        | 是   | —             | 契约 2.4 contact.email；发布产品 contactEmail。                                              |
| contact_phone         | VARCHAR(64)         | 是   | —             | 契约 2.4 contact.phone；发布产品 contactPhone。                                              |
| contact_website       | VARCHAR(1024)       | 否   | —             | 契约 2.4 contact.website。                                                                   |
| category_type         | VARCHAR(128)        | 否   | —             | 契约 2.4 category.type。                                                                     |
| category_keywords     | JSONB               | 否   | —             | 契约 2.4 category.keywords；列表 tags 与 2.12.1 tags，存字符串数组。                         |
| demo_video_url        | VARCHAR(1024)       | 否   | —             | 契约 2.4 attachments.demoVideo。                                                             |
| screenshots           | JSONB               | 否   | —             | 契约 2.4 attachments.screenshots，URL 数组。                                                 |
| progress              | VARCHAR(64)         | 否   | —             | 契约 2.4 如「匹配中」；产品详情进度展示。                                                    |
| developer_deadline    | DATE                | 否   | —             | 契约 2.4 timeline.developerDeadline。                                                        |
| blogger_deadline      | DATE                | 否   | —             | 契约 2.4 timeline.bloggerDeadline。                                                          |
| pricing_type          | VARCHAR(64)         | 否   | —             | 契约 2.4 pricing.type。                                                                      |
| price                 | VARCHAR(128)        | 否   | —             | 契约 2.4 pricing.price。                                                                     |
| original_price        | VARCHAR(128)        | 否   | —             | 契约 2.4 pricing.originalPrice。                                                             |
| incentive_enabled     | BOOLEAN             | 否   | —             | 契约 2.4 incentive.enabled。                                                                 |
| base_reward           | INTEGER             | 否   | —             | 契约 2.4 incentive.baseReward；发布产品 baseReward。                                         |
| bonus_targets         | JSONB               | 否   | —             | 契约 2.4 incentive.bonusTargets `[{ views, bonus }]`；发布产品 bonusTargets。                |
| applicants            | INTEGER             | 否   | —             | 契约 2.4 stats.applicants。                                                                  |
| expected_reach        | VARCHAR(64)         | 否   | —             | 契约 2.4 stats.expectedReach。                                                               |
| target_audience       | VARCHAR(255)        | 否   | —             | 契约 2.4 stats.targetAudience。                                                              |
| status                | VARCHAR(32)         | 是   | —             | 契约 2.7 商家列表；枚举 `matching` \| `confirmed` \| `published` \| `observing` \| `ended`。 |
| expected_publish_date | DATE                | 否   | —             | 发布产品 expectedPublishDate（用户选择档期）。                                               |
| created_at            | TIMESTAMP           | 是   | —             | 审计、排序。                                                                                 |
| updated_at            | TIMESTAMP           | 是   | —             | 审计。                                                                                       |

- **索引建议**：`INDEX(user_id)`（我的产品）；`INDEX(status)`（待推广列表筛选可选）；`INDEX(created_at)`。
- **说明**：列表用 `avatar`/`logoUrl` 与详情用 `attachments` 等均来自本表或关联；`documents` 单独放在 `product_documents`。

---

### 2.6 product_documents

| 项目       | 说明                                          |
| ---------- | --------------------------------------------- |
| **表名**   | `product_documents`                           |
| **表用途** | 产品可下载资料；契约要求按产品+文档定位下载。 |

| 字段名     | 类型          | 必填 | 主键/外键        | 前端使用依据                                        |
| ---------- | ------------- | ---- | ---------------- | --------------------------------------------------- |
| id         | BIGINT 自增   | 是   | PK               | 下载接口可选 doc_id。                               |
| product_id | BIGINT / UUID | 是   | FK → products.id | 契约 2.4 documents；按产品+文档定位。               |
| name       | VARCHAR(255)  | 是   | —                | 契约 2.4 documents[].name；前端下载用 name 拼 URL。 |
| size       | VARCHAR(32)   | 否   | —                | 契约 2.4 documents[].size 如 "2.4 MB"。             |
| icon       | VARCHAR(32)   | 否   | —                | 契约 2.4 documents[].icon 展示用。                  |
| file_path  | VARCHAR(1024) | 否   | —                | 存储路径或对象存储 key，用于生成下载 URL。          |

- **索引建议**：`INDEX(product_id)`。
- **说明**：契约 2.14 下载需产品+文档定位；`file_path` 可由后端约定为相对路径或存储 URL。

---

### 2.7 promotions

| 项目       | 说明                                                                                                    |
| ---------- | ------------------------------------------------------------------------------------------------------- |
| **表名**   | `promotions`                                                                                            |
| **表用途** | 推广任务；支撑「我的推广」列表（待发布/已发布）、推广任务详情；创作者「加入推广」即创建或关联本表记录。 |

| 字段名                | 类型                | 必填 | 主键/外键        | 前端使用依据                                                                                                         |
| --------------------- | ------------------- | ---- | ---------------- | -------------------------------------------------------------------------------------------------------------------- |
| id                    | BIGINT 自增 或 UUID | 是   | PK               | 契约 2.9、2.10；列表 id、「去发布」projectId；详情 id。                                                              |
| product_id            | BIGINT / UUID       | 是   | FK → products.id | 契约 2.9、2.10；我的推广按商家产品筛选；详情 productName 可来自 product。                                            |
| creator_id            | BIGINT / UUID       | 否   | FK → users.id    | 承接任务的创作者；加入推广时写入当前用户。                                                                           |
| expected_publish_date | DATE                | 否   | —                | 契约 2.5 加入推广 selectedDate（YYYY-MM-DD）。                                                                       |
| title                 | VARCHAR(255)        | 是   | —                | 契约 2.9、2.10 列表与详情标题。                                                                                      |
| platform              | VARCHAR(64)         | 否   | —                | 契约 2.9、2.10 如 Youtube、TikTok。                                                                                  |
| status                | VARCHAR(32)         | 是   | —                | 契约 2.9 待发布/已发布；2.10 详情 progress/statusText 推导；前端强依赖枚举（如 pending \| submitted \| published）。 |
| description           | TEXT                | 否   | —                | 契约 2.9 列表描述。                                                                                                  |
| views                 | INTEGER             | 否   | —                | 契约 2.9 已发布 stats.views；2.10 可选。                                                                             |
| likes                 | INTEGER             | 否   | —                | 契约 2.9 stats.likes。                                                                                               |
| comments              | INTEGER             | 否   | —                | 契约 2.9 stats.comments。                                                                                            |
| saves                 | INTEGER             | 否   | —                | 契约 2.9 stats.saves。                                                                                               |
| shares                | INTEGER             | 否   | —                | 契约 2.9 stats.shares。                                                                                              |
| performance_level     | VARCHAR(32)         | 否   | —                | 契约 2.10 如「中」。                                                                                                 |
| created_at            | TIMESTAMP           | 是   | —                | 审计、排序。                                                                                                         |
| updated_at            | TIMESTAMP           | 是   | —                | 审计。                                                                                                               |

- **索引建议**：`INDEX(product_id)`（详情按 product_id 查）；`INDEX(creator_id)`（创作者仪表盘/提交视频）；`INDEX(status)`；`INDEX(product_id, status)`。
- **说明**：progress 由 status 推导则不存；契约 2.10 的 `progress` 可选，可由后端计算返回。

---

### 2.8 promotion_videos

| 项目       | 说明                                                                                     |
| ---------- | ---------------------------------------------------------------------------------------- |
| **表名**   | `promotion_videos`                                                                       |
| **表用途** | 推广任务下的视频；支撑推广任务详情「我的视频表现」、创作者仪表盘视频项目、提交视频接口。 |

| 字段名          | 类型          | 必填 | 主键/外键          | 前端使用依据                                                |
| --------------- | ------------- | ---- | ------------------ | ----------------------------------------------------------- |
| id              | BIGINT 自增   | 是   | PK                 | 契约 2.10、2.11 列表 key。                                  |
| promotion_id    | BIGINT / UUID | 是   | FK → promotions.id | 归属推广任务。                                              |
| title           | VARCHAR(255)  | 否   | —                  | 契约 2.10、2.11。                                           |
| platform        | VARCHAR(64)   | 否   | —                  | 契约 2.10。                                                 |
| thumbnail_url   | VARCHAR(1024) | 否   | —                  | 契约 2.10 thumbnail、2.11 thumbnail；2.12.2 coverImageUrl。 |
| video_link      | VARCHAR(1024) | 否   | —                  | 契约 2.11 videoLink、2.12.2 videoLink。                     |
| duration        | VARCHAR(32)   | 否   | —                  | 契约 2.11 如 "2:35"。                                       |
| progress        | INTEGER       | 否   | —                  | 契约 2.11 0–100。                                           |
| plays           | INTEGER       | 否   | —                  | 契约 2.11 metrics.plays（前端 parseInt 汇总）。             |
| likes           | INTEGER       | 否   | —                  | 契约 2.11 metrics.likes。                                   |
| shares          | INTEGER       | 否   | —                  | 契约 2.11 metrics.shares。                                  |
| comments        | INTEGER       | 否   | —                  | 契约 2.11 metrics.comments。                                |
| favorites       | INTEGER       | 否   | —                  | 契约 2.11 metrics.favorites。                               |
| engagement_rate | VARCHAR(32)   | 否   | —                  | 契约 2.10 stats.engagementRate 如 "5.3%"。                  |
| conversion_rate | VARCHAR(32)   | 否   | —                  | 契约 2.10 stats.conversionRate。                            |
| percentages     | JSONB         | 否   | —                  | 契约 2.11 metrics.percentages，长度为 5 的整数数组。        |
| created_at      | TIMESTAMP     | 是   | —                  | 审计、排序。                                                |
| updated_at      | TIMESTAMP     | 是   | —                  | 审计。                                                      |

- **索引建议**：`INDEX(promotion_id)`。
- **说明**：契约 2.10 的 views 可为字符串（如 "1.2M"），前端仅展示；存储可用整数，API 层格式化。本表用 plays 与契约 2.11 对齐；若 2.10 的 views 与 2.11 的 plays 同义，可只保留 plays，API 返回时映射为 views。

---

### 2.9 messages

| 项目       | 说明                               |
| ---------- | ---------------------------------- |
| **表名**   | `messages`                         |
| **表用途** | 消息中心单条消息；列表展示与发送。 |

| 字段名      | 类型          | 必填 | 主键/外键     | 前端使用依据                                      |
| ----------- | ------------- | ---- | ------------- | ------------------------------------------------- |
| id          | BIGINT 自增   | 是   | PK            | 契约 2.13 列表 key。                              |
| user_id     | BIGINT / UUID | 否   | FK → users.id | 发送者；type=user 时必填。                        |
| type        | VARCHAR(16)   | 是   | —             | 契约 2.13 `user` \| `admin`，区分左右与样式。     |
| avatar_url  | VARCHAR(1024) | 否   | —             | 契约 2.13 avatar。                                |
| sender_name | VARCHAR(255)  | 否   | —             | 契约 2.13 name（管理员名称）。                    |
| text        | TEXT          | 否   | —             | 契约 2.13 正文；发送接口 text。                   |
| created_at  | TIMESTAMP     | 是   | —             | 审计；契约 2.13 time 可由 API 格式化为「10:30」。 |

- **索引建议**：`INDEX(user_id)`（若按用户筛）；`INDEX(created_at)`（列表按时间）。
- **说明**：当前契约未要求「会话」概念，消息可为全局列表；若后续按会话查，可增加 `conversation_id` 等，此处不提前设计。

---

### 2.10 message_attachments

| 项目       | 说明                             |
| ---------- | -------------------------------- |
| **表名**   | `message_attachments`            |
| **表用途** | 消息附件；列表展示与发送时上传。 |

| 字段名     | 类型          | 必填 | 主键/外键        | 前端使用依据                     |
| ---------- | ------------- | ---- | ---------------- | -------------------------------- |
| id         | BIGINT 自增   | 是   | PK               | —                                |
| message_id | BIGINT / UUID | 是   | FK → messages.id | 归属消息。                       |
| name       | VARCHAR(255)  | 是   | —                | 契约 2.13 files[].name。         |
| size       | INTEGER       | 否   | —                | 契约 2.13 files[].size（字节）。 |
| type       | VARCHAR(128)  | 否   | —                | 契约 2.13 files[].type。         |
| file_url   | VARCHAR(1024) | 否   | —                | 存储 URL，用于展示/下载。        |

- **索引建议**：`INDEX(message_id)`。

---

## 三、关系与约束说明

### 3.1 逻辑外键一览

| 表                  | 外键字段     | 引用表.字段   | 说明                 |
| ------------------- | ------------ | ------------- | -------------------- |
| notifications       | user_id      | users.id      | 通知归属用户。       |
| products            | user_id      | users.id      | 产品归属商家。       |
| product_documents   | product_id   | products.id   | 文档归属产品。       |
| promotions          | product_id   | products.id   | 推广任务归属产品。   |
| promotions          | creator_id   | users.id      | 推广任务承接创作者。 |
| promotion_videos    | promotion_id | promotions.id | 视频归属推广任务。   |
| messages            | user_id      | users.id      | 消息发送者。         |
| message_attachments | message_id   | messages.id   | 附件归属消息。       |
| testimonials        | product_id   | products.id   | 可选，案例关联产品。 |

### 3.2 删除/更新约束建议

| 关系               | 建议                                      | 说明                                                                                 |
| ------------------ | ----------------------------------------- | ------------------------------------------------------------------------------------ |
| users 删除         | RESTRICT 或 SOFT DELETE                   | 若存在 products / promotions / messages / notifications 则禁止物理删除；或仅做软删。 |
| products 删除      | RESTRICT 对 promotions、product_documents | 有推广或文档时禁止删产品；或 CASCADE 删子表（需业务确认）。                          |
| promotions 删除    | CASCADE 对 promotion_videos               | 删推广任务时一并删其视频。                                                           |
| messages 删除      | CASCADE 对 message_attachments            | 删消息时一并删附件。                                                                 |
| verification_codes | 无需外键                                  | 按 email 使用，过期可定时物理删除。                                                  |

- **前端强依赖**：
  - **products.status**：必须为 `matching` \| `confirmed` \| `published` \| `observing` \| `ended` 之一。
  - **promotions.status**：需与前端 progress/statusText 约定枚举（如 `pending`、`submitted`、`published`）。
  - **promotions.views/likes/comments/saves/shares**：已发布项展示依赖这 5 个数字字段。
  - **promotion_videos**：创作者仪表盘依赖 plays/likes/shares/comments/favorites 及 percentages 长度 5。

### 3.3 未建表/未字段说明

- **reddit_data**：契约 2.10 标注为可选，当前前端未渲染，故不建表；若后续需要可单独加表并标注为扩展。
- **sessions / tokens**：登录态可由 Supabase Auth 或独立认证服务管理，本模型不包含 sessions 表；若自建 token，可增加 `user_sessions` 等表。
- **密码**：见 2.1 users 说明，是否存 `password_hash` 由认证方案决定。
- **忘记密码手机号**：契约支持 phone+country_code，表中未列；若后端实现手机验证码，可在 `verification_codes` 增加 phone、country_code 或在单独表存储。

---

## 四、风险点汇总

1. **推广任务详情 id 语义**：前端「我的产品」使用 `product.id` 跳转 `/promotions/[id]`，故该路由参数为 **product_id**。后端「获取推广任务详情」若按 path id 查询，需约定为按 product_id 查 promotions（取一条或主推广），或改为 query 如 `?productId=xxx`。
2. **promotion 与 product 数量关系**：当前设计为 product 1:N promotions（多创作者/多档期）。若业务约定「一个产品仅一个进行中推广」，需在应用层或唯一索引约束 (product_id, status) 等。
3. **创作者仪表盘数据源**：契约 2.11 为「创作者视频项目列表」；本模型用 `promotion_videos` + `promotions.creator_id = 当前用户` 支撑。若仪表盘与「推广任务下的视频」非同一数据源，需补充业务约定并可能新增表或视图。
4. **提交视频页 projectId**：契约 2.12 的 projectId 来自「去发布」链接，前端 mock 为 promotion id。若「去发布」实际传的是 product_id，则接口与表需按 product_id 查对应 promotion 再写 promotion_videos。
5. **testimonials.id 与 products.id**：首页案例点击跳转 `/products/${testimonial.id}`，若 testimonial.id 与 product.id 不一致，需在 testimonials 增加 product_id 并在跳转时用 product_id，或约定 testimonial.id 即 product_id。

---

**文档结束**。本结构可直接用于 Supabase / Prisma / 其它 ORM 建表与迁移；所有表与字段均可在《前端数据契约 & 后端 API 接口规范》与《业务需求与数据流说明》中找到使用依据。
