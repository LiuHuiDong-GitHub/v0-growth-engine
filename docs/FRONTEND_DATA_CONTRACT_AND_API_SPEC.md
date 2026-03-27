# 前端数据契约 & 后端 API 接口规范

> **文档性质**：「接口即合同」—— 仅列出前端当前代码中**明确使用到的**数据与接口需求，后端按此实现即可，无需再向前端确认。  
> **约束**：不设计通用接口、不做过度抽象、不为「以后可能用到」增加字段；所有字段均能在前端代码中找到使用依据。

---

## 一、数据契约总览

### 1.1 核心业务实体及前端使用场景

| 实体                         | 前端使用场景                                                                                                                      | 数据来源（当前）                                         | 说明                                                                                                                       |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Testimonial（案例/评价）** | 首页 `/`、`/home` 案例区轮播卡片                                                                                                  | `lib/landing-data.ts`                                    | 展示用；卡片点击跳转 `/products/${testimonial.id}`，依赖 `id`。                                                            |
| **Product（产品）**          | 创作者待推广列表 `/creator/products`；商家我的产品 `/products`；产品详情 `/products/[id]`；发布产品 `/products/upload`            | 各页 Mock / `lib/product-data.ts`、`upload-mock-data.ts` | 列表项与详情结构不同，见下。                                                                                               |
| **Promotion（推广任务）**    | 我的推广 `/promotions`（待发布/已发布 Tab）；推广任务详情 `/promotions/[id]`                                                      | 各页 Mock                                                | 待发布与已发布项结构不同；详情页依赖 `id`、`status`（query）。                                                             |
| **Video（视频）**            | 推广任务详情内「我的视频表现」列表；创作者仪表盘 `/creator/dashboard` 视频项目；提交视频页 `/creator/videos/new`                  | 各页 Mock                                                | 详情页与仪表盘中的「视频」结构不同，见接口清单。                                                                           |
| **Message（消息）**          | 消息中心 `/messages` 列表与发送                                                                                                   | 页面 state Mock                                          | 列表展示 + 发送时提交 `text`、`files`。                                                                                    |
| **User（用户/当前登录）**    | 全局 Header 用户信息、设置弹窗、退出登录                                                                                          | `app-header` 内 state                                    | 前端依赖：姓名、邮箱、头像 URL；登录态决定首页「上传产品」跳转。                                                           |
| **Notification（通知）**     | 全局 Header 铃铛下拉列表                                                                                                          | `app-header` 内硬编码                                    | 前端依赖：id、title、message、time、unread。                                                                               |
| **Auth 相关**                | 登录 `/auth/login`、验证邮箱 `/auth/verify-email`、注册 `/auth/register`、忘记密码 `/auth/forgot-password`、选择角色 `/auth/role` | 仅前端跳转与 state                                       | 登录提交 `email`；验证提交 `email`+`code`；注册提交 `email`+`password`；忘记密码提交 method/phone/email/code/newPassword。 |

### 1.2 实体与页面映射（前端强依赖）

- **Product 列表（创作者）**：`/creator/products` → 每项需 `id`、`name`、`avatar`、`tags`（string[]）、`description`；`id` 用于 `href={/products/${product.id}}`。
- **Product 列表（商家）**：`/products` → 每项需 `id`、`name`、`avatar`、`tags`、`description`、`status`；`status` 为 `matching` \| `confirmed` \| `published` \| `observing` \| `ended`；`id` 用于 `href={/promotions/${product.id}}`。
- **Product 详情**：`/products/[id]` → 需完整产品对象（见 2.4）；`id` 来自路由，当前前端未按 id 请求不同数据，**后端需按 id 返回对应产品**。
- **Promotion 列表**：`/promotions` → 待发布项：`id`、`title`、`platform`、`status`、`description`；已发布项额外需 `stats`: `{ views, likes, comments, saves, shares }`（均为 number）；`id` 用于「去发布」链接 `projectId`。
- **Promotion 详情**：`/promotions/[id]` → 需 `id`、`status`（或可由后端推导的 progress）、`videos[]`、`redditData[]`；页面用 `searchParams.get("status")` 区分「视频创作中」等文案，**前端强依赖 `status` 或等价字段**。
- **创作者仪表盘**：`/creator/dashboard` → 需 `videoProjects[]`，每项含 `id`、`title`、`duration`、`thumbnail`、`videoLink`、`progress`、`metrics`（见 2.8）。
- **提交视频页**：`/creator/videos/new` → 需当前产品简要信息（`id`、`name`、`logoUrl`、`tags`）；提交时前端会收集多条 `videoItems`（封面图 + 视频链接），**需接口接收**。

