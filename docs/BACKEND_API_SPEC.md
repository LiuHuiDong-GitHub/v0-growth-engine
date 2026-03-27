# GrowthEngine 后端 API 接口文档

> **文档性质**：可直接被实现的前端强依赖后端接口合同；严格围绕前端真实使用方式、数据库结构与业务流程设计。  
> **约束**：所有接口可映射到数据库操作或业务流程；请求/返回字段均在前端有明确使用点；不返回未使用字段；不设计「以后可能用」的能力。

**基础约定**

- **Base URL**：`/api/v1`（或由部署环境配置）。
- **鉴权**：需登录的接口通过 `Authorization: Bearer <token>` 传递；token 由「验证邮箱验证码」或「注册」接口返回。
- **Content-Type**：请求体 `application/json`；文件上传为 `multipart/form-data`（见具体接口）。
- **响应**：成功为 `2xx` + 约定 JSON；业务错误为 `4xx` + `{ success: false, code: string, message: string }`；前端需感知的错误见各接口「错误场景」。

---

## 一、接口总览

### 1.1 接口分组与职责

| 分组               | 职责                                                                                             | 接口数量 |
| ------------------ | ------------------------------------------------------------------------------------------------ | -------- |
| **认证**           | 发送验证码、验证邮箱、注册、忘记密码（发码/重置）                                                | 5        |
| **当前用户与通知** | 获取当前用户、获取通知列表                                                                       | 2        |
| **首页案例**       | 获取首页案例列表（可选）                                                                         | 1        |
| **产品**           | 待推广产品列表（创作者）、我的产品列表（商家）、产品详情、发布产品、产品下推广详情、产品文档下载 | 6        |
| **推广**           | 加入推广、我的推广列表、推广任务详情（按产品）、提交视频页简要、提交视频                         | 5        |
| **创作者视频**     | 创作者视频项目列表（仪表盘）                                                                     | 1        |
| **消息**           | 消息列表、发送消息                                                                               | 2        |

### 1.2 路径与数据库/业务映射

- **认证**：无鉴权；写 `verification_codes`，读/写 `users`。
- **当前用户 / 通知**：鉴权；读 `users`、`notifications`。
- **首页案例**：读 `testimonials`（可选）。
- **产品**：待推广产品列表 = 读 `products`（筛选对创作者开放）；我的产品列表 = 读 `products` WHERE user_id = 当前用户；产品详情 = 读 `products` + `product_documents`；发布产品 = 写 `products` + `product_documents`；产品下推广详情 = 读 `promotions` WHERE product_id + `promotion_videos`；文档下载 = 读 `product_documents` 返回文件。
- **推广**：加入推广 = 写 `promotions`（product_id, creator_id, expected_publish_date, status）；我的推广列表 = 读 `promotions` JOIN products WHERE products.user_id = 当前用户；推广任务详情（按产品）= 读 `promotions` WHERE product_id 取一条 + `promotion_videos`；提交视频页简要 = 读 `promotions` + `products`（projectId = promotion_id）；提交视频 = 写 `promotion_videos`。
- **创作者视频**：读 `promotion_videos` JOIN promotions WHERE promotions.creator_id = 当前用户。
- **消息**：读 `messages` + `message_attachments`；写 `messages` + `message_attachments`。

**【歧义说明】** 前端「我的产品」列表点击卡片跳转 `href={/promotions/${product.id}}`，即路由参数为 **product_id**；「去发布」链接为 `projectId=${project.id}`，即 **promotion_id**。故约定：**推广任务详情** 按 product_id 查询（GET 产品下推广详情）；**提交视频页** 的 projectId 为 promotion_id。

---

## 二、接口详细定义（逐条）

---

### 2.1 认证

#### 2.1.1 发送登录验证码

| 项目          | 说明                                                                              |
| ------------- | --------------------------------------------------------------------------------- |
| **接口名称**  | 发送登录验证码                                                                    |
| **用途**      | `/auth/login` 用户输入邮箱并提交；成功后前端跳转 `/auth/verify-email?email=xxx`。 |
| **HTTP 方法** | POST                                                                              |
| **请求路径**  | `/api/v1/auth/send-login-code`                                                    |
| **鉴权**      | 否                                                                                |

**请求参数（Body JSON）**

| 字段名 | 类型   | 必填 | 与数据库对应                     | 前端使用                                       |
| ------ | ------ | ---- | -------------------------------- | ---------------------------------------------- |
| email  | string | 是   | verification_codes.email（写入） | 用户输入；验证码页从 URL 取 email 展示与重发。 |

**返回结构**

| 字段名  | 类型    | 数据来源 | 前端依赖                 |
| ------- | ------- | -------- | ------------------------ |
| success | boolean | 固定     | 为 true 时跳转验证码页。 |
| message | string  | 可选     | 失败时展示。             |

**错误场景**

| 场景         | HTTP | 前端是否需感知 | 说明                               |
| ------------ | ---- | -------------- | ---------------------------------- |
| 邮箱格式错误 | 400  | 是             | 返回 message，前端可展示。         |
| 发送频率限制 | 429  | 是             | 返回 message（如「请稍后再试」）。 |
| 后端发送失败 | 500  | 是             | 返回 message。                     |

---

