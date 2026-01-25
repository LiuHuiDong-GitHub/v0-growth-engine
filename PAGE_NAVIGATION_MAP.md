# GrowthEngine 项目页面导航关系总结

## 📋 项目概览

GrowthEngine 是一个创作者与商家连接的平台，包含两个主要角色系统：
- **创作者（Blogger）**：发布视频、选择推广产品、赚取收入
- **商家（Seller）**：发布产品、创建推广任务、跟踪推广数据

---

## 🔐 认证模块 (Auth Pages)

### 1. 登录前的路由流程

\`\`\`
/ (首页)
  ↓
/select-role (选择角色: 创作者 or 商家)
  ├─→ 选择创作者 → /blogger-dashboard
  └─→ 选择商家 → /my-product
\`\`\`

### 2. 注册与登录

- **路径导航**: `GrowthEngine / 登录`
- **路由**: `/login`
- **可跳转到**: 
  - `/register` - 注册
  - `/forgot-password` - 忘记密码
  - `/select-role` - 选择角色

- **路径导航**: `GrowthEngine / 注册`
- **路由**: `/register`
- **可跳转到**: 
  - `/login` - 返回登录

- **路径导航**: `GrowthEngine / 重置密码`
- **路由**: `/forgot-password`
- **可跳转到**: 
  - `/login` - 返回登录

---

## 👤 创作者中心模块 (Blogger Module)

### 核心路由流程

\`\`\`
/blogger-dashboard (创作者仪表盘)
  ├─→ /select-product (选择产品)
  │     └─→ /product/[id] (产品详情)
  │           └─→ /submit-video (提交视频)
  │                 └─→ /blogger-dashboard (返回仪表盘)
  ├─→ /submit-video (直接提交视频)
  │     └─→ /blogger-dashboard (返回仪表盘)
  ├─→ /blogger-video/[id] (查看已提交视频详情)
  │     └─→ /blogger-dashboard (返回仪表盘)
  └─→ /blogger-verification (身份认证)
        └─→ /blogger-dashboard (返回仪表盘)
\`\`\`

### 1. 创作者仪表盘
- **路径导航**: `GrowthEngine / 创作者中心`
- **路由**: `/blogger-dashboard`
- **功能**: 
  - 展示总体统计数据（总曝光、总点击、总收益等）
  - 展示已提交的视频列表
  - 悬停视频时显示该视频的统计数据
- **可跳转到**:
  - `/select-product` - 选择产品进行推广
  - `/submit-video` - 直接提交视频
  - `/blogger-video/[id]` - 查看视频详情
  - `/blogger-verification` - 进行身份认证
  - `/settings` - 用户设置
  - `/message-board` - 消息中心

### 2. 选择产品
- **路径导航**: `GrowthEngine / 创作者中心 / 选择产品`
- **路由**: `/select-product`
- **功能**: 浏览所有可推广的商家产品列表
- **可跳转到**:
  - `/product/[id]` - 查看产品详情
  - `/blogger-dashboard` - 返回仪表盘

### 3. 产品详情
- **路径导航**: `GrowthEngine / 创作者中心 / 选择产品 / 产品详情`
- **路由**: `/product/[id]`
- **功能**: 展示产品详细信息、评分、标签、推广规则
- **可跳转到**:
  - `/submit-video` - 为该产品提交推广视频
  - `/select-product` - 返回产品列表

### 4. 提交视频
- **路径导航**: `GrowthEngine / 创作者中心 / 提交视频`
- **路由**: `/submit-video`
- **功能**: 
  - 上传视频封面图片
  - 填写视频链接
  - 支持 Ctrl+V 粘贴截图
  - 管理多个视频项目
- **可跳转到**:
  - `/blogger-dashboard` - 提交完成后返回仪表盘

### 5. 视频详情
- **路径导航**: `GrowthEngine / 创作者中心 / 视频详情`
- **路由**: `/blogger-video/[id]`
- **功能**: 展示已提交视频的详细数据和推广效果
- **可跳转到**:
  - `/blogger-dashboard` - 返回仪表盘

### 6. 身份认证
- **路径导航**: `GrowthEngine / 创作者中心 / 身份认证`
- **路由**: `/blogger-verification`
- **功能**: 创作者身份验证流程
- **可跳转到**:
  - `/blogger-dashboard` - 认证完成后返回仪表盘

---

## 🏪 商家中心模块 (Seller Module)

### 核心路由流程

\`\`\`
/my-product (商家产品管理)
  ├─→ /upload-product (发布新产品)
  │     └─→ /my-product (返回产品列表)
  ├─→ /my-promotions (查看推广任务)
  │     └─→ /product-details/[id] (查看任务详情)
  │           └─→ /my-promotions (返回任务列表)
  └─→ /settings (用户设置)
\`\`\`

### 1. 我的产品
- **路径导航**: `GrowthEngine / 商家中心`
- **路由**: `/my-product`
- **功能**: 
  - 展示已发布的产品列表
  - 产品的评分、标签、推广数据
  - 产品管理操作
- **可跳转到**:
  - `/upload-product` - 发布新产品
  - `/my-promotions` - 查看推广任务
  - `/settings` - 用户设置
  - `/message-board` - 消息中心

### 2. 发布产品
- **路径导航**: `GrowthEngine / 商家中心 / 发布产品`
- **路由**: `/upload-product`
- **功能**: 
  - 上传产品logo和名称
  - 添加产品标签
  - 填写产品链接
  - 支持链接验证
- **可跳转到**:
  - `/my-product` - 发布完成后返回产品列表

### 3. 我的推广
- **路径导航**: `GrowthEngine / 商家中心 / 推广任务`
- **路由**: `/my-promotions`
- **功能**: 
  - 展示所有创建的推广任务
  - 显示推广任务的统计数据
  - 任务管理和编辑
- **可跳转到**:
  - `/product-details/[id]` - 查看任务详情
  - `/my-product` - 返回产品列表

### 4. 推广任务详情
- **路径导航**: `GrowthEngine / 商家中心 / 推广任务 / 任务详情`
- **路由**: `/product-details/[id]`
- **功能**: 
  - 展示推广任务的详细数据
  - 显示参与的创作者列表
  - 任务效果追踪
- **可跳转到**:
  - `/my-promotions` - 返回任务列表
  - `/my-product` - 返回产品列表

---

## 📝 其他模块

### 2. 消息中心
- **路径导航**: `GrowthEngine / 消息中心`
- **路由**: `/message-board`
- **功能**: 
  - 显示系统消息
  - 用户之间的沟通
  - 支持文件上传和截图粘贴
- **可跳转到**:
  - `/blogger-dashboard` 或 `/my-product` - 取决于用户角色

---

## 🔄 页面跳转关系总表

| 源页面 | 路由 | 可跳转目标 | 跳转触发 |
|--------|------|---------|---------|
| 首页 | `/` | `/select-role` | 进入应用 |
| 选择角色 | `/select-role` | `/blogger-dashboard` \| `/my-product` | 选择角色 |
| 登录 | `/login` | `/register` \| `/forgot-password` \| `/select-role` | 账户操作 |
| 注册 | `/register` | `/login` | 返回登录 |
| 重置密码 | `/forgot-password` | `/login` | 返回登录 |
| 创作者仪表盘 | `/blogger-dashboard` | `/select-product` \| `/submit-video` \| `/blogger-video/[id]` \| `/blogger-verification` \| `/settings` \| `/message-board` | 功能导航 |
| 选择产品 | `/select-product` | `/product/[id]` \| `/blogger-dashboard` | 产品浏览 |
| 产品详情 | `/product/[id]` | `/submit-video` \| `/select-product` | 推广选择 |
| 提交视频 | `/submit-video` | `/blogger-dashboard` | 提交完成 |
| 视频详情 | `/blogger-video/[id]` | `/blogger-dashboard` | 返回仪表盘 |
| 身份认证 | `/blogger-verification` | `/blogger-dashboard` | 认证完成 |
| 商家产品 | `/my-product` | `/upload-product` \| `/my-promotions` \| `/settings` \| `/message-board` | 功能导航 |
| 发布产品 | `/upload-product` | `/my-product` | 发布完成 |
| 推广任务 | `/my-promotions` | `/product-details/[id]` \| `/my-product` | 任务管理 |
| 任务详情 | `/product-details/[id]` | `/my-promotions` \| `/my-product` | 返回列表 |
| 消息中心 | `/message-board` | 根据用户角色 | 查看消息 |

---

## 📊 路径导航层级结构

### 第一层：平台根路径
\`\`\`
GrowthEngine
├─ 认证系统
├─ 创作者中心
├─ 商家中心
├─ 消息中心
└─ 设置
\`\`\`

### 第二层：模块级路径
\`\`\`
GrowthEngine / 创作者中心
├─ 选择产品
├─ 提交视频
├─ 身份认证
└─ （仪表盘本身）

GrowthEngine / 商家中心
├─ 发布产品
├─ 推广任务
└─ （产品管理本身）
\`\`\`

### 第三层：详情页路径
\`\`\`
GrowthEngine / 创作者中心 / 选择产品 / 产品详情
GrowthEngine / 商家中心 / 推广任务 / 任务详情
\`\`\`

---

## ✅ 路径导航规范检查清单

- [x] 所有页面都有清晰的路径导航
- [x] 路径层级关系准确无误
- [x] 当前页面为加粗字体（不可点击）
- [x] 上级页面都可点击返回
- [x] 没有路径层级跳跃
- [x] 动态路由 [id] 被正确处理
- [x] 两个独立模块（创作者/商家）有明确区分
- [x] 所有跳转触发条件明确标注