---

## 二、接口清单（逐条）

以下按「前端调用时机」列出，请求/响应字段仅包含前端**已使用**的字段。

---

### 2.1 认证

#### 2.1.1 发送登录验证码（或发起邮箱登录）

- **接口名称**：发送登录验证码
- **用途**：`/auth/login` 用户输入邮箱并点击提交后调用；成功后前端跳转 `/auth/verify-email?email=xxx`。
- **请求方式**：`POST`
- **请求参数**：

| 字段名 | 类型   | 必填 | 前端使用方式                                               |
| ------ | ------ | ---- | ---------------------------------------------------------- |
| email  | string | 是   | 用户输入，提交时传入；验证码页从 URL 取 email 展示与重发。 |

- **返回**：前端仅根据成功/失败决定是否跳转验证码页；若失败需前端可展示错误信息，建议返回 `{ success: boolean, message?: string }`。
- **列表/分页**：否。
- **风险点**：当前前端未处理失败分支，后端需定义错误码/文案供后续前端接入。

---

#### 2.1.2 验证邮箱验证码（登录确认）

- **接口名称**：验证邮箱验证码
- **用途**：`/auth/verify-email` 用户输入 6 位数字验证码后调用（前端在满 6 位时自动触发）；成功则前端跳转 `/auth/role`。
- **请求方式**：`POST`
- **请求参数**：

| 字段名 | 类型   | 必填 | 前端使用方式                           |
| ------ | ------ | ---- | -------------------------------------- |
| email  | string | 是   | 来自 URL `searchParams.get("email")`。 |
| code   | string | 是   | 6 位数字，前端拼接为字符串提交。       |

- **返回**：前端根据成功/失败决定是否跳转角色页；建议返回 `{ success: boolean, token?: string, message?: string }`，若需登录态则返回 token 供前端存储。
- **列表/分页**：否。
- **风险点**：当前前端未传 token 到后续页面，若需登录态需约定 token 存储方式（如 Cookie 或 localStorage）。

---

#### 2.1.3 注册

- **接口名称**：用户注册
- **用途**：`/auth/register` 用户填写邮箱、密码或点击 Google 注册后调用；成功则前端跳转 `/auth/role`。
- **请求方式**：`POST`
- **请求参数**：

| 字段名   | 类型   | 必填 | 前端使用方式                             |
| -------- | ------ | ---- | ---------------------------------------- |
| email    | string | 是   | 用户输入。                               |
| password | string | 是   | 用户输入（当前前端无强度校验，仅提交）。 |

- **返回**：前端仅根据成功/失败跳转；建议 `{ success: boolean, message?: string }`。
- **列表/分页**：否。

---

#### 2.1.4 忘记密码（获取验证码 + 重置）

- **接口名称**：忘记密码 - 获取验证码 / 重置密码
- **用途**：`/auth/forgot-password` 用户选择手机或邮箱后获取验证码、填写新密码并提交。
- **请求方式**：
  - 获取验证码：`POST`
  - 重置密码：`POST`
- **请求参数（获取验证码）**：

| 字段名      | 类型   | 必填                   | 前端使用方式                       |
| ----------- | ------ | ---------------------- | ---------------------------------- |
| method      | string | 是                     | `"phone"` \| `"email"`。           |
| phoneNumber | string | 当 method=phone 时必填 | 用户输入；前端同时传 countryCode。 |
| countryCode | string | 当 method=phone 时     | 如 "+86"。                         |
| email       | string | 当 method=email 时必填 | 用户输入。                         |

- **请求参数（重置密码）**：