#### 2.1.2 验证邮箱验证码（登录确认）

| 项目          | 说明                                                                          |
| ------------- | ----------------------------------------------------------------------------- |
| **接口名称**  | 验证邮箱验证码                                                                |
| **用途**      | `/auth/verify-email` 用户输入 6 位验证码后调用；成功则前端跳转 `/auth/role`。 |
| **HTTP 方法** | POST                                                                          |
| **请求路径**  | `/api/v1/auth/verify-email`                                                   |
| **鉴权**      | 否                                                                            |

**请求参数（Body JSON）**

| 字段名 | 类型   | 必填 | 与数据库对应                                  | 前端使用                        |
| ------ | ------ | ---- | --------------------------------------------- | ------------------------------- |
| email  | string | 是   | verification_codes.email（校验）              | URL searchParams.get("email")。 |
| code   | string | 是   | verification_codes.code（校验后标记 used_at） | 6 位数字拼接字符串。            |

**返回结构**

| 字段名  | 类型    | 数据来源           | 前端依赖                              |
| ------- | ------- | ------------------ | ------------------------------------- |
| success | boolean | 固定               | 为 true 时跳转角色页。                |
| token   | string  | 生成或 sessions 表 | 前端存储后置于 Authorization Header。 |
| message | string  | 可选               | 失败时展示。                          |

**错误场景**

| 场景                   | HTTP | 前端是否需感知 | 说明                           |
| ---------------------- | ---- | -------------- | ------------------------------ |
| 验证码错误/过期/已使用 | 400  | 是             | 返回 message。                 |
| 用户不存在需先注册     | 400  | 可选           | 返回 message，前端可引导注册。 |

---

#### 2.1.3 用户注册

| 项目          | 说明                                                                     |
| ------------- | ------------------------------------------------------------------------ |
| **接口名称**  | 用户注册                                                                 |
| **用途**      | `/auth/register` 用户填写邮箱、密码后提交；成功则前端跳转 `/auth/role`。 |
| **HTTP 方法** | POST                                                                     |
| **请求路径**  | `/api/v1/auth/register`                                                  |
| **鉴权**      | 否                                                                       |

**请求参数（Body JSON）**

| 字段名   | 类型   | 必填 | 与数据库对应                      | 前端使用   |
| -------- | ------ | ---- | --------------------------------- | ---------- |
| email    | string | 是   | users.email                       | 用户输入。 |
| password | string | 是   | users.password_hash（写入前加密） | 用户输入。 |

**返回结构**

| 字段名  | 类型    | 数据来源        | 前端依赖               |
| ------- | ------- | --------------- | ---------------------- |
| success | boolean | 固定            | 为 true 时跳转角色页。 |
| token   | string  | 生成或 sessions | 前端存储。             |
| message | string  | 可选            | 失败时展示。           |

**错误场景**

| 场景         | HTTP | 前端是否需感知 | 说明           |
| ------------ | ---- | -------------- | -------------- |
| 邮箱已注册   | 400  | 是             | 返回 message。 |
| 参数校验失败 | 400  | 是             | 返回 message。 |

---

#### 2.1.4 忘记密码 - 发送验证码

| 项目          | 说明                                                             |
| ------------- | ---------------------------------------------------------------- |
| **接口名称**  | 忘记密码发送验证码                                               |
| **用途**      | `/auth/forgot-password` 用户选择手机或邮箱后点击「获取验证码」。 |
| **HTTP 方法** | POST                                                             |
| **请求路径**  | `/api/v1/auth/forgot-password/send-code`                         |
| **鉴权**      | 否                                                               |

**请求参数（Body JSON）**

| 字段名      | 类型   | 必填                | 与数据库对应                                | 前端使用             |
| ----------- | ------ | ------------------- | ------------------------------------------- | -------------------- |
| method      | string | 是                  | verification_codes.purpose = password_reset | "phone" \| "email"。 |
| phoneNumber | string | method=phone 时必填 | 可扩展 verification_codes.phone             | 用户输入。           |
| countryCode | string | 否                  | 可扩展                                      | 如 "+86"。           |
| email       | string | method=email 时必填 | verification_codes.email                    | 用户输入。           |

**返回结构**

| 字段名  | 类型    | 数据来源 | 前端依赖          |
| ------- | ------- | -------- | ----------------- |
| success | boolean | 固定     | 控制按钮/倒计时。 |
| message | string  | 可选     | 失败时展示。      |

**错误场景**：同 2.1.1（格式、限流、发送失败），前端需感知并展示 message。

---

#### 2.1.5 忘记密码 - 重置密码

| 项目          | 说明                                                             |
| ------------- | ---------------------------------------------------------------- |
| **接口名称**  | 忘记密码重置                                                     |
| **用途**      | `/auth/forgot-password` 用户填写验证码、新密码、确认密码后提交。 |
| **HTTP 方法** | POST                                                             |
| **请求路径**  | `/api/v1/auth/forgot-password/reset`                             |
| **鉴权**      | 否                                                               |

**请求参数（Body JSON）**

