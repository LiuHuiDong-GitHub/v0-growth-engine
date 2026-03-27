# 工程级精简与结构重构 — 步骤 1：分析报告（不修改代码）

本文档仅做现状分析与重构边界界定，**不包含任何代码修改**。后续步骤（文件拆分、去重、规范）将严格以此边界为准。

---

## 一、页面行数与职责概览

| 路由                                       | 行数     | 目标 | 状态        |
| ------------------------------------------ | -------- | ---- | ----------- |
| `app/products/upload/page.tsx`             | **2067** | ≤200 | 🔴 严重超标 |
| `app/page.tsx`                             | 752      | ≤200 | 🔴 超标     |
| `app/home/page.tsx`                        | 752      | ≤200 | 🔴 超标     |
| `app/creator/dashboard/page.tsx`           | 478      | ≤200 | 🔴 超标     |
| `app/creator/verification/page.tsx`        | 408      | ≤200 | 🔴 超标     |
| `app/creator/videos/new/page.tsx`          | 339      | ≤200 | 🔴 超标     |
| `app/legal/privacy/page.tsx`               | 297      | ≤200 | 🔴 超标     |
| `app/messages/page.tsx`                    | 259      | ≤200 | 🟡 略超     |
| `app/videos/[id]/page.tsx`                 | 259      | ≤200 | 🟡 略超     |
| `app/legal/terms/page.tsx`                 | 204      | ≤200 | 🟡 略超     |
| `app/promotions/page.tsx`                  | 201      | ≤200 | 🟢 临界     |
| `app/auth/verify-email/page.tsx`           | 177      | ≤200 | 🟢 合规     |
| `app/auth/forgot-password/page.tsx`        | 180      | ≤200 | 🟢 合规     |
| `app/auth/login/page.tsx`                  | 149      | ≤200 | 🟢 合规     |
| `app/auth/register/page.tsx`               | 137      | ≤200 | 🟢 合规     |
| `app/products/page.tsx`                    | 139      | ≤200 | 🟢 合规     |
| `app/creator/products/page.tsx`            | 98       | ≤200 | 🟢 合规     |
| `app/auth/role/page.tsx`                   | 93       | ≤200 | 🟢 合规     |
| `app/products/[id]/page.tsx`               | 30       | ≤200 | 🟢 已重构   |
| 其余 promotions/[id]、videos/[id]、help 等 | ≤31      | ≤200 | 🟢 合规     |

---

## 二、结构性问题（按任务要求的 7 类）

### 1. 页面级组件职责过载（页面文件过大、逻辑混杂）

- **app/products/upload/page.tsx（2067 行）**
  - 单文件内包含：Mock 数据（productData、progressSteps、presetTags、scoreBreakdown）、30+ useState、10+ useRef、多个 useEffect、表单校验函数、日历工具函数、滚动处理、文件/媒体上传、标签 CRUD、产品评分与弹窗、整页 JSX（主卡片 + 侧栏激励卡/联系卡/评分卡）。
  - 职责混杂：数据、状态、副作用、UI、样式 keyframes 全在一处，违反「页面只负责数据获取、状态编排、子组件组合」。

- **app/page.tsx / app/home/page.tsx（各 752 行）**
  - 首页与 /home 内容高度重复（testimonials、轮播、登录态、导航等），且单文件内含大量内联 Mock 数据与整页 JSX，未拆分为容器 + 展示组件。

- **app/creator/dashboard/page.tsx（478 行）**
  - 仪表盘：videoProjects Mock、totalMetrics/currentMetrics 的 useMemo、stats 配置、整页布局与卡片 JSX 混在同一文件。

- **app/creator/verification/page.tsx（408 行）**
  - 认证上传页 + 底部「最新待推广项目」横向滚动列表（含 7 个 Mock 卡片），逻辑与长列表 UI 未拆分。

- **app/creator/videos/new/page.tsx（339 行）**
  - 提交视频页：表单状态、上传、校验与整页 UI 混在一起。

- **app/legal/privacy、app/messages、app/videos/[id] 等**
  - 行数在 200–300 之间，多为单页内「状态 + 整块 JSX」，缺少「page 薄层 + 内容组件」的拆分。

### 2. 大量可派生 state 被错误地存为 state