| 字段名           | 类型   | 必填               | 前端使用方式                            |
| ---------------- | ------ | ------------------ | --------------------------------------- |
| method           | string | 是                 | `"phone"` \| `"email"`。                |
| phoneNumber      | string | 当 method=phone 时 | 同上。                                  |
| countryCode      | string | 当 method=phone 时 | 同上。                                  |
| email            | string | 当 method=email 时 | 同上。                                  |
| verificationCode | string | 是                 | 用户输入。                              |
| newPassword      | string | 是                 | 用户输入。                              |
| confirmPassword  | string | 是                 | 前端用于校验与 newPassword 一致后提交。 |

- **返回**：前端当前未处理返回值，建议 `{ success: boolean, message?: string }`。
- **列表/分页**：否。

---

### 2.2 当前用户与通知（Header）

#### 2.2.1 获取当前用户信息

- **接口名称**：获取当前用户信息
- **用途**：全局 Header 展示用户名、邮箱、头像；设置弹窗内个人资料、密码等。
- **请求方式**：`GET`
- **请求参数**：无（或依赖 Cookie/Authorization）。
- **返回字段**（前端已使用）：

| 字段名 | 类型   | 前端使用方式                                        |
| ------ | ------ | --------------------------------------------------- |
| name   | string | Header 与设置弹窗展示。                             |
| email  | string | Header 与设置弹窗展示。                             |
| avatar | string | 头像 URL，当前前端用 dicebear URL，可改为后端返回。 |

- **列表/分页**：否。

---

#### 2.2.2 获取通知列表

- **接口名称**：获取通知列表
- **用途**：Header 铃铛下拉列表、未读数量角标。
- **请求方式**：`GET`
- **请求参数**：无（或分页参数，当前前端未做分页）。
- **返回字段**（前端已使用）：

| 字段名  | 类型             | 前端使用方式           |
| ------- | ---------------- | ---------------------- |
| id      | number 或 string | 列表 key。             |
| title   | string           | 标题。                 |
| message | string           | 正文。                 |
| time    | string           | 展示用，如 "5分钟前"。 |
| unread  | boolean          | 未读角标与样式。       |

- **是否为列表**：是；当前前端未分页，可约定默认条数。
- **风险点**：前端未实现「全部已读」「查看所有通知」的请求，可按需由后端预留。

---

### 2.3 首页案例（Testimonial）

#### 2.3.1 获取首页案例列表（可选）

- **接口名称**：获取首页案例/评价列表
- **用途**：`/`、`/home` 案例区轮播；卡片点击跳转 `/products/${testimonial.id}`。
- **请求方式**：`GET`
- **请求参数**：无。
- **返回字段**（与 `lib/landing-data.ts` 一致）：

| 字段名      | 类型   | 前端使用方式                                                                            |
| ----------- | ------ | --------------------------------------------------------------------------------------- |
| id          | number | 卡片 key；跳转 `/products/${id}`。                                                      |
| image       | string | 卡片背景图 URL。                                                                        |
| avatar      | string | 头像 URL。                                                                              |
| company     | string | 公司名。                                                                                |
| title       | string | 标题。                                                                                  |
| description | string | 描述。                                                                                  |
| metrics     | array  | 每项：`{ label: string, value: string, color: string }`，用于展示 ROI/新客户/播放量等。 |
| quote       | string | 引用文案。                                                                              |
| author      | string | 作者名。                                                                                |

- **是否为列表**：是；前端横向滚动展示，无分页。
- **说明**：当前为静态数据，若后端不提供则前端继续用静态数据；若提供则需保证含 `id` 以便跳转产品详情。

---

### 2.4 产品详情（创作者侧）

#### 2.4.1 获取产品详情（按 id）

- **接口名称**：获取产品详情
- **用途**：`/products/[id]` 页面展示；`id` 来自路由 `params.id`，**后端必须按 id 返回对应产品**。
- **请求方式**：`GET`
- **请求参数**：

| 字段名 | 类型   | 必填 | 前端使用方式                        |
| ------ | ------ | ---- | ----------------------------------- |
| id     | string | 是   | 路径参数，如 `/products/1` → id=1。 |