| 字段名           | 类型   | 必填            | 与数据库对应              | 前端使用                   |
| ---------------- | ------ | --------------- | ------------------------- | -------------------------- |
| method           | string | 是              | 校验 verification_codes   | "phone" \| "email"。       |
| phoneNumber      | string | method=phone 时 | 同上                      | 用户输入。                 |
| countryCode      | string | 否              | 同上                      | 同上。                     |
| email            | string | method=email 时 | 同上                      | 同上。                     |
| verificationCode | string | 是              | verification_codes.code   | 用户输入。                 |
| newPassword      | string | 是              | users.password_hash 更新  | 用户输入。                 |
| confirmPassword  | string | 是              | 仅校验与 newPassword 一致 | 前端已校验，后端可再校验。 |

**返回结构**

| 字段名  | 类型    | 数据来源 | 前端依赖           |
| ------- | ------- | -------- | ------------------ |
| success | boolean | 固定     | 成功可跳转登录页。 |
| message | string  | 可选     | 失败时展示。       |

**错误场景**：验证码错误/过期、两次密码不一致、用户不存在等，返回 400 + message，前端需感知。

---

### 2.2 当前用户与通知

#### 2.2.1 获取当前用户信息

| 项目          | 说明                                          |
| ------------- | --------------------------------------------- |
| **接口名称**  | 获取当前用户信息                              |
| **用途**      | 全局 Header、设置弹窗展示用户名、邮箱、头像。 |
| **HTTP 方法** | GET                                           |
| **请求路径**  | `/api/v1/me`                                  |
| **鉴权**      | 是（Bearer token）                            |

**请求参数**：无（用户身份由 token 解析）。

**返回结构**

| 字段名 | 类型   | 数据来源         | 前端依赖           |
| ------ | ------ | ---------------- | ------------------ |
| name   | string | users.name       | Header、设置弹窗。 |
| email  | string | users.email      | Header、设置弹窗。 |
| avatar | string | users.avatar_url | 头像 URL。         |

**错误场景**

| 场景                | HTTP | 前端是否需感知 | 说明                               |
| ------------------- | ---- | -------------- | ---------------------------------- |
| 未登录 / token 无效 | 401  | 是             | 前端可降级为未登录态，不阻断页面。 |

---

#### 2.2.2 获取通知列表

| 项目          | 说明                        |
| ------------- | --------------------------- |
| **接口名称**  | 获取通知列表                |
| **用途**      | Header 铃铛下拉、未读角标。 |
| **HTTP 方法** | GET                         |
| **请求路径**  | `/api/v1/notifications`     |
| **鉴权**      | 是                          |

**请求参数**：无（可选 query `limit`，默认如 20，前端未分页）。

**返回结构**：数组，每项：

| 字段名  | 类型             | 数据来源                         | 前端依赖                |
| ------- | ---------------- | -------------------------------- | ----------------------- |
| id      | string 或 number | notifications.id                 | 列表 key。              |
| title   | string           | notifications.title              | 标题。                  |
| message | string           | notifications.message            | 正文。                  |
| time    | string           | 由 notifications.created_at 计算 | 展示用，如「5分钟前」。 |
| unread  | boolean          | notifications.unread             | 角标与样式。            |

**错误场景**：401 未登录；前端可降级为空列表。

---

### 2.3 首页案例（可选）

#### 2.3.1 获取首页案例列表

| 项目          | 说明                                                                  |
| ------------- | --------------------------------------------------------------------- |
| **接口名称**  | 获取首页案例列表                                                      |
| **用途**      | `/`、`/home` 案例区轮播；卡片点击跳转 `/products/${testimonial.id}`。 |
| **HTTP 方法** | GET                                                                   |
| **请求路径**  | `/api/v1/testimonials`                                                |
| **鉴权**      | 否                                                                    |

**请求参数**：无。

**返回结构**：数组，每项：

| 字段名      | 类型   | 数据来源                 | 前端依赖                                                          |
| ----------- | ------ | ------------------------ | ----------------------------------------------------------------- |
| id          | number | testimonials.id          | 卡片 key；跳转 `/products/${id}`（若与产品关联可用 product_id）。 |
| image       | string | testimonials.image       | 卡片背景图。                                                      |
| avatar      | string | testimonials.avatar      | 头像。                                                            |
| company     | string | testimonials.company     | 公司名。                                                          |
| title       | string | testimonials.title       | 标题。                                                            |
| description | string | testimonials.description | 描述。                                                            |
| metrics     | array  | testimonials.metrics     | 每项 `{ label, value, color }`。                                  |
| quote       | string | testimonials.quote       | 引用。                                                            |
| author      | string | testimonials.author      | 作者。                                                            |

**说明**：若后端不提供此接口，前端继续用静态数据；若提供则 id 需能对应跳转（可为 product_id 或 testimonials.id 与产品关联）。

---

### 2.4 产品

#### 2.4.1 获取待推广产品列表（创作者）

| 项目          | 说明                                                                                   |
| ------------- | -------------------------------------------------------------------------------------- |
| **接口名称**  | 获取待推广产品列表                                                                     |
| **用途**      | `/creator/products` 创作者「待推广项目」列表；点击卡片跳转 `/products/${product.id}`。 |
| **HTTP 方法** | GET                                                                                    |
| **请求路径**  | `/api/v1/products/for-creator`                                                         |
| **鉴权**      | 是（当前用户 = 创作者）                                                                |