- **products/upload/page.tsx**
  - `productScore`：由 logoFile、productLink、documentDescription、uploadedMedia 决定，当前用 useEffect 写入 setState，应改为 **派生值**（useMemo 或直接计算），不单独存 state。
  - `shouldShowScore`：由 `productScore !== null` 得到，应直接派生，不存 state。
  - `linkInputWidth`：由 productLink 与 DOM 测量得到，当前在 useEffect 里 setState，易造成多余渲染；若保留测量，应限制在测量逻辑内或使用 callback ref，避免「可派生宽度」作为独立 state 驱动整组件。

- **creator/dashboard**
  - `currentMetrics`：已用 useMemo 从 hoveredVideo + totalMetrics 派生，此处合理；需注意 totalMetrics 依赖 videoProjects 不变时未写依赖项（目前 useMemo 依赖 []），若后续 videoProjects 来自 props/API 需补全依赖。

- **auth/verify-email**
  - `resendTimer` 为真实倒计时，保留 state 合理；code 为受控输入，合理。

### 3. useEffect 被用于非副作用逻辑

- **products/upload/page.tsx**
  - **Score 计算**（约 339–352 行）：根据 logoFile、productLink、documentDescription、uploadedMedia 计算 score 并 setProductScore。这是 **纯同步派生逻辑**，应改为 useMemo（或函数计算），不应使用 useEffect。
  - **linkInputWidth**（约 368–372 行）：依赖 productLink 的 DOM 测量，属于「布局测量」类副作用，可保留 useEffect，但需注意与「可派生」的区分：宽度若仅用于单处 input，可考虑 callback ref 或 ResizeObserver 减少对 state 的依赖。
  - **点击外部关闭**（约 334–366 行）：真正的副作用（document 事件监听），保留 useEffect 合理。
  - **清理 timeout**（约 322–328 行）：清理 hideTimeoutRef，合理。

- **auth/verify-email**
  - 倒计时：setInterval/setTimeout 属于副作用，保留 useEffect 合理。
  - 首格 focus：DOM 焦点属于副作用，合理。

### 4. 重复 UI 与重复业务逻辑未抽象

- **首页与 /home**
  - `app/page.tsx` 与 `app/home/page.tsx` 行数、结构、testimonials、轮播、登录态处理高度一致，存在 **整页级重复**，应视为同一内容的不同路由，共享同一套「容器 + 展示组件」与数据源。

- **products/upload**
  - **滚动逻辑**：scrollDocuments、scrollScreenshots、scrollFiles 三者均为「ref.current.scrollBy({ left: ±200, behavior: "smooth" })」，仅 ref 不同，可抽象为通用 `useScrollHorizontal(ref, amount)` 或单函数接受 ref 与 direction。
  - **日历逻辑**：generateCalendarDays、isPastDate、getTodayDay、isCurrentMonth、handleSelectDate 等与 `app/products/[id]` 下已有 product-calendar 工具/组件类似，可考虑共享 lib 或组件，避免两处各自实现。
  - **校验函数**：validateContactName、validateEmail、validatePhone、validateBaseReward、validateProductLink 等可抽到独立模块（如 `lib/upload-form-validation.ts`），便于复用与单测。

- **creator/verification**
  - 底部「最新待推广项目」卡片列表与 creator/products、promotions 等列表卡片在 UI 形态上相似，可评估是否复用「推广卡片」展示组件（仅做结构复用，不改变现有 UI 与交互）。

### 5. 组件形式上抽象但接口臃肿、语义不清

- **products/upload**
  - 整页尚未拆出子组件，当前是单一大组件，不存在「已抽象但接口臃肿」的组件；拆分后需注意：新增的展示组件应 **props 最小化、语义清晰**（例如「激励卡」只收激励相关数据与回调，不收整页 state）。

- **app-header、page-header、home-header 等**
  - 未在本阶段逐行审计，若后续拆首页/创作者页时涉及 header，需检查是否传入过多 props 或通过 props 透传整块配置对象；若有，应收敛为「角色/场景」等少量语义化 props。

### 6. AI vibe coding 导致的冗余判断、冗余中间变量

