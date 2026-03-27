# GrowthEngine 前端 — 业务需求文档 + 数据流说明

> **文档性质**：基于当前前端代码反向推导的「已实现系统的事实说明」，非产品规划。  
> **约束**：仅描述当前代码已实现的行为；不臆测、不扩展；存在歧义处已标注「不确定点」。

---

## 一、整体产品概述

### 1.1 该系统解决什么问题

- 从页面文案与结构可知：系统面向**独立创作者的产品推广**。
- 首页与元数据描述为「独立创作者的产品增长引擎」「帮助独立创作者和开发者快速推广产品」。
- 实际已实现能力：**创作者**可浏览待推广产品、查看产品详情、选择档期并「加入推广」跳转至推广任务；**商家/投流者**可管理「我的产品」、发布新产品（上传页）、查看「我的推广」任务列表与任务详情；**通用**能力包括登录/注册/验证邮箱/选择角色、消息中心、帮助中心、法律页等。

### 1.2 核心用户是谁

- **未登录访客**：可浏览首页，点击「上传产品」会跳转登录。
- **已登录用户（无角色区分）**：通过「选择角色」分为两类：
  - **博主/创作者**：身份认证 → 待推广项目列表 → 产品详情 → 加入推广 → 推广任务；另有创作者仪表盘、提交视频页。
  - **投流者/开发者**：直接进入「发布产品」页（产品上传）；另有我的产品、我的推广、推广任务详情。

### 1.3 系统的主要功能模块划分

| 模块       | 路由范围                                                           | 说明                                        |
| ---------- | ------------------------------------------------------------------ | ------------------------------------------- |
| 落地页     | `/`, `/home`                                                       | 首页展示、上传产品入口                      |
| 认证       | `/auth/*`                                                          | 登录、注册、验证邮箱、选择角色、忘记密码    |
| 创作者中心 | `/creator/*`                                                       | 仪表盘、身份认证、选择产品、提交视频        |
| 商家中心   | `/products`, `/products/upload`, `/promotions`, `/promotions/[id]` | 我的产品、发布产品、我的推广、任务详情      |
| 产品详情   | `/products/[id]`                                                   | 创作者侧查看产品详情并加入推广              |
| 视频详情   | `/videos/[id]`                                                     | 视频/任务维度详情（与推广任务详情结构类似） |
| 消息       | `/messages`                                                        | 消息列表与发送                              |
| 帮助与法律 | `/help`, `/legal/privacy`, `/legal/terms`                          | 静态内容与链接                              |

---

## 二、功能模块拆解（按页面 / 路由）

### 2.1 落地页

- **路由**：`/`（`app/page.tsx`）、`/home`（`app/home/page.tsx`）。
- **页面目的**：展示产品 slogan、案例区（推广墙）、上传产品 CTA。
- **用户可完成的操作**：
  - 点击「上传产品」：若未登录 → `/auth/login`；若已登录 → `/products/upload`。
  - 横向拖拽/滑动案例区（鼠标按下移动）。
  - 案例区卡片可点击跳转（当前代码中有一处 `href={/products/${testimonial.id}}`，即跳转到产品详情）。
- **核心状态**：
  - `isLoggedIn`（useState，默认 false，仅本页使用，不持久化）；
  - `isDragging`、`startX`、`scrollLeft`（轮播拖拽）；
  - `showCarouselNav`、`showUserMenu`、`showNotifications`、`notifications`（来自 LandingPageContent）。
- **数据来源**：`lib/landing-data.ts` 的 `landingTestimonials`；组件内通过 `useMemo` 注入 `TrendingUp` 图标生成 `testimonialsWithIcon`（派生数据）。
- **跳转与依赖**：依赖 `AppHeader`、`LandingPageContent`；可跳转至 `/auth/login`、`/products/upload`、`/products/[id]`、`/legal/privacy`、`/legal/terms`。

---

### 2.2 认证

#### 2.2.1 `/auth/login`

- **目的**：邮箱登录入口。
- **操作**：输入邮箱并提交 → 跳转 `/auth/verify-email?email=xxx`；关闭 → `/`；底部链接到 `/auth/register`。
- **状态**：`email`（useState）。
- **数据**：无接口；提交仅做前端跳转并 `console.log`。