- **返回字段**（与 `lib/product-data.ts` 结构一致，前端已使用）：

| 字段名          | 类型   | 前端使用方式                                                                                      |
| --------------- | ------ | ------------------------------------------------------------------------------------------------- |
| id              | string | 展示与「加入推广」关联。                                                                          |
| name            | string | 标题、面包屑等。                                                                                  |
| description     | string | 短描述。                                                                                          |
| fullDescription | string | 长描述，可折叠展开。                                                                              |
| link            | string | 产品链接，可点击跳转。                                                                            |
| contact         | object | `{ name, email, phone, website }`，联系卡片。                                                     |
| category        | object | `{ type: string, keywords: string[] }`，分类与标签。                                              |
| attachments     | object | `{ demoVideo, screenshots: string[], documents: Array<{ name, size, icon }> }`，文档下载用 name。 |
| progress        | string | 如 "匹配中"，进度展示。                                                                           |
| timeline        | object | `{ developerDeadline, bloggerDeadline }`，日期展示。                                              |
| pricing         | object | `{ type, price, originalPrice }`，定价展示。                                                      |
| incentive       | object | `{ enabled, baseReward, bonusTargets: Array<{ views, bonus }> }`，激励卡片。                      |
| stats           | object | `{ applicants, expectedReach, targetAudience }`，统计展示。                                       |

- **列表/分页**：否。
- **结构强依赖**：`documents` 每项需 `name`、`size`、`icon`；`incentive.bonusTargets` 需 `views`、`bonus`；前端下载资料仅用 `name` 拼 URL，后端可提供真实下载地址时再扩展。

---

### 2.5 加入推广（创作者在产品详情页）

#### 2.5.1 加入推广（申请推广某产品）

- **接口名称**：加入推广
- **用途**：`/products/[id]` 用户选择日历日期后点击「加入推广」；成功则前端约 1.5s 后跳转 `/promotions`。
- **请求方式**：`POST`
- **请求参数**：

| 字段名       | 类型   | 必填 | 前端使用方式                        |
| ------------ | ------ | ---- | ----------------------------------- |
| productId    | string | 是   | 来自路由 `params.id`。              |
| selectedDate | string | 是   | 用户选择的档期，格式 `YYYY-MM-DD`。 |

- **返回**：前端根据成功/失败决定是否跳转；建议 `{ success: boolean, promotionId?: string, message?: string }`。
- **列表/分页**：否。
- **风险点**：当前前端未传 token，若需鉴权需约定 Header。

---

### 2.6 创作者 - 待推广产品列表

#### 2.6.1 获取待推广产品列表

- **接口名称**：获取待推广产品列表（创作者侧）
- **用途**：`/creator/products` 列表展示；点击卡片跳转 `/products/${product.id}`。
- **请求方式**：`GET`
- **请求参数**：无（或分页，当前前端未分页）。
- **返回字段**（每项）：

| 字段名      | 类型             | 前端使用方式                                 |
| ----------- | ---------------- | -------------------------------------------- |
| id          | number 或 string | 列表 key；`href={/products/${product.id}}`。 |
| name        | string           | 标题。                                       |
| avatar      | string           | 头像/Logo URL。                              |
| tags        | string[]         | 标签列表。                                   |
| description | string           | 描述，line-clamp-3。                         |

- **是否为列表**：是。
- **顺序**：前端未强依赖顺序，可后端默认排序。

---

### 2.7 商家 - 我的产品列表

#### 2.7.1 获取我的产品列表

- **接口名称**：获取我的产品列表（商家侧）
- **用途**：`/products` 列表展示；点击卡片跳转 `/promotions/${product.id}`。
- **请求方式**：`GET`
- **请求参数**：无（或分页）。
- **返回字段**（每项）：

| 字段名      | 类型             | 前端使用方式                                                                                         |
| ----------- | ---------------- | ---------------------------------------------------------------------------------------------------- |
| id          | number 或 string | 列表 key；`href={/promotions/${product.id}}`。                                                       |
| name        | string           | 标题。                                                                                               |
| avatar      | string           | 头像/Logo URL。                                                                                      |
| tags        | string[]         | 标签。                                                                                               |
| description | string           | 描述。                                                                                               |
| status      | string           | 必填；枚举：`matching` \| `confirmed` \| `published` \| `observing` \| `ended`，用于标签样式与文案。 |