**请求参数**：无（可选分页，前端当前未用）。

**返回结构**：数组，每项（与契约 2.6 一致）：

| 字段名      | 类型             | 数据来源                   | 前端依赖                                     |
| ----------- | ---------------- | -------------------------- | -------------------------------------------- |
| id          | string 或 number | products.id                | 列表 key；`href={/products/${product.id}}`。 |
| name        | string           | products.name              | 标题。                                       |
| avatar      | string           | products.avatar_url        | Logo。                                       |
| tags        | string[]         | products.category_keywords | 标签。                                       |
| description | string           | products.description       | line-clamp-3。                               |

**数据来源**：products 表；筛选条件需业务约定（如对创作者开放的产品，可由 status 或单独标记字段控制）。不返回 status 字段。

**错误场景**：401 未登录则列表无数据。

---

#### 2.4.2 获取我的产品列表（商家）

| 项目          | 说明                                                                         |
| ------------- | ---------------------------------------------------------------------------- |
| **接口名称**  | 获取我的产品列表                                                             |
| **用途**      | `/products` 商家「我的产品」列表；点击卡片跳转 `/promotions/${product.id}`。 |
| **HTTP 方法** | GET                                                                          |
| **请求路径**  | `/api/v1/products`                                                           |
| **鉴权**      | 是（当前用户 = 商家）                                                        |

**请求参数**：无（可选分页，前端当前未用）。

**返回结构**：数组，每项：

| 字段名      | 类型             | 数据来源                   | 前端依赖                                                                                                |
| ----------- | ---------------- | -------------------------- | ------------------------------------------------------------------------------------------------------- |
| id          | string 或 number | products.id                | 列表 key；`href={/promotions/${product.id}}`。                                                          |
| name        | string           | products.name              | 标题。                                                                                                  |
| avatar      | string           | products.avatar_url        | Logo。                                                                                                  |
| tags        | string[]         | products.category_keywords | 标签。                                                                                                  |
| description | string           | products.description       | line-clamp-3。                                                                                          |
| status      | string           | products.status            | 必填；枚举 `matching` \| `confirmed` \| `published` \| `observing` \| `ended`，前端 statusConfig 依赖。 |

**错误场景**：401 未登录则阻断列表展示。

---

#### 2.4.3 获取产品详情（创作者侧 / 通用）

| 项目          | 说明                                             |
| ------------- | ------------------------------------------------ |
| **接口名称**  | 获取产品详情                                     |
| **用途**      | `/products/[id]` 页面展示；id 为路由 params.id。 |
| **HTTP 方法** | GET                                              |
| **请求路径**  | `/api/v1/products/:id`                           |
| **鉴权**      | 否（或可选，契约未强制）                         |

**请求参数**

| 字段名 | 类型   | 必填 | 与数据库对应          | 前端使用         |
| ------ | ------ | ---- | --------------------- | ---------------- |
| id     | string | 是   | 路径参数，products.id | 路由 params.id。 |

**返回结构**：单对象，与契约 2.4 一致：

| 字段名          | 类型   | 数据来源                     | 前端依赖                                                                          |
| --------------- | ------ | ---------------------------- | --------------------------------------------------------------------------------- |
| id              | string | products.id                  | 展示与「加入推广」productId。                                                     |
| name            | string | products.name                | 标题、面包屑。                                                                    |
| description     | string | products.description         | 短描述。                                                                          |
| fullDescription | string | products.full_description    | 长描述可折叠。                                                                    |
| link            | string | products.link                | 产品链接。                                                                        |
| contact         | object | products.contact\_\*         | `{ name, email, phone, website }`。                                               |
| category        | object | products.category\_\*        | `{ type, keywords }`。                                                            |
| attachments     | object | products + product_documents | `{ demoVideo: demo_video_url, screenshots, documents: [{ name, size, icon }] }`。 |
| progress        | string | products.progress            | 如「匹配中」。                                                                    |
| timeline        | object | products.\*\_deadline        | `{ developerDeadline, bloggerDeadline }`。                                        |
| pricing         | object | products.pricing\_\*         | `{ type, price, originalPrice }`。                                                |
| incentive       | object | products.incentive\_\*       | `{ enabled, baseReward, bonusTargets: [{ views, bonus }] }`。                     |
| stats           | object | products.applicants 等       | `{ applicants, expectedReach, targetAudience }`。                                 |

**错误场景**：404 产品不存在，前端需感知（提示或跳转）。

---

#### 2.4.4 发布产品（创建产品）

| 项目          | 说明                                                                                  |
| ------------- | ------------------------------------------------------------------------------------- |
| **接口名称**  | 发布产品                                                                              |
| **用途**      | `/products/upload` 用户填写表单并点击「发布」；成功则前端约 1.5s 后跳转 `/products`。 |
| **HTTP 方法** | POST                                                                                  |
| **请求路径**  | `/api/v1/products`                                                                    |
| **鉴权**      | 是（当前用户 = 商家，写入 products.user_id）                                          |

**请求参数（Body JSON）**：与契约 2.8 一致；文件（logo、documents、media）需约定：先上传文件得到 URL，再在此接口传 URL；或本接口为 multipart，见下方说明。