#### 2.2.2 `/auth/verify-email`

- **目的**：输入 6 位数字验证码完成「验证」。
- **操作**：输入/粘贴验证码，满 6 位自动调用验证 → 成功则 `router.push("/auth/role")`；更换邮箱 → `/auth/login`；关闭 → `/`；重发验证码（42 秒倒计时结束后可点）。
- **状态**：`code`（6 位数组）、`resendTimer`（倒计时）、`inputRefs`。
- **数据**：`email` 来自 URL `searchParams.get("email")`；验证逻辑仅前端跳转，无后端校验。
- **不确定点**：验证是否成功仅由前端决定（当前实现为输入满 6 位即跳转角色页）。

#### 2.2.3 `/auth/role`

- **目的**：选择身份（博主/创作者 或 投流者/开发者）。
- **操作**：选「博主/创作者」→ `window.location.href = "/creator/verification"`；选「投流者/开发者」→ `window.location.href = "/products/upload"`。
- **状态**：`selectedRole`（用于 UI，跳转由点击直接触发）。
- **跳转**：底部「返回」链向 `/auth/login`。

#### 2.2.4 `/auth/register`

- **目的**：注册入口。
- **操作**：邮箱+密码提交或 Google 注册 → `router.push("/auth/role")`；底部链接到 `/auth/login`。
- **状态**：`email`、`password`、`showPassword`。
- **数据**：无接口；仅前端跳转与 console。

#### 2.2.5 `/auth/forgot-password`

- **目的**：忘记密码表单（手机/邮箱切换）。
- **操作**：选择手机或邮箱、填写号码/邮箱、获取验证码、新密码+确认密码提交；提交后仅 `console.log` 与可选 `alert("密码不匹配")`，**无跳转、无接口**。
- **状态**：`method`、`countryCode`、`phoneNumber`、`email`、`verificationCode`、`newPassword`、`confirmPassword`。
- **跳转**：页内链接到 `/`、`/auth/login`。

---

### 2.3 创作者中心

#### 2.3.1 `/creator/verification`

- **目的**：创作者身份认证（上传证明材料）。
- **操作**：上传图片（点击选择或拖拽），点击提交 → `setTimeout` 后 `window.location.href = "/creator/products"`。
- **状态**：`uploadedImage`（DataURL）、`isSubmitting`、`isDragging`、横向滚动相关 state。
- **数据**：图片仅存于本地 state，无上传接口。

#### 2.3.2 `/creator/products`

- **目的**：创作者侧「待推广项目」列表，选择要接的产品。
- **操作**：点击产品卡片 → 进入 `/products/[id]`。
- **状态**：无本地编辑状态；列表为页面内 Mock 数组。
- **数据**：`products` 为页面内常量数组（4 条），与商家侧「我的产品」列表结构相似但无 `status` 字段。
- **不确定点**：与 `/products`（商家）的列表是否应为同一数据源，当前为各自独立 Mock。

#### 2.3.3 `/products/[id]`（创作者视角下的产品详情）

- **目的**：查看产品详情、选择档期、加入推广。
- **操作**：展开/收起描述、切换视频/截图、左右滚动文档与截图、选择日历日期、点击「加入推广」（未选日期有抖动/边框闪烁提示）、下载资料（假下载）、加入成功后约 1.5s 跳转 `/promotions`。
- **状态**：全部由 `useProductDetail` 管理：`isDescriptionExpanded`、`isAddingToPromotions`、`addedToPromotions`、`activeMediaType`、`activeScreenshot`、`showCalendar`、`selectedDate`、`calendarMonth`、`isBorderBlinking`、`isTextShaking` 及多个 ref。
- **数据**：
  - **源数据**：`lib/product-data.ts` 的 `productData`（单条 Mock），以及 `progressSteps`。
  - **不确定点**：路由参数 `params.id` 未参与数据拉取，所有访问均显示同一条 `productData`。
- **派生**：日历数据由 `generateCalendarDays(calendarMonth)` 生成；下载为前端构造 `<a download>` 指向 mock URL，无真实文件。
- **跳转**：加入推广成功 → `/promotions`。

#### 2.3.4 `/creator/videos/new`