- **是否为列表**：是。
- **前端强依赖**：`status` 必须为上述五值之一，前端用 `statusConfig[product.status]` 取样式与 label。

---

### 2.8 发布产品（商家）

#### 2.8.1 发布产品（创建产品）

- **接口名称**：发布产品
- **用途**：`/products/upload` 用户填写表单并点击「发布」后调用；成功则前端约 1.5s 后跳转 `/products`。
- **请求方式**：`POST`
- **请求参数**（Body，前端表单已收集）：

| 字段名              | 类型           | 必填 | 前端使用方式                                                                                 |
| ------------------- | -------------- | ---- | -------------------------------------------------------------------------------------------- |
| name                | string         | 是   | 产品名称。                                                                                   |
| description         | string         | 是   | 短描述（可选，前端有该字段）。                                                               |
| fullDescription     | string         | 是   | 长描述/文档描述。                                                                            |
| link                | string         | 是   | 产品链接；前端校验 URL 或 www 格式。                                                         |
| logo                | File 或 string | 否   | 产品 Logo；前端为 File 或 DataURL，可后端约定传 multipart 或 URL。                           |
| tags                | string[]       | 否   | 用户选择的标签 + 自定义标签。                                                                |
| contactName         | string         | 是   | 前端校验至少 2 字符。                                                                        |
| contactEmail        | string         | 是   | 前端校验邮箱格式。                                                                           |
| contactPhone        | string         | 是   | 前端校验至少 7 位。                                                                          |
| baseReward          | number         | 是   | 基础佣金；前端校验非负数字。                                                                 |
| bonusTargets        | array          | 否   | `Array<{ views: number, bonus: number }>`，与前端 bonusTargetViews/bonusTargetBonuses 对应。 |
| expectedPublishDate | string         | 是   | 用户选择的档期，格式 `YYYY-MM-DD`。                                                          |
| agreed              | boolean        | 是   | 用户勾选协议后为 true，前端仅在勾选后允许提交。                                              |
| documents           | 见下           | 否   | 用户上传的文档列表；前端为 `{ name, size, url }[]`，url 为 blob，需后端接收文件上传。        |
| media               | 见下           | 否   | 用户上传的图片/视频；前端为 `{ type: "image"\|"video", url, name }[]`，url 为 blob。         |

- **返回**：建议 `{ success: boolean, productId?: string, message?: string }`；前端成功即跳转 `/products`。
- **列表/分页**：否。
- **风险点**：`documents`、`media` 当前为前端 blob URL，需约定为 multipart 或先上传文件再传 URL；前端未实现实际上传接口，**后端需约定文件上传接口与字段**。

---

### 2.9 我的推广列表（商家）

#### 2.9.1 获取我的推广列表（待发布 + 已发布）

- **接口名称**：获取我的推广列表
- **用途**：`/promotions` 页 Tab「待发布」「已发布」两列表。
- **请求方式**：`GET`
- **请求参数**：建议 `tab` 或 `status` 区分待发布/已发布（当前前端为前端 Tab 切换，可一次返回两种或分两个接口）。
- **返回字段**：
  - **待发布项**：`id`（string）、`title`、`platform`、`status`、`description`；`id` 用于「去发布」链接 `projectId`。
  - **已发布项**：同上，且每项含 `stats`: `{ views: number, likes: number, comments: number, saves: number, shares: number }`，前端用于展示与 `.toLocaleString()`。
- **是否为列表**：是。
- **前端强依赖**：已发布项必须有 `stats` 及上述 5 个数字字段，否则前端会报错。

---

### 2.10 推广任务详情（商家）

#### 2.10.1 获取推广任务详情

- **接口名称**：获取推广任务详情
- **用途**：`/promotions/[id]` 页面；`id` 来自路由，`status` 来自 query（如 `?status=submitted`），前端用 `status` 区分「视频创作中」等文案与进度条比例。
- **请求方式**：`GET`
- **请求参数**：