- **products/upload**
  - Score 的 useEffect 内：`condition1 || condition2` 分支里与 else 分支都执行了 `setProductScore(88)`，逻辑重复且未体现「条件不同则分数不同」的语义，疑似占位逻辑；重构时保留相同行为即可，可改为单一派生值。
  - `getTextFontSize()` 等工具函数放在组件内，每次渲染都会重新创建；若拆分到 lib 或组件外，可减少噪音。
  - 多处 `validationErrors.xxx ? "border-red-500 bg-red-50" : "border-slate-300"` 等重复 className 片段，可抽成小工具或常量，避免散落。

- **creator/verification**
  - 「最新待推广项目」的 7 个卡片为内联数组，可抽成常量或 Mock 数据文件，便于后续替换为 API。

### 7. 文件结构不符合长期维护工程的直觉

- **app 目录**
  - 按路由划分清晰（auth、creator、products、promotions、videos、legal、messages、help），无大问题。
  - **products/upload**：仅有一个巨型 page.tsx，无同级 components、hooks、lib；与 **products/[id]** 已具备 components、hooks、product-detail-styles 等形成对比，建议 upload 也采用「page + 子目录 components/hooks + 共享 lib」结构。
  - **首页**：`app/page.tsx` 与 `app/home/page.tsx` 若共享一套逻辑，可考虑 `app/(marketing)/page.tsx` 与 `app/(marketing)/home/page.tsx` 共用 layout 与共享组件目录（如 `app/(marketing)/_components/`），避免两处拷贝。

- **共享能力**
  - 表单校验、日历工具、滚动行为等分散在各自页面，尚未形成统一的 `lib/` 或 `hooks/` 复用层，不利于后续对接后端与多页一致行为。

---

## 三、高风险区域（重构时不可改变行为）

以下区域在拆分/抽离时必须 **保持对外可观察行为一致**（UI、DOM 结构、className、交互顺序、接口调用时机与参数、状态表现）：

1. **products/upload**
   - 发布按钮：未选日期时的「边框闪烁 + 文字抖动」动画与 1500/1200ms 的时序；选择日期后的「发布中」→「已发布」→ 1.5s 后跳转 /products 的流程。
   - 产品评分卡：hover 显示/隐藏弹窗、延迟 500ms 隐藏、弹窗左右位置（根据卡片相对视口居中判断）、移动端与桌面端布局差异。
   - 表单校验：contactName、contactEmail、contactPhone、baseReward、productLink 的校验时机（onChange/onBlur）与文案、PhoneInput 的集成方式。
   - 标签：预设标签列表、自定义标签、下拉开关与点击外部关闭行为。
   - 日历：月份切换、禁用过去日期、今天/清空按钮、选中日期与「请选择」的抖动提示。
   - 文件/媒体上传：多文件、删除、下载已上传文件、媒体切换与 activeMediaIndex 的联动。
   - AI 生成描述：2s 延迟与填充的文案内容。
   - 所有 Mock 数据结构与默认值（productData.contact、incentive、progressSteps 等）在替换为 API 前不得改变字段含义与使用处。

2. **首页 / home**
   - 轮播的拖拽与左右按钮、卡片内容与跳转链接、登录态下的入口展示与点击跳转。
   - testimonials 数据与展示顺序、样式（含字体变量等）。

3. **creator/dashboard**
   - 统计卡 hover 切换「单视频指标 / 汇总指标」的时机与展示内容、视频卡片列表与进度条展示。

4. **creator/verification**
   - 上传区拖拽/点击、提交后 1s 跳转 /creator/products、「最新待推广项目」的滚动与「查看详情」跳转 /products/1。

5. **auth 系列**
   - 登录 → 验证邮箱 → 选择角色 的流程与跳转；忘记密码的表单切换（手机/邮箱）与校验；验证邮箱的 6 位码、倒计时、重新发送与跳转。

6. **legal/privacy、legal/terms、messages、videos/[id] 等**
   - 当前无接口调用，重构仅做「拆组件/抽数据」时，不得改变文案、段落结构、链接与样式类名。

---

## 四、重构边界（允许与禁止）

### 允许