- **目的**：提交视频（多条目：封面图 + 视频链接）。
- **操作**：每条可上传封面图、填写视频链接；链接校验（URL 或 www 格式）；支持粘贴图片到当前焦点条目；删除条目；提交 → `router.push("/creator/dashboard")`。
- **状态**：`videoItems`（数组，每项含 id、imageUrl、videoLink、linkError、linkSubmitted）、`focusedItemId`；`productData` 为页面内 Mock（名称、logo、标签）。
- **数据**：产品信息与校验规则均在前端；无提交接口。
- **跳转**：提交后仅跳转创作者仪表盘；`/submit-video` 在 next 配置中 301 重定向到本页。

#### 2.3.5 `/creator/dashboard`

- **目的**：创作者仪表盘，展示视频项目与汇总数据。
- **操作**：切换「质量」筛选、悬停统计/视频卡片查看对应指标。
- **状态**：`selectedQuality`、`hoveredStat`、`hoveredVideo`；`videoProjects` 为页面内 Mock（2 条）。
- **数据**：`totalMetrics`、`currentMetrics`、`stats` 均由 `videoProjects` 在前端 useMemo 派生。
- **跳转**：页面内链接可到推广任务等（由 Breadcrumb 等组成，具体见导航组件）。

---

### 2.4 商家中心

#### 2.4.1 `/products`（我的产品）

- **目的**：商家「我的产品」列表，带状态标签。
- **操作**：点击卡片 → `/promotions/[product.id]`（任务详情，非产品详情）。
- **状态**：无表单状态；列表与状态配置为页面内常量。
- **数据**：`products` 为页面内数组（6 条，含 status：matching/confirmed/published/observing/ended），`statusConfig` 为标签样式映射。

#### 2.4.2 `/products/upload`（发布产品）

- **目的**：填写产品信息、素材、档期、激励、联系方式并「发布」。
- **操作**：
  - 表单：产品名、描述、链接、标签（预设+自定义）、文档描述、上传文件/图片视频、日历选期、激励金额与阶梯、联系人、协议勾选等。
  - 校验：联系人姓名/邮箱/电话、激励金额、产品链接等（见 `upload-form-validation.ts`）。
  - 发布：通过校验后模拟提交，约 1.5s 后 `router.push("/products")`。
  - 其他：AI 生成描述（Mock 文案）、评分弹窗（基于条件计算 88 分）、横向滚动文档/截图/文件区。
- **状态**：全部在 `useUploadForm` 中（数十个 useState/ref），包括表单字段、上传列表、日历、标签、校验错误、评分弹窗等。
- **数据**：
  - **源数据**：`app/products/upload/lib/upload-mock-data.ts` 的 `productData`、`aiGeneratedDescriptionText`；校验规则来自 `upload-form-validation.ts`；日历工具来自 `upload-calendar-utils.ts`。
  - 初始部分字段（如联系人、文档描述、激励阶梯）从 `productData` 初始化，其余为用户输入或上传（上传仅存于本地 state，无接口）。
- **派生**：产品评分由 useEffect 根据 logo、链接、描述、媒体是否存在计算（当前实现中条件分支仍置为 88）；日历、滚动为工具函数/ref 操作。

#### 2.4.3 `/promotions`（我的推广）

- **目的**：查看「待发布」与「已发布」推广任务。
- **操作**：Tab 切换待发布/已发布；点击待发布卡片内「去发布」→ `/submit-video?projectId=...`（经 next 重定向到 `/creator/videos/new`）；点击已发布卡片 → `/creator/dashboard`。
- **状态**：`activeTab`（"pending" | "published"）；列表为页面内 Mock。
- **数据**：`pendingProjects`、`publishedProjects` 为页面内常量；无接口。

#### 2.4.4 `/promotions/[id]`（推广任务详情）

- **目的**：查看单条推广任务的进度、视频列表与 Reddit 风格数据。
- **操作**：仅展示；进度条与状态由 URL `status` 参数驱动。
- **状态**：`id` 来自 `useParams()`；`status` 来自 `searchParams.get("status")`；`isSubmitted = status === "submitted"` 影响进度与文案。
- **数据**：`videos`、`redditData` 为页面内 Mock；进度百分比由 `isSubmitted` 推导（0.5 或 0.75）。
- **不确定点**：`id` 未用于请求不同数据，列表与详情可能为静态 Mock。