| 字段名 | 类型   | 必填 | 前端使用方式 |
| ------ | ------ | ---- | ------------ |
| id     | string | 是   | 路径参数。   |

- **返回字段**（前端已使用）：

| 字段名               | 类型   | 前端使用方式                                                                                                                                                 |
| -------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| id                   | string | 与路由一致。                                                                                                                                                 |
| productName 或 title | string | 详情页顶部「产品名称」展示。                                                                                                                                 |
| status               | string | 前端用 `status === "submitted"` 推导 progress（0.5/0.75）、statusText、statusColor；**需与前端约定枚举值**。                                                 |
| progress             | number | 可选；0–1，若返回则前端可直接用，否则由 status 推导。                                                                                                        |
| performanceLevel     | string | 可选；如 "中"，表现程度展示。                                                                                                                                |
| videos               | array  | 每项：`id`、`title`、`platform`、`thumbnail`、`stats`: `{ views: string, engagementRate: string, conversionRate: string }`；前端展示「我的视频表现」卡片。   |
| redditData           | array  | 可选；每项：`date`、`title`、`views`（number）、`conversions`（number）、`revenue`（string）。当前前端在推广详情页未渲染该列表，仅 Mock 中定义，后端可预留。 |

- **是否为列表**：否。
- **前端强依赖**：`videos[].stats` 的 `views`、`engagementRate`、`conversionRate` 当前为字符串展示（如 "1.2M"、"5.3%"）；`redditData` 的 `revenue` 为字符串（如 "¥850.00"）。

---

### 2.11 创作者仪表盘 - 视频项目

#### 2.11.1 获取创作者视频项目列表

- **接口名称**：获取创作者视频项目列表
- **用途**：`/creator/dashboard` 视频卡片与汇总指标。
- **请求方式**：`GET`
- **请求参数**：无（或分页）。
- **返回字段**（每项，与当前 Mock 一致）：

| 字段名    | 类型             | 前端使用方式                                                                                                                                                             |
| --------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| id        | number 或 string | 列表 key。                                                                                                                                                               |
| title     | string           | 标题。                                                                                                                                                                   |
| duration  | string           | 如 "2:35"。                                                                                                                                                              |
| thumbnail | string           | 封面 URL。                                                                                                                                                               |
| videoLink | string           | 视频链接。                                                                                                                                                               |
| progress  | number           | 0–100，进度。                                                                                                                                                            |
| metrics   | object           | `{ plays: string, likes: string, shares: string, comments: string, favorites: string, percentages: number[5] }`；前端用于汇总与环形图，percentages 为 5 个维度的百分比。 |

- **是否为列表**：是。
- **前端强依赖**：`metrics.plays` 等为带千分位字符串（如 "8,500"），前端会 `parseInt(plays.replace(/,/g, ""))` 做汇总；`percentages` 长度为 5。

---

### 2.12 提交视频（创作者）

#### 2.12.1 获取当前任务/产品简要信息（提交视频页）

- **接口名称**：获取提交视频页所需产品/任务信息
- **用途**：`/creator/videos/new` 页头展示产品名称、Logo、标签；链接可能带 `projectId`、`projectName`、`category`（platform）。
- **请求方式**：`GET`
- **请求参数**：`projectId`（query，来自「去发布」链接）。
- **返回字段**：`id`、`name`、`logoUrl`、`tags`（string[]）。
- **是否为列表**：否。

---

#### 2.12.2 提交视频（多条）

- **接口名称**：提交视频
- **用途**：`/creator/videos/new` 用户填写多条「封面图 + 视频链接」后点击「提交视频」；成功则前端跳转 `/creator/dashboard`。
- **请求方式**：`POST`
- **请求参数**：

| 字段名     | 类型   | 必填 | 前端使用方式                                                                                       |
| ---------- | ------ | ---- | -------------------------------------------------------------------------------------------------- |
| projectId  | string | 是   | 来自 URL query。                                                                                   |
| videoItems | array  | 是   | 每项：`{ coverImageUrl?: string, videoLink: string }`；前端当前为 DataURL 或文件，需约定上传方式。 |