| 字段名              | 类型     | 必填 | 与数据库对应                   | 前端使用                                                      |
| ------------------- | -------- | ---- | ------------------------------ | ------------------------------------------------------------- |
| name                | string   | 是   | products.name                  | 产品名称。                                                    |
| description         | string   | 否   | products.description           | 短描述。                                                      |
| fullDescription     | string   | 是   | products.full_description      | 长描述。                                                      |
| link                | string   | 是   | products.link                  | 产品链接。                                                    |
| logo                | string   | 否   | products.avatar_url            | 上传后 URL。                                                  |
| tags                | string[] | 否   | products.category_keywords     | 标签。                                                        |
| contactName         | string   | 是   | products.contact_name          | 联系人。                                                      |
| contactEmail        | string   | 是   | products.contact_email         | 邮箱。                                                        |
| contactPhone        | string   | 是   | products.contact_phone         | 电话。                                                        |
| baseReward          | number   | 是   | products.base_reward           | 基础佣金。                                                    |
| bonusTargets        | array    | 否   | products.bonus_targets         | `[{ views, bonus }]`。                                        |
| expectedPublishDate | string   | 是   | products.expected_publish_date | YYYY-MM-DD。                                                  |
| agreed              | boolean  | 是   | 业务校验                       | 须为 true 才允许提交。                                        |
| documents           | array    | 否   | product_documents              | 每项 `{ name, size, icon?, fileUrl }`，fileUrl 为上传后 URL。 |
| media               | array    | 否   | 可存 product 或另行约定        | 每项 `{ type: "image"\|\"video", url, name }`。               |

**返回结构**

| 字段名    | 类型    | 数据来源    | 前端依赖                     |
| --------- | ------- | ----------- | ---------------------------- |
| success   | boolean | 固定        | 为 true 时跳转 `/products`。 |
| productId | string  | products.id | 可选，前端可用来跳转详情。   |
| message   | string  | 可选        | 失败时展示。                 |

**错误场景**：400 参数校验（联系人、邮箱、电话、链接、baseReward、agreed）；401 未登录；前端需感知并展示 message。

**【实现分支】** 若采用 multipart：请求体为 form-data，logo、documents、media 为文件字段；后端先存文件再写 products/product_documents。若采用「先上传文件接口」：此处仅收 URL，前端先调上传接口再传 URL。

---

#### 2.4.5 获取产品下推广任务详情（按产品 id）

| 项目          | 说明                                                                                                      |
| ------------- | --------------------------------------------------------------------------------------------------------- |
| **接口名称**  | 获取产品下推广任务详情                                                                                    |
| **用途**      | `/promotions/[id]` 页面；前端「我的产品」点击后跳转 `/promotions/${product.id}`，故此处 id = product_id。 |
| **HTTP 方法** | GET                                                                                                       |
| **请求路径**  | `/api/v1/products/:productId/promotion`                                                                   |
| **鉴权**      | 是（商家查看自己产品下的推广；或允许创作者查看，按业务定）                                                |

**请求参数**

| 字段名    | 类型   | 必填 | 与数据库对应          | 前端使用                         |
| --------- | ------ | ---- | --------------------- | -------------------------------- |
| productId | string | 是   | 路径参数，products.id | 路由 params.id（= product.id）。 |

**返回结构**：单对象；若该产品下无推广任务可返回 404 或空对象，前端需约定。

| 字段名               | 类型   | 数据来源                          | 前端依赖                                                                                                                             |
| -------------------- | ------ | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| id                   | string | promotions.id                     | 与路由一致（前端可能用 productId 作展示）。                                                                                          |
| productName 或 title | string | products.name 或 promotions.title | 详情页顶部「产品名称」。                                                                                                             |
| status               | string | promotions.status                 | 前端用 `status === "submitted"` 等推导 progress、statusText、statusColor；枚举需与前端约定（如 pending \| submitted \| published）。 |
| progress             | number | 可选，由 status 计算              | 0–1，若返回则前端直接用。                                                                                                            |
| performanceLevel     | string | promotions.performance_level      | 如「中」。                                                                                                                           |
| videos               | array  | promotion_videos                  | 每项：`id, title, platform, thumbnail, stats: { views, engagementRate, conversionRate }`；views 可为格式后字符串如 "1.2M"。          |

**错误场景**：404 产品不存在或该产品下无推广；401 无权限；前端需感知。

---

#### 2.4.6 产品文档下载

| 项目          | 说明                                                                                        |
| ------------- | ------------------------------------------------------------------------------------------- |
| **接口名称**  | 产品文档下载                                                                                |
| **用途**      | 产品详情页「资料」区点击下载；契约要求按产品+文档定位。                                     |
| **HTTP 方法** | GET                                                                                         |
| **请求路径**  | `/api/v1/products/:productId/documents/:documentId` 或 `.../documents/:documentId/download` |
| **鉴权**      | 可选（按业务定）                                                                            |

**请求参数**

| 字段名     | 类型   | 必填 | 与数据库对应               | 前端使用                                                                                                        |
| ---------- | ------ | ---- | -------------------------- | --------------------------------------------------------------------------------------------------------------- |
| productId  | string | 是   | 路径，products.id          | 产品详情页上下文。                                                                                              |
| documentId | string | 是   | 路径，product_documents.id | 前端需从 documents[].id 或 name 映射；当前前端仅用 name，**风险点**：需约定传 id 或 name（如 query name=xxx）。 |