---

### 2.5 视频详情 `/videos/[id]`

- **目的**：与推广任务详情结构类似的「视频维度」详情页。
- **操作**：仅展示。
- **状态**：同 `/promotions/[id]`，`id` 与 `status`（searchParams）决定展示；`performanceLevel` 等为常量。
- **数据**：`videos`、`redditData` 为页面内 Mock，与 `product-details-content` 中结构一致。
- **不确定点**：与 `/promotions/[id]` 是否为同一业务的不同入口，当前代码为两套相似 Mock。

---

### 2.6 消息中心 `/messages`

- **目的**：站内消息列表与发送。
- **操作**：输入文本、选择附件、发送；发送后新消息追加到本地 state，清空输入与附件。
- **状态**：`message`、`files`、`messages`（数组，含初始 Mock 3 条）、`showSettingsModal`。
- **数据**：初始 `messages` 为页面内 Mock；发送仅更新本地 state，无接口。
- **数据流**：新消息由 `handleSendMessage` 生成对象（id、type、avatar、text、time、files）并 `setMessages([...messages, newMessage])`。

---

### 2.7 帮助中心 `/help`

- **目的**：展示帮助内容与链接。
- **实现**：服务端页面包裹 `Suspense`，实际内容在 `client-component.tsx`；含 FAQ、链接列表、邮件链接等。
- **状态**：以客户端组件内本地 state 为主（若有）。
- **数据**：链接与文案为前端写死或常量。

---

### 2.8 法律页 `/legal/privacy`、`/legal/terms`

- **目的**：隐私政策与服务条款静态页。
- **操作**：阅读；页内链接到首页、登录、邮件等。
- **数据**：纯静态文案，无接口、无列表。

---

### 2.9 全局布局与导航

- **根布局**：`app/layout.tsx` 使用 `SettingsProvider`、全局样式、Analytics；不直接渲染 `AppHeader`，由各页自行引入。
- **AppHeader**：
  - 首页（`pathname === "/"`）渲染 `HomeHeader`；非首页渲染 `PageHeader`（面包屑由 pathname 生成）。
  - 用户菜单：设置、留言（`/messages`）、帮助（`/help`）、退出登录（`router.push("/auth/login")`）。
  - 通知：硬编码 `notifications` 数组，未读数量角标；无接口。
  - 设置弹窗：账户（个人资料、邮箱、密码、二次验证）、账单（套餐、支付方式、账单历史）；保存/修改密码等均为 `setTimeout` 模拟，无接口；个人资料为本地 state（profileName、profileEmail 等）。
- **面包屑**：`lib/breadcrumb-config.ts` 的 `breadcrumbMap` 与 `getBreadcrumbs` 为部分页面提供配置；未使用的页面由 `app-header` / `page-header` 内 `generateBreadcrumb(pathname)` 按路径段生成。
- **补充**：`SettingsProvider` 由根 layout 包裹，仅被 `components/home-header.tsx` 通过 `useSettings()` 消费，用于**首页**用户菜单中的设置弹窗；非首页使用 `PageHeader`，未发现对 `useSettings` 的调用，设置弹窗状态由各组件自维护。

---

## 三、关键业务流程

### 3.1 访客 → 上传产品（未登录）

1. 访问 `/` 或 `/home`。
2. 点击「上传产品」→ 因 `isLoggedIn === false` 跳转 `/auth/login`。
3. 输入邮箱提交 → 跳转 `/auth/verify-email?email=xxx`。
4. 输入 6 位验证码 → 自动跳转 `/auth/role`。
5. 选择「投流者/开发者」→ 全页跳转 `/products/upload`。

- **数据变化**：仅 URL 与各页本地 state；无持久化登录态，刷新后 `isLoggedIn` 仍为 false。

### 3.2 访客 → 上传产品（已登录）

1. 在首页将 `isLoggedIn` 视为 true（需手动改代码或未来接真实登录）时点击「上传产品」。
2. 直接 `router.push("/products/upload")`。

- **数据变化**：仅前端路由；上传页表单数据来自 Mock 初始值 + 用户输入，提交后跳转 `/products`。