- **返回**：建议 `{ success: boolean, message?: string }`。
- **列表/分页**：否。
- **风险点**：封面图为前端 blob/File，需约定先上传再传 URL 或 multipart。

---

### 2.13 消息中心

#### 2.13.1 获取消息列表

- **接口名称**：获取消息列表
- **用途**：`/messages` 页面消息列表展示。
- **请求方式**：`GET`
- **请求参数**：无（或分页、会话 id）。
- **返回字段**（每项）：

| 字段名 | 类型             | 前端使用方式                               |
| ------ | ---------------- | ------------------------------------------ |
| id     | number 或 string | 列表 key。                                 |
| type   | string           | `"user"` \| `"admin"`，区分左右与样式。    |
| avatar | string           | 头像 URL。                                 |
| name   | string           | 可选，管理员名称。                         |
| text   | string           | 可选，正文。                               |
| time   | string           | 展示时间，如 "10:30"。                     |
| files  | array            | 可选，`{ name, size, type }[]`，附件展示。 |

- **是否为列表**：是。

---

#### 2.13.2 发送消息

- **接口名称**：发送消息
- **用途**：`/messages` 用户输入文本、选择附件后点击发送。
- **请求方式**：`POST`
- **请求参数**：

| 字段名 | 类型                     | 必填 | 前端使用方式                                      |
| ------ | ------------------------ | ---- | ------------------------------------------------- |
| text   | string                   | 否   | 用户输入，可与 files 二选一或同时存在。           |
| files  | File[] 或 上传后的 url[] | 否   | 前端当前为 File 列表，需约定 multipart 或先上传。 |

- **返回**：建议返回新消息对象（含 id、time 等）供前端追加到列表；或 `{ success: boolean, messageId?: string }`。
- **列表/分页**：否。

---

### 2.14 文档下载（产品详情）

- **说明**：产品详情页「资料」区点击下载时，前端当前用 `document.name` 拼 mock URL 触发下载。
- **接口需求**：后端需提供**按文档标识/文件名下载**的 URL 或接口（如 `GET /products/:productId/documents/:docId` 或带签名的 URL），前端将把「下载」按钮指向该地址。
- **请求参数**：至少需能定位到产品 + 文档（productId + document name 或 id）。
- **返回**：文件流或 302 到文件 URL。
- **风险点**：当前前端未传 productId，仅用 name，后端需与前端约定参数形式。

---

## 三、状态与接口依赖关系

### 3.1 前端状态依赖哪些接口

| 前端页面/状态    | 依赖的接口                       | 说明                                         |
| ---------------- | -------------------------------- | -------------------------------------------- |
| 首页案例区       | GET 首页案例列表（可选）         | 不接则继续用静态数据。                       |
| 登录/验证流程    | POST 发送验证码、POST 验证邮箱   | 失败时前端当前未处理，需约定错误码。         |
| 创作者待推广列表 | GET 待推广产品列表               | 列表页唯一数据源。                           |
| 产品详情页       | GET 产品详情(id)                 | 详情页唯一数据源；id 来自路由。              |
| 加入推广         | POST 加入推广                    | 成功后才跳转 `/promotions`。                 |
| 商家我的产品     | GET 我的产品列表                 | 列表页唯一数据源；依赖 status 枚举。         |
| 发布产品         | POST 发布产品                    | 成功后才跳转 `/products`；依赖校验字段。     |
| 我的推广         | GET 我的推广列表                 | 待发布/已发布两 Tab 数据；已发布依赖 stats。 |
| 推广任务详情     | GET 推广任务详情(id)             | 详情页唯一数据源；依赖 status 或 progress。  |
| 创作者仪表盘     | GET 创作者视频项目列表           | 仪表盘唯一数据源；依赖 metrics 结构。        |
| 提交视频页       | GET 任务/产品简要、POST 提交视频 | 页头产品信息 + 提交。                        |
| 消息中心         | GET 消息列表、POST 发送消息      | 列表与发送。                                 |
| Header 用户/通知 | GET 当前用户、GET 通知列表       | 登录态与头像、通知角标。                     |