- 将页面拆成：**page（薄层） + 容器组件 + 展示组件**，page 只做数据/状态编排与组合。
- 将 **可派生 state** 改为 useMemo 或直接计算，删除对应的 useState 与「仅用于派生」的 useEffect。
- 将 **纯同步派生逻辑** 从 useEffect 中移出，改为 useMemo 或普通函数。
- 抽取 **重复逻辑**（滚动、日历工具、校验函数）到 hooks 或 lib，调用处行为不变。
- 抽取 **重复 UI**（首页/home 共用、upload 内主卡/侧栏卡）为展示组件，props 最小化。
- 将 **Mock 数据、常量、预设标签** 等移出到 `lib/` 或 `constants/`，页面与组件仅引用。
- 将 **keyframes/全局样式** 从内联 `<style>` 抽到单独样式组件或 CSS 模块，保持类名与选择器效果一致。
- 文件与目录重命名、目录结构优化（如 `app/products/upload/components/`），不改变导出与路由。

### 禁止

- 新增或删除任何业务逻辑、校验规则、跳转目标、接口调用时机与参数。
- 改变 UI 视觉效果、DOM 结构、className 与样式作用方式。
- 改变交互顺序（如先选日期再发布）、条件（如未选日期时的提示方式）。
- 为「代码好看」调整执行逻辑或合并/拆分 state 导致表现不一致。
- 一次性全量重写单个文件；必须按「步骤 2 → 3 → 4」分步执行，且每步可验证行为不变。

---

## 五、建议的重构优先级（供步骤 2–4 参考）

1. **P0**：`app/products/upload/page.tsx` — 行数最多、派生 state 与 useEffect 误用明显、重复逻辑多；优先拆 page + 抽数据/校验/滚动/日历，再拆 UI 组件。
2. **P1**：`app/page.tsx` 与 `app/home/page.tsx` — 去重并共享组件与数据，使两个路由共用一个内容实现。
3. **P2**：`app/creator/dashboard`、`app/creator/verification`、`app/creator/videos/new` — 拆成 page + 子组件，Mock 数据与列表组件抽出。
4. **P3**：`app/legal/privacy`、`app/legal/terms`、`app/messages`、`app/videos/[id]` — 在保持展示与交互不变的前提下，做「page 薄层 + 内容组件」拆分与必要的数据/常量外提。

---

## 六、小结

- **当前最严重问题**：`products/upload` 单文件 2067 行、30+ state、useEffect 用于派生、大量重复逻辑与未拆分 UI；首页与 home 752 行且重复。
- **高风险点**：上传页的动画时序、评分弹窗行为、表单校验与 PhoneInput、日历与标签的交互；首页轮播与登录态；创作者认证提交与跳转。
- **重构边界**：仅做「职责拆分、派生替代 state、副作用收口、去重与抽离」，不改变任何对外可观察行为；禁止全量重写与擅自改逻辑/交互/接口。

完成步骤 2（文件与职责拆分）时，将从此文档的 P0 开始，按「只做拆分、不做逻辑修改」的原则执行。

---

## 步骤 3、4 执行记录（去重与规范）

### 步骤 3：去重与合并

- **首页与 /home**：抽取 `lib/landing-data.ts`（landingTestimonials），新建 `components/landing/landing-page-content.tsx` 共用内容（状态 + 轮播 + 展示），`app/page.tsx` 与 `app/home/page.tsx` 改为薄层（仅字体挂载 + `<LandingPageContent />`）。两页由 752 行 × 2 变为约 28 行 × 2 + 约 580 行共用组件 + 约 165 行数据。
- **产品上传页滚动**：在 `app/products/upload/lib/upload-utils.ts` 中新增 `scrollHorizontal(ref, direction, amount)`，hook 内 `scrollDocuments`、`scrollScreenshots`、`scrollFiles` 改为调用该工具，消除三处重复实现。

### 步骤 4：规范与性能整理

- **命名**：首页/Home 共用组件命名为 `LandingPageContent`，数据为 `landingTestimonials`；上传页保持 `upload-*`、`useUploadForm`、`UploadFormResult` 等已有命名。
- **memo / lazy**：未对上传页子组件或首页内容使用 `React.memo` 或 `lazy`，原因：上传页组件均接收 `form`（每轮新对象），memo 无效；懒加载可能改变首屏展示顺序，存在行为风险，故仅保留文档说明，不在此次引入。