### 3.3 创作者：从认证到加入推广

1. 登录/验证后到 `/auth/role`，选「博主/创作者」→ `/creator/verification`。
2. 上传认证图并提交 → 全页跳转 `/creator/products`。
3. 在列表点击某产品 → `/products/[id]`。
4. 在产品详情页选日历日期，点击「加入推广」→ 约 0.8s 后 `addedToPromotions = true`，再约 1.5s 后 `router.push("/promotions")`。

- **数据变化**：认证图仅在 verification 页 state；产品详情页 `productData` 来自 `lib/product-data.ts`，不随 `[id]` 变化；加入推广无接口，仅本地 state 与跳转。

### 3.4 商家：发布产品到查看推广

1. 从角色页选「投流者/开发者」→ `/products/upload`，或从首页（已登录）进入。
2. 填写/上传表单，勾选协议，点击发布；校验通过后模拟提交 → 约 1.5s 后 `router.push("/products")`。
3. 在「我的产品」点击某产品卡片 → `/promotions/[id]`。
4. 在「我的推广」切换待发布/已发布；待发布点击「去发布」→ 重定向到 `/creator/videos/new`；已发布点击卡片 → `/creator/dashboard`。

- **数据变化**：上传页所有内容均为前端 state + Mock；`/products` 与 `/promotions` 列表为页面内 Mock；无持久化存储。

### 3.5 同步与「依赖后端」的边界

- **当前全部为前端同步行为**：
  - 路由跳转、表单校验、本地 state 更新、Mock 数据展示、模拟延迟（setTimeout）、假下载（创建 a 标签）、评分与进度计算，均在前端完成。
- **无真实后端依赖**：
  - 登录/验证/注册/忘记密码/设置/消息发送/上传文件/发布产品/加入推广等，均未调用接口；仅 console.log 或 state 更新 + 跳转。
- 因此，**「依赖后端」** 在当前实现中可理解为：若未来要持久化或校验，这些操作都需要后端接口；当前代码中没有任何一处真正依赖后端响应。

---

## 四、数据流说明

### 4.1 数据从哪里来

| 数据类型           | 来源                                                   | 说明                                                                                        |
| ------------------ | ------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| 首页案例/评价      | `lib/landing-data.ts`                                  | `landingTestimonials` 只读数组；组件内注入 icon 得到派生列表。                              |
| 产品详情（单条）   | `lib/product-data.ts`                                  | `productData`、`progressSteps`；被 `/products/[id]` 使用；**未按 id 区分**。                |
| 产品上传初始/ Mock | `app/products/upload/lib/upload-mock-data.ts`          | `productData`、`aiGeneratedDescriptionText`；被 `useUploadForm` 引用做初始值与「AI 描述」。 |
| 创作者待推广列表   | `app/creator/products/page.tsx` 内联数组               | 4 条产品，无 status。                                                                       |
| 商家我的产品列表   | `app/products/page.tsx` 内联数组                       | 6 条产品，含 status；与创作者列表结构略同但独立。                                           |
| 我的推广列表       | `app/promotions/page.tsx` 内联数组                     | `pendingProjects`、`publishedProjects`。                                                    |
| 推广任务详情       | `app/promotions/[id]/product-details-content.tsx` 内联 | `videos`、`redditData`；进度由 URL `status` 推导。                                          |
| 视频详情           | `app/videos/[id]/page.tsx` 内联                        | 与推广任务详情类似的 `videos`、`redditData`。                                               |
| 创作者仪表盘       | `app/creator/dashboard/page.tsx` 内联                  | `videoProjects`（2 条）；汇总由 useMemo 派生。                                              |
| 提交视频页产品信息 | `app/creator/videos/new/page.tsx` 内联                 | `productData` 小对象（id、name、logoUrl、tags）。                                           |
| 消息列表           | `app/messages/page.tsx` 内 state                       | 初始 3 条 Mock；后续由发送追加。                                                            |
| 通知/用户资料      | `components/app-header.tsx` 内                         | 通知为硬编码数组；用户名为「张明」、邮箱等为 state，设置弹窗内修改仅改本地 state。          |

**结论**：所有业务数据均为 **前端 Mock 或页面内常量**；无 API、无环境变量请求地址。