### 3.2 接口失败对核心流程的影响

| 接口                   | 失败时是否阻断核心流程 | 说明                                         |
| ---------------------- | ---------------------- | -------------------------------------------- |
| POST 发送验证码        | 是                     | 无法进入验证码页，登录流程中断。             |
| POST 验证邮箱          | 是                     | 无法进入角色页，登录流程中断。               |
| GET 产品详情           | 是                     | 产品详情页无数据，创作者无法「加入推广」。   |
| POST 加入推广          | 是                     | 无法进入推广任务列表，流程中断。             |
| GET 我的产品列表       | 是                     | 商家「我的产品」页无数据。                   |
| POST 发布产品          | 是                     | 无法完成发布，流程中断。                     |
| GET 我的推广列表       | 是                     | 「我的推广」页无数据。                       |
| GET 推广任务详情       | 是                     | 任务详情页无数据。                           |
| GET 待推广产品列表     | 是                     | 创作者「待推广项目」页无数据。               |
| GET 创作者视频项目列表 | 是                     | 创作者仪表盘无数据。                         |
| GET 当前用户           | 否                     | 未登录时 Header 仍可展示，可降级为未登录态。 |
| GET 通知列表           | 否                     | 可降级为空列表或缓存。                       |
| GET 消息列表           | 否                     | 可降级为空列表。                             |
| POST 发送消息          | 否                     | 仅发送失败，不影响列表展示。                 |

### 3.3 关键路径接口（按用户旅程）

1. **访客 → 商家发布产品**
   - POST 发送验证码 → POST 验证邮箱 →（登录态）→ POST 发布产品 → GET 我的产品列表。
   - 关键：发送验证码、验证邮箱、发布产品、我的产品列表。

2. **访客 → 创作者加入推广**
   - POST 发送验证码 → POST 验证邮箱 →（登录态）→ GET 待推广产品列表 → GET 产品详情 → POST 加入推广 → GET 我的推广列表（或推广任务详情）。
   - 关键：验证码、验证邮箱、待推广列表、产品详情、加入推广。

3. **商家查看推广与任务**
   - GET 我的推广列表、GET 推广任务详情。
   - 关键：我的推广列表、推广任务详情。

4. **创作者提交视频**
   - GET 任务/产品简要（projectId）→ POST 提交视频。
   - 关键：任务简要、提交视频。

5. **全局**
   - GET 当前用户（影响首页「上传产品」是否跳转登录）、GET 通知列表（影响角标）。

以上接口需优先保证可用性与错误格式约定，以便前端接入错误提示与降级。

---

## 四、风险点与约定建议

1. **产品详情 `/products/[id]`**：前端当前未按 id 请求，后端**必须**按 id 返回对应产品，否则所有详情页会一致。
2. **推广任务详情 `status`**：前端用 `searchParams.get("status")` 与 `status === "submitted"` 推导进度与文案，建议后端返回明确 `status` 或 `progress`，并与前端约定枚举值。
3. **商家产品 `status`**：必须为 `matching` \| `confirmed` \| `published` \| `observing` \| `ended` 之一，否则前端 `statusConfig[product.status]` 会为 undefined。
4. **已发布推广项 `stats`**：必须包含 `views`、`likes`、`comments`、`saves`、`shares` 五个 number 字段。
5. **登录态**：当前前端未在请求中携带 token，后端若需鉴权需约定 Header（如 `Authorization: Bearer <token>`）及 token 获取方式（如验证邮箱接口返回）。
6. **文件上传**：发布产品、提交视频、发送消息均涉及文件；前端当前多为 blob/File，需约定为「先上传文件接口再传 URL」或「multipart 单次提交」，并在上述接口中写明字段名与类型。
7. **文档下载**：产品详情资料下载当前为前端 mock URL，后端需提供按产品+文档定位的下载地址或接口，并与前端约定参数。

---

**文档结束**。后端可按本规范实现接口，前端将按同一契约接入；若有字段增删或枚举变更，需同步更新本文档与前端类型定义。