**返回**：文件流（Content-Disposition: attachment）或 302 重定向到签名 URL。

**错误场景**：404 文档不存在；403 无权限；前端需感知（下载失败提示）。

---

### 2.5 推广

#### 2.5.1 加入推广（创作者申请）

| 项目          | 说明                                                                                |
| ------------- | ----------------------------------------------------------------------------------- |
| **接口名称**  | 加入推广                                                                            |
| **用途**      | `/products/[id]` 用户选择日历日期后点击「加入推广」；成功则前端跳转 `/promotions`。 |
| **HTTP 方法** | POST                                                                                |
| **请求路径**  | `/api/v1/promotions/apply`                                                          |
| **鉴权**      | 是（当前用户 = 创作者，写入 promotions.creator_id）                                 |

**请求参数（Body JSON）**

| 字段名       | 类型   | 必填 | 与数据库对应                     | 前端使用         |
| ------------ | ------ | ---- | -------------------------------- | ---------------- |
| productId    | string | 是   | promotions.product_id            | 路由 params.id。 |
| selectedDate | string | 是   | promotions.expected_publish_date | YYYY-MM-DD。     |

**返回结构**

| 字段名      | 类型    | 数据来源      | 前端依赖                       |
| ----------- | ------- | ------------- | ------------------------------ |
| success     | boolean | 固定          | 为 true 时跳转 `/promotions`。 |
| promotionId | string  | promotions.id | 可选。                         |
| message     | string  | 可选          | 失败时展示。                   |

**数据库操作**：INSERT promotions（product_id, creator_id, expected_publish_date, status=pending 等，title 可取自 product.name）。

**错误场景**：400 产品不存在或已申请；401 未登录；前端需感知。

---

#### 2.5.2 获取我的推广列表（商家）

| 项目          | 说明                                                                                         |
| ------------- | -------------------------------------------------------------------------------------------- |
| **接口名称**  | 获取我的推广列表                                                                             |
| **用途**      | `/promotions` Tab「待发布」「已发布」两列表；「去发布」链接用 project.id（= promotion.id）。 |
| **HTTP 方法** | GET                                                                                          |
| **请求路径**  | `/api/v1/promotions`                                                                         |
| **鉴权**      | 是（当前用户 = 商家，筛选 products.user_id = 当前用户）                                      |

**请求参数**

| 字段名 | 类型   | 必填 | 与数据库对应           | 前端使用                                      |
| ------ | ------ | ---- | ---------------------- | --------------------------------------------- |
| tab    | string | 否   | 筛选 promotions.status | "pending" \| "published"；前端 Tab 切换时传。 |

**返回结构**：数组，每项：

| 字段名      | 类型   | 数据来源                | 前端依赖                                                                                      |
| ----------- | ------ | ----------------------- | --------------------------------------------------------------------------------------------- |
| id          | string | promotions.id           | 列表 key；「去发布」projectId。                                                               |
| title       | string | promotions.title        | 标题。                                                                                        |
| platform    | string | promotions.platform     | 平台。                                                                                        |
| status      | string | promotions.status       | 待发布/已发布文案。                                                                           |
| description | string | promotions.description  | 描述。                                                                                        |
| stats       | object | 仅 tab=published 时必返 | `{ views, likes, comments, saves, shares }` 均为 number；前端已发布卡片依赖，缺一会导致报错。 |

**错误场景**：401 未登录则列表无数据。

---

#### 2.5.3 获取提交视频页简要信息（按 promotion id）

| 项目          | 说明                                                                                     |
| ------------- | ---------------------------------------------------------------------------------------- |
| **接口名称**  | 获取提交视频页简要信息                                                                   |
| **用途**      | `/creator/videos/new` 页头展示产品名称、Logo、标签；URL 带 projectId（= promotion.id）。 |
| **HTTP 方法** | GET                                                                                      |
| **请求路径**  | `/api/v1/promotions/:promotionId/brief`                                                  |
| **鉴权**      | 是（创作者只能查自己参与的 promotion）                                                   |

**请求参数**

| 字段名      | 类型   | 必填 | 与数据库对应        | 前端使用              |
| ----------- | ------ | ---- | ------------------- | --------------------- |
| promotionId | string | 是   | 路径，promotions.id | URL query projectId。 |

**返回结构**：单对象

| 字段名  | 类型     | 数据来源                     | 前端依赖     |
| ------- | -------- | ---------------------------- | ------------ |
| id      | string   | products.id 或 promotions.id | 展示用。     |
| name    | string   | products.name                | 页头产品名。 |
| logoUrl | string   | products.avatar_url          | Logo。       |
| tags    | string[] | products.category_keywords   | 标签。       |

**数据来源**：promotions JOIN products ON promotions.product_id = products.id WHERE promotions.id = :promotionId。

**错误场景**：404 任务不存在；403 非当前创作者；前端需感知。

---

#### 2.5.4 提交视频（多条）