### 4.2 数据在组件之间的传递

- **页面 → 子组件**：
  - `/products/[id]`：`productData`（来自 lib）与 `detail`（useProductDetail 返回值）以 props 传入 `ProductDetailContent`，再下传到 `ProductHeroCard`、`ProductIncentiveCard`、`ProductContactCard` 等。
  - `/products/upload`：`form`（useUploadForm 返回值）整体传入 `UploadPageContent`，再下传到 `UploadHeroCard`、`UploadSidebar` 及各卡片组件。
- **同页多组件**：通过共同的父级 state 或 hook 返回值（如 `form`、`detail`）向下传递，无全局 store；登录态 `isLoggedIn` 仅存在于首页 `LandingPageContent`，未注入 Header 或其它页。
- **跨页**：
  - 仅通过 **URL** 传递：如 `email`（verify-email）、`status`（promotions/[id]、videos/[id]）；
  - 无 React 全局状态、无 localStorage/sessionStorage 业务数据、无服务端 session 的代码体现。

### 4.3 源数据与派生数据

- **源数据（只读，驱动展示）**：
  - `lib/landing-data.ts`、`lib/product-data.ts`、`upload-mock-data.ts` 中的导出常量；
  - 各页面内定义的 `products`、`pendingProjects`、`publishedProjects`、`videoProjects`、`videos`、`redditData`、`messages` 初始值等。
- **派生数据**：
  - 首页：`testimonialsWithIcon`（landingTestimonials + icon）；
  - 产品详情：`calendar` = `generateCalendarDays(calendarMonth)`；
  - 上传页：评分 `productScore` 由 useEffect 根据表单条件计算；校验错误由校验函数 + 当前字段值得到；
  - 创作者仪表盘：`totalMetrics`、`currentMetrics`、`stats` 由 `videoProjects` 聚合/选中的 useMemo 结果。
- **用户产生数据**：仅存于当前页或当前会话的 state（表单输入、上传的本地 URL、选中的日期、发送的消息等），不写入后端、不跨页持久化。

### 4.4 影响多个页面的数据

- **路由参数与查询**：
  - `params.id`：`/products/[id]`、`/promotions/[id]`、`/videos/[id]`；当前仅用于展示或与 Mock 混用，**未用于按 id 请求不同数据**。
  - `searchParams`：`email`（verify-email）、`status`（promotions/[id]、videos/[id]）影响文案与进度展示。
- **共享 UI 状态**：
  - `AppHeader` 内的通知、用户菜单、设置弹窗、个人资料/密码等，仅影响本组件树，刷新即重置；
  - `SettingsProvider` 的 context 与 AppHeader 内 state 的关系见上文「不确定点」。
- **无跨页共享的业务实体**：例如「当前登录用户」「当前产品列表」等均未通过全局状态或接口在多页间同步；各页列表与详情均为本地/Mock，彼此不一致亦可出现。

---

## 五、不确定点汇总

1. **产品详情 `/products/[id]`**：未使用 `params.id` 拉取数据，所有 id 均展示同一份 `productData`；是否按 id 区分需后端与产品约定。
2. **推广/视频详情 `/promotions/[id]`、`/videos/[id]`**：`id` 未参与请求，列表与详情为静态 Mock；与「我的产品」点击进入的 id 对应关系未实现。
3. **登录态**：首页 `isLoggedIn` 为本地 state 且默认 false，与 Header 用户信息无联动；退出登录仅跳转登录页，未清空服务端会话（因无后端）。
4. **设置弹窗**：已确认 `SettingsProvider` 仅被首页 `HomeHeader` 消费；非首页 `PageHeader` 未使用 context，设置弹窗状态为组件内 state。
5. **创作者列表 vs 商家列表**：`/creator/products` 与 `/products` 的列表结构相似但独立 Mock；是否应对齐为同一数据源需产品/后端约定。
6. **`/promotions/[id]` 与 `/videos/[id]`**：两页结构和 Mock 高度相似，是同一业务两种入口还是不同业务，当前代码无法区分，需产品说明。

---

**文档结束**。后端与 AI Agent 可据此理解当前前端的页面边界、状态来源、跳转关系与数据流，并据此设计接口与联调方案。