| 项目          | 说明                                                                                                             |
| ------------- | ---------------------------------------------------------------------------------------------------------------- |
| **接口名称**  | 提交视频                                                                                                         |
| **用途**      | `/creator/videos/new` 用户填写多条「封面图 + 视频链接」后点击「提交视频」；成功则前端跳转 `/creator/dashboard`。 |
| **HTTP 方法** | POST                                                                                                             |
| **请求路径**  | `/api/v1/promotions/:promotionId/videos`                                                                         |
| **鉴权**      | 是（当前用户 = 该 promotion 的 creator_id）                                                                      |

**请求参数**

| 字段名      | 类型   | 必填 | 与数据库对应                   | 前端使用                                                                           |
| ----------- | ------ | ---- | ------------------------------ | ---------------------------------------------------------------------------------- |
| promotionId | string | 是   | 路径，promotions.id            | URL projectId。                                                                    |
| videoItems  | array  | 是   | 每条对应 promotion_videos 一行 | 每项 `{ coverImageUrl?: string, videoLink: string }`；coverImageUrl 为上传后 URL。 |

**返回结构**

| 字段名  | 类型    | 数据来源 | 前端依赖               |
| ------- | ------- | -------- | ---------------------- |
| success | boolean | 固定     | 为 true 时跳转仪表盘。 |
| message | string  | 可选     | 失败时展示。           |

**数据库操作**：INSERT promotion_videos（promotion_id, thumbnail_url, video_link, title 等可空或默认）。

**错误场景**：400 参数无效；403 非当前创作者；404 promotion 不存在；前端需感知。

**【实现分支】** 封面图为文件时：前端先调上传接口得到 URL 再传 coverImageUrl；或本接口支持 multipart，接收文件与 videoLink 数组。

---

### 2.6 创作者视频（仪表盘）

#### 2.6.1 获取创作者视频项目列表

| 项目          | 说明                                      |
| ------------- | ----------------------------------------- |
| **接口名称**  | 获取创作者视频项目列表                    |
| **用途**      | `/creator/dashboard` 视频卡片与汇总指标。 |
| **HTTP 方法** | GET                                       |
| **请求路径**  | `/api/v1/creator/video-projects`          |
| **鉴权**      | 是（promotions.creator_id = 当前用户）    |

**请求参数**：无。

**返回结构**：数组，每项：

| 字段名    | 类型             | 数据来源                              | 前端依赖                                                                                                                                                  |
| --------- | ---------------- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id        | string 或 number | promotion_videos.id                   | 列表 key。                                                                                                                                                |
| title     | string           | promotion_videos.title                | 标题。                                                                                                                                                    |
| duration  | string           | promotion_videos.duration             | 如 "2:35"。                                                                                                                                               |
| thumbnail | string           | promotion_videos.thumbnail_url        | 封面。                                                                                                                                                    |
| videoLink | string           | promotion_videos.video_link           | 视频链接。                                                                                                                                                |
| progress  | number           | promotion_videos.progress             | 0–100。                                                                                                                                                   |
| metrics   | object           | promotion_videos 各数字 + percentages | `{ plays, likes, shares, comments, favorites, percentages: number[5] }`；plays 等为带千分位字符串（如 "8,500"），前端 parseInt 汇总；percentages 长度 5。 |

**数据来源**：promotion_videos JOIN promotions ON promotion_videos.promotion_id = promotions.id WHERE promotions.creator_id = 当前用户。

**错误场景**：401 未登录则无数据。

---

### 2.7 消息

#### 2.7.1 获取消息列表

| 项目          | 说明                                     |
| ------------- | ---------------------------------------- |
| **接口名称**  | 获取消息列表                             |
| **用途**      | `/messages` 页面消息列表展示。           |
| **HTTP 方法** | GET                                      |
| **请求路径**  | `/api/v1/messages`                       |
| **鉴权**      | 是（当前用户的消息或全局会话，按业务定） |

**请求参数**：无（可选分页）。

**返回结构**：数组，每项：

| 字段名 | 类型             | 数据来源                      | 前端依赖                      |
| ------ | ---------------- | ----------------------------- | ----------------------------- |
| id     | string 或 number | messages.id                   | 列表 key。                    |
| type   | string           | messages.type                 | "user" \| "admin"。           |
| avatar | string           | messages.avatar_url           | 头像 URL。                    |
| name   | string           | messages.sender_name          | 管理员名称。                  |
| text   | string           | messages.text                 | 正文。                        |
| time   | string           | 由 messages.created_at 格式化 | 如 "10:30"。                  |
| files  | array            | message_attachments           | 每项 `{ name, size, type }`。 |

**错误场景**：401 可降级为空列表。

---

#### 2.7.2 发送消息

| 项目          | 说明                                           |
| ------------- | ---------------------------------------------- |
| **接口名称**  | 发送消息                                       |
| **用途**      | `/messages` 用户输入文本、选择附件后点击发送。 |
| **HTTP 方法** | POST                                           |
| **请求路径**  | `/api/v1/messages`                             |
| **鉴权**      | 是                                             |

**请求参数（Body JSON）**：text 与 files 二选一或同时存在；files 为上传后 URL 数组，或本接口为 multipart。

| 字段名 | 类型   | 必填 | 与数据库对应        | 前端使用                                                 |
| ------ | ------ | ---- | ------------------- | -------------------------------------------------------- |
| text   | string | 否   | messages.text       | 用户输入。                                               |
| files  | array  | 否   | message_attachments | 每项 `{ name, size, type, fileUrl }` 或 multipart 文件。 |

**返回结构**

| 字段名    | 类型    | 数据来源    | 前端依赖                                                      |
| --------- | ------- | ----------- | ------------------------------------------------------------- |
| success   | boolean | 固定        | 为 true 时追加到列表。                                        |
| messageId | string  | messages.id | 可选，新消息 id。                                             |
| message   | object  | 可选        | 新消息对象（id, type, avatar, text, time, files）供前端追加。 |

**错误场景**：400 text 与 files 均为空；401 未登录；前端需感知发送失败。

---

## 三、接口与业务流程关系

### 3.1 核心业务流程依赖的接口

| 业务流程              | 依赖接口（顺序）                                                                                                                                                                                       | 说明                                 |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------ |
| 访客 → 商家发布产品   | POST auth/send-login-code → POST auth/verify-email → POST products（发布产品）→ GET products（我的产品列表）                                                                                           | 登录后发布，再查看列表。             |
| 访客 → 创作者加入推广 | POST auth/send-login-code → POST auth/verify-email → GET products/for-creator（待推广列表）→ GET products/:id（产品详情）→ POST promotions/apply → GET promotions 或 GET products/:productId/promotion | 登录后看列表、详情、申请、查看推广。 |
| 商家查看推广与任务    | GET promotions（我的推广列表）→ GET products/:productId/promotion（推广任务详情）                                                                                                                      | 列表与详情。                         |
| 创作者提交视频        | GET promotions/:promotionId/brief → POST promotions/:promotionId/videos → GET creator/video-projects（仪表盘）                                                                                         | 去发布后填视频、提交、回仪表盘。     |
| 全局登录态与 Header   | GET me、GET notifications                                                                                                                                                                              | 每页可调，非阻断。                   |

**说明**：创作者待推广列表使用 GET /api/v1/products/for-creator；筛选条件（对创作者开放的产品）需业务约定（如 products.status 在约定范围内或单独标记字段）。

### 3.2 关键路径接口（失败即阻断）

| 接口                                | 失败时影响                           |
| ----------------------------------- | ------------------------------------ |
| POST auth/send-login-code           | 无法进入验证码页，登录流程中断。     |
| POST auth/verify-email              | 无法进入角色页，登录流程中断。       |
| GET products/:id                    | 产品详情页无数据，无法「加入推广」。 |
| POST promotions/apply               | 无法进入推广任务列表。               |
| GET products                        | 商家「我的产品」页无数据。           |
| POST products                       | 无法完成发布。                       |
| GET promotions                      | 「我的推广」页无数据。               |
| GET products/:productId/promotion   | 推广任务详情页无数据。               |
| GET products/for-creator            | 创作者「待推广项目」页无数据。       |
| GET creator/video-projects          | 创作者仪表盘无数据。                 |
| GET promotions/:promotionId/brief   | 提交视频页头无产品信息。             |
| POST promotions/:promotionId/videos | 无法完成提交。                       |

### 3.3 可降级或延后调用的接口

| 接口              | 说明                                 |
| ----------------- | ------------------------------------ |
| GET me            | 未登录可降级为未登录态，不阻断页面。 |
| GET notifications | 可降级为空列表或缓存。               |
| GET messages      | 可降级为空列表。                     |
| POST messages     | 仅发送失败，不影响列表展示。         |
| GET testimonials  | 可选，前端可继续用静态数据。         |

---

## 四、错误码与统一格式建议

**统一错误响应体**（4xx/5xx）：

```json
{
  "success": false,
  "code": "VALIDATION_ERROR",
  "message": "联系人名称至少需要2个字符"
}
```

**建议 code 枚举**（仅前端需感知的）：

- `VALIDATION_ERROR`：参数校验失败
- `UNAUTHORIZED`：未登录或 token 无效
- `FORBIDDEN`：无权限
- `NOT_FOUND`：资源不存在
- `RATE_LIMIT`：发送验证码等限流
- `CONFLICT`：如邮箱已注册、已申请过推广

其余错误（如 500）可统一为 `SERVER_ERROR`，前端仅展示 message 或通用提示。

---

## 五、歧义与实现分支汇总

1. **推广任务详情 id 语义**：已约定为 product_id，路径为 GET /api/v1/products/:productId/promotion；若该产品下有多条推广，后端取「主」一条（如最新或 status 为进行中）返回。
2. **待推广产品列表**：已定义为 GET /api/v1/products/for-creator；筛选条件（对创作者开放的产品）需业务约定。
3. **文件上传**：发布产品、提交视频、发送消息涉及文件；约定为「先上传文件得到 URL，再在业务接口中传 URL」或「业务接口 multipart」；需在实现时二选一并与前端约定。
4. **产品文档下载**：前端当前仅用 document name，后端需约定传 documentId 或 query name= 定位；见 2.4.5。
5. **promotions.status 枚举**：需与前端约定（如 pending \| submitted \| published），前端用 `status === "submitted"` 推导文案与进度。

---

**文档结束**。后端工程师或 AI Agent 可直接按本文档实现接口；与前端联调时以本文档与《前端数据契约 & 后端 API 接口规范》为准，字段或枚举变更需同步更新两份文档。
