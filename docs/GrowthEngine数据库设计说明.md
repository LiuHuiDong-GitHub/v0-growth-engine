# GrowthEngine 数据库设计说明

本文档基于《DATABASE_DATA_MODEL.md》数据模型，给出 Supabase（PostgreSQL）生产级表结构设计与可直接执行的 SQL 初始化脚本。

---

## 一、整体设计说明

### 1.1 数据库用途

- 支撑 **GrowthEngine** 前端与后端 API 的持久化存储。
- 核心业务：用户（创作者/商家）、认证验证码、通知、首页案例、产品与产品文档、推广任务与推广视频、消息与附件。
- 设计目标：与《前端数据契约 & 后端 API 接口规范》《BACKEND_API_SPEC.md》一一对应，不引入未使用字段或表。

### 1.2 设计原则

- **主键**：所有表使用 `uuid` 主键（`gen_random_uuid()`），便于分布式与 Supabase 生态一致。
- **时间**：统一使用 `timestamptz`，所有表包含 `created_at`、`updated_at`，其中 `updated_at` 由触发器自动维护。
- **状态字段**：使用 `text` + `CHECK` 约束，避免 PostgreSQL 枚举带来的迁移成本，同时保证取值明确。
- **外键**：显式声明 `REFERENCES`，并约定 `ON DELETE` / `ON UPDATE` 策略，便于数据一致性与级联行为可预期。
- **RLS**：所有表开启 Row Level Security（RLS），具体策略由后续按业务配置，本文仅启用 RLS 不写策略。

### 1.3 关键业务实体说明

| 实体                   | 说明                                                                                          |
| ---------------------- | --------------------------------------------------------------------------------------------- |
| **users**              | 用户账号；区分角色 `creator` / `merchant`；与 Supabase Auth 可对接（本表可作 profile 扩展）。 |
| **verification_codes** | 登录/忘记密码验证码；按 email 校验、一次性使用、过期清理。                                    |
| **notifications**      | 站内通知，按 user_id 归属。                                                                   |
| **products**           | 商家发布的产品；status 控制「我的产品」列表展示与待推广筛选。                                 |
| **promotions**         | 推广任务；关联 product 与 creator，status 区分待发布/已发布等。                               |
| **promotion_videos**   | 推广任务下的视频；支撑详情页与创作者仪表盘。                                                  |
| **messages**           | 消息中心消息；type 区分 user/admin。                                                          |

---

## 二、表结构总览

| 表名                  | 说明     | 主要用途                                 |
| --------------------- | -------- | ---------------------------------------- |
| `users`               | 用户账号 | 登录态、Header 信息、产品/推广/消息归属  |
| `verification_codes`  | 验证码   | 登录发码、邮箱验证、忘记密码             |
| `notifications`       | 站内通知 | Header 铃铛列表与未读角标                |
| `testimonials`        | 首页案例 | 首页轮播、跳转产品（可选）               |
| `products`            | 产品     | 我的产品、产品详情、发布产品、待推广列表 |
| `product_documents`   | 产品资料 | 产品详情页资料列表与下载                 |
| `promotions`          | 推广任务 | 我的推广、推广详情、加入推广、提交视频   |
| `promotion_videos`    | 推广视频 | 推广详情视频、创作者仪表盘、提交视频     |
| `messages`            | 消息     | 消息中心列表与发送                       |
| `message_attachments` | 消息附件 | 消息附件展示与上传                       |

---

## 三、详细表设计

### 表：users

- **业务说明**：存储用户账号；name/email/avatar 供 Header 与设置弹窗；role 区分创作者与商家，用于「待推广产品列表」与「我的产品列表」的权限与数据筛选。
- **RLS**：该表需配置 RLS 策略，由后续完成（如：用户仅能读/更新自身行）。

| 字段名     | 类型        | 是否必填 | 说明                                 |
| ---------- | ----------- | -------- | ------------------------------------ |
| id         | uuid        | 是       | 主键，默认 gen_random_uuid()         |
| name       | text        | 否       | 显示名称                             |
| email      | text        | 是       | 登录标识，唯一                       |
| avatar_url | text        | 否       | 头像 URL                             |
| role       | text        | 否       | 枚举：creator / merchant，CHECK 约束 |
| created_at | timestamptz | 是       | 创建时间，默认 now()                 |
| updated_at | timestamptz | 是       | 更新时间，默认 now()，触发器维护     |

- **索引**：`UNIQUE (email)`；可选 `INDEX (role)`。
- **外键**：无。

---

### 表：verification_codes

- **业务说明**：存储登录/忘记密码验证码；校验后标记 used_at，过期记录可定时清理。
- **RLS**：该表需配置 RLS 策略，由后续完成（通常仅服务端写入与校验，可禁止客户端直接读）。

| 字段名     | 类型        | 是否必填 | 说明                               |
| ---------- | ----------- | -------- | ---------------------------------- |
| id         | uuid        | 是       | 主键                               |
| email      | text        | 是       | 接收验证码的邮箱                   |
| code       | text        | 是       | 验证码（如 6 位数字）              |
| purpose    | text        | 否       | login / password_reset，CHECK 约束 |
| expires_at | timestamptz | 是       | 过期时间                           |
| used_at    | timestamptz | 否       | 使用时间，非空表示已使用           |
| created_at | timestamptz | 是       | 创建时间                           |
| updated_at | timestamptz | 是       | 更新时间                           |

- **索引**：`INDEX (email, purpose)`、`INDEX (expires_at)`（便于清理与查询）。
- **外键**：无。

---

### 表：notifications

- **业务说明**：用户站内通知；Header 铃铛列表与未读角标，time 展示由 API 根据 created_at 计算。
- **RLS**：该表需配置 RLS 策略，由后续完成（用户仅能读/更新自己的通知）。

| 字段名     | 类型        | 是否必填 | 说明                    |
| ---------- | ----------- | -------- | ----------------------- |
| id         | uuid        | 是       | 主键                    |
| user_id    | uuid        | 是       | 所属用户，FK → users.id |
| title      | text        | 是       | 标题                    |
| message    | text        | 是       | 正文                    |
| unread     | boolean     | 是       | 是否未读，默认 true     |
| created_at | timestamptz | 是       | 创建时间                |
| updated_at | timestamptz | 是       | 更新时间                |

- **索引**：`INDEX (user_id)`、`INDEX (user_id, unread)`。
- **外键**：`user_id REFERENCES users(id) ON DELETE CASCADE`（用户删除时清理其通知）。

---

### 表：products

- **业务说明**：商家发布的产品；支撑「我的产品」列表、产品详情、发布产品、待推广列表；status 为前端强依赖枚举。
- **RLS**：该表需配置 RLS 策略，由后续完成（商家可 CRUD 自己的产品；创作者可读开放产品）。

| 字段名                | 类型        | 是否必填 | 说明                                                          |
| --------------------- | ----------- | -------- | ------------------------------------------------------------- |
| id                    | uuid        | 是       | 主键                                                          |
| user_id               | uuid        | 是       | 发布者（商家），FK → users.id                                 |
| name                  | text        | 是       | 产品名称                                                      |
| description           | text        | 否       | 短描述                                                        |
| full_description      | text        | 否       | 长描述                                                        |
| link                  | text        | 否       | 产品链接                                                      |
| avatar_url            | text        | 否       | 产品 Logo URL                                                 |
| contact_name          | text        | 是       | 联系人姓名                                                    |
| contact_email         | text        | 是       | 联系人邮箱                                                    |
| contact_phone         | text        | 是       | 联系人电话                                                    |
| contact_website       | text        | 否       | 联系人网站                                                    |
| category_type         | text        | 否       | 分类类型                                                      |
| category_keywords     | jsonb       | 否       | 标签数组                                                      |
| demo_video_url        | text        | 否       | 演示视频 URL                                                  |
| screenshots           | jsonb       | 否       | 截图 URL 数组                                                 |
| progress              | text        | 否       | 进度文案如「匹配中」                                          |
| developer_deadline    | date        | 否       | 开发者截止日                                                  |
| blogger_deadline      | date        | 否       | 博主截止日                                                    |
| pricing_type          | text        | 否       | 定价类型                                                      |
| price                 | text        | 否       | 价格展示                                                      |
| original_price        | text        | 否       | 原价展示                                                      |
| incentive_enabled     | boolean     | 否       | 是否启用激励                                                  |
| base_reward           | integer     | 否       | 基础佣金                                                      |
| bonus_targets         | jsonb       | 否       | 阶梯激励 [{views,bonus}]                                      |
| applicants            | integer     | 否       | 申请人数                                                      |
| expected_reach        | text        | 否       | 预期触达                                                      |
| target_audience       | text        | 否       | 目标受众                                                      |
| status                | text        | 是       | 产品状态，CHECK：matching/confirmed/published/observing/ended |
| expected_publish_date | date        | 否       | 期望发布日期                                                  |
| created_at            | timestamptz | 是       | 创建时间                                                      |
| updated_at            | timestamptz | 是       | 更新时间                                                      |

- **索引**：`INDEX (user_id)`、`INDEX (status)`、`INDEX (created_at)`。
- **外键**：`user_id REFERENCES users(id) ON DELETE RESTRICT`（存在产品时禁止删用户）。

---

### 表：testimonials

- **业务说明**：首页案例/评价；可选业务，卡片可关联 product_id 用于跳转产品详情。
- **RLS**：该表需配置 RLS 策略，由后续完成（通常对公众只读）。

| 字段名      | 类型        | 是否必填 | 说明                       |
| ----------- | ----------- | -------- | -------------------------- |
| id          | uuid        | 是       | 主键                       |
| image       | text        | 否       | 卡片背景图 URL             |
| avatar      | text        | 否       | 头像 URL                   |
| company     | text        | 否       | 公司名                     |
| title       | text        | 否       | 标题                       |
| description | text        | 否       | 描述                       |
| metrics     | jsonb       | 否       | [{label,value,color}]      |
| quote       | text        | 否       | 引用                       |
| author      | text        | 否       | 作者                       |
| product_id  | uuid        | 否       | 关联产品，FK → products.id |
| created_at  | timestamptz | 是       | 创建时间                   |
| updated_at  | timestamptz | 是       | 更新时间                   |

- **索引**：`INDEX (product_id)`。
- **外键**：`product_id REFERENCES products(id) ON DELETE SET NULL`（产品删除后案例保留、关联置空）。

---

### 表：product_documents

- **业务说明**：产品可下载资料；按 product_id + id 定位，file_path 用于生成下载 URL。
- **RLS**：该表需配置 RLS 策略，由后续完成（与产品可见性一致）。

| 字段名     | 类型        | 是否必填 | 说明                       |
| ---------- | ----------- | -------- | -------------------------- |
| id         | uuid        | 是       | 主键                       |
| product_id | uuid        | 是       | 所属产品，FK → products.id |
| name       | text        | 是       | 文档名                     |
| size       | text        | 否       | 如 "2.4 MB"                |
| icon       | text        | 否       | 展示用图标                 |
| file_path  | text        | 否       | 存储路径或对象存储 key     |
| created_at | timestamptz | 是       | 创建时间                   |
| updated_at | timestamptz | 是       | 更新时间                   |

- **索引**：`INDEX (product_id)`。
- **外键**：`product_id REFERENCES products(id) ON DELETE CASCADE`（产品删除时删除其文档）。

---

### 表：promotions

- **业务说明**：推广任务；关联产品与创作者，status 区分待发布/已发布等，前端据此推导 progress/文案。
- **RLS**：该表需配置 RLS 策略，由后续完成（商家看自己产品的推广，创作者看自己参与的推广）。

| 字段名                | 类型        | 是否必填 | 说明                                         |
| --------------------- | ----------- | -------- | -------------------------------------------- |
| id                    | uuid        | 是       | 主键                                         |
| product_id            | uuid        | 是       | 所属产品，FK → products.id                   |
| creator_id            | uuid        | 否       | 承接创作者，FK → users.id                    |
| expected_publish_date | date        | 否       | 期望发布日期                                 |
| title                 | text        | 是       | 标题                                         |
| platform              | text        | 否       | 平台如 Youtube、TikTok                       |
| status                | text        | 是       | 任务状态，CHECK：pending/submitted/published |
| description           | text        | 否       | 描述                                         |
| views                 | integer     | 否       | 播放/浏览数                                  |
| likes                 | integer     | 否       | 点赞数                                       |
| comments              | integer     | 否       | 评论数                                       |
| saves                 | integer     | 否       | 收藏数                                       |
| shares                | integer     | 否       | 分享数                                       |
| performance_level     | text        | 否       | 表现等级如「中」                             |
| created_at            | timestamptz | 是       | 创建时间                                     |
| updated_at            | timestamptz | 是       | 更新时间                                     |

- **索引**：`INDEX (product_id)`、`INDEX (creator_id)`、`INDEX (status)`、`INDEX (product_id, status)`。
- **外键**：`product_id REFERENCES products(id) ON DELETE RESTRICT`；`creator_id REFERENCES users(id) ON DELETE SET NULL`。

---

### 表：promotion_videos

- **业务说明**：推广任务下的视频；支撑推广详情「我的视频表现」、创作者仪表盘、提交视频接口；percentages 为长度 5 的整数数组。
- **RLS**：该表需配置 RLS 策略，由后续完成（与 promotions 可见性一致）。

| 字段名          | 类型        | 是否必填 | 说明                             |
| --------------- | ----------- | -------- | -------------------------------- |
| id              | uuid        | 是       | 主键                             |
| promotion_id    | uuid        | 是       | 所属推广任务，FK → promotions.id |
| title           | text        | 否       | 标题                             |
| platform        | text        | 否       | 平台                             |
| thumbnail_url   | text        | 否       | 封面 URL                         |
| video_link      | text        | 否       | 视频链接                         |
| duration        | text        | 否       | 如 "2:35"                        |
| progress        | integer     | 否       | 0–100                            |
| plays           | integer     | 否       | 播放量                           |
| likes           | integer     | 否       | 点赞                             |
| shares          | integer     | 否       | 分享                             |
| comments        | integer     | 否       | 评论                             |
| favorites       | integer     | 否       | 收藏                             |
| engagement_rate | text        | 否       | 如 "5.3%"                        |
| conversion_rate | text        | 否       | 如 "2.1%"                        |
| percentages     | jsonb       | 否       | 5 个维度百分比 [n,n,n,n,n]       |
| created_at      | timestamptz | 是       | 创建时间                         |
| updated_at      | timestamptz | 是       | 更新时间                         |

- **索引**：`INDEX (promotion_id)`。
- **外键**：`promotion_id REFERENCES promotions(id) ON DELETE CASCADE`（推广删除时删除其视频）。

---

### 表：messages

- **业务说明**：消息中心单条消息；type 区分 user/admin，time 由 API 根据 created_at 格式化。
- **RLS**：该表需配置 RLS 策略，由后续完成（用户可见自己相关会话或全局列表按业务定）。

| 字段名      | 类型        | 是否必填 | 说明                                    |
| ----------- | ----------- | -------- | --------------------------------------- |
| id          | uuid        | 是       | 主键                                    |
| user_id     | uuid        | 否       | 发送者，FK → users.id，type=user 时必填 |
| type        | text        | 是       | user / admin，CHECK 约束                |
| avatar_url  | text        | 否       | 头像 URL                                |
| sender_name | text        | 否       | 发送者名称（如管理员名）                |
| text        | text        | 否       | 正文                                    |
| created_at  | timestamptz | 是       | 创建时间                                |
| updated_at  | timestamptz | 是       | 更新时间                                |

- **索引**：`INDEX (user_id)`、`INDEX (created_at)`。
- **外键**：`user_id REFERENCES users(id) ON DELETE SET NULL`（用户删除后消息保留、发送者置空）。

---

### 表：message_attachments

- **业务说明**：消息附件；name/size/type 供展示，file_url 为存储 URL。
- **RLS**：该表需配置 RLS 策略，由后续完成（与 messages 可见性一致）。

| 字段名     | 类型        | 是否必填 | 说明                       |
| ---------- | ----------- | -------- | -------------------------- |
| id         | uuid        | 是       | 主键                       |
| message_id | uuid        | 是       | 所属消息，FK → messages.id |
| name       | text        | 是       | 文件名                     |
| size       | integer     | 否       | 字节数                     |
| type       | text        | 否       | MIME 类型                  |
| file_url   | text        | 否       | 文件 URL                   |
| created_at | timestamptz | 是       | 创建时间                   |
| updated_at | timestamptz | 是       | 更新时间                   |

- **索引**：`INDEX (message_id)`。
- **外键**：`message_id REFERENCES messages(id) ON DELETE CASCADE`（消息删除时删除附件）。

---

## 四、完整 SQL 初始化脚本

以下脚本可在 **Supabase Dashboard → SQL Editor** 中直接执行；亦可使用项目内 **`docs/supabase_init.sql`** 文件执行。执行顺序已按外键依赖排好。

```sql
-- ============================================================
-- GrowthEngine PostgreSQL 初始化脚本（Supabase 兼容）
-- 基于 docs/DATABASE_DATA_MODEL.md，生产级规范
-- ============================================================

-- 扩展（Supabase 默认已启用，可按需取消注释）
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 通用：更新 updated_at 的触发器函数
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------
-- 1. users
-- ------------------------------------------------------------
CREATE TABLE public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text NOT NULL,
  avatar_url text,
  role text CHECK (role IS NULL OR role IN ('creator', 'merchant')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_users_email ON public.users (email);
CREATE INDEX idx_users_role ON public.users (role) WHERE role IS NOT NULL;

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE public.users IS '用户账号（创作者/商家）';

-- ------------------------------------------------------------
-- 2. verification_codes
-- ------------------------------------------------------------
CREATE TABLE public.verification_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  code text NOT NULL,
  purpose text CHECK (purpose IS NULL OR purpose IN ('login', 'password_reset')),
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_verification_codes_email_purpose ON public.verification_codes (email, purpose);
CREATE INDEX idx_verification_codes_expires_at ON public.verification_codes (expires_at);

ALTER TABLE public.verification_codes ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER verification_codes_updated_at
  BEFORE UPDATE ON public.verification_codes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE public.verification_codes IS '登录/忘记密码验证码';

-- ------------------------------------------------------------
-- 3. notifications
-- ------------------------------------------------------------
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  unread boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user_id ON public.notifications (user_id);
CREATE INDEX idx_notifications_user_id_unread ON public.notifications (user_id, unread) WHERE unread = true;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER notifications_updated_at
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE public.notifications IS '用户站内通知';

-- ------------------------------------------------------------
-- 4. products
-- ------------------------------------------------------------
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  name text NOT NULL,
  description text,
  full_description text,
  link text,
  avatar_url text,
  contact_name text NOT NULL,
  contact_email text NOT NULL,
  contact_phone text NOT NULL,
  contact_website text,
  category_type text,
  category_keywords jsonb,
  demo_video_url text,
  screenshots jsonb,
  progress text,
  developer_deadline date,
  blogger_deadline date,
  pricing_type text,
  price text,
  original_price text,
  incentive_enabled boolean,
  base_reward integer,
  bonus_targets jsonb,
  applicants integer,
  expected_reach text,
  target_audience text,
  status text NOT NULL CHECK (status IN ('matching', 'confirmed', 'published', 'observing', 'ended')),
  expected_publish_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_products_user_id ON public.products (user_id);
CREATE INDEX idx_products_status ON public.products (status);
CREATE INDEX idx_products_created_at ON public.products (created_at DESC);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE public.products IS '商家发布的产品';

-- ------------------------------------------------------------
-- 5. testimonials
-- ------------------------------------------------------------
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image text,
  avatar text,
  company text,
  title text,
  description text,
  metrics jsonb,
  quote text,
  author text,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_testimonials_product_id ON public.testimonials (product_id) WHERE product_id IS NOT NULL;

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE public.testimonials IS '首页案例/评价（可选）';

-- ------------------------------------------------------------
-- 6. product_documents
-- ------------------------------------------------------------
CREATE TABLE public.product_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name text NOT NULL,
  size text,
  icon text,
  file_path text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_product_documents_product_id ON public.product_documents (product_id);

ALTER TABLE public.product_documents ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER product_documents_updated_at
  BEFORE UPDATE ON public.product_documents
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE public.product_documents IS '产品可下载资料';

-- ------------------------------------------------------------
-- 7. promotions
-- ------------------------------------------------------------
CREATE TABLE public.promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  creator_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
  expected_publish_date date,
  title text NOT NULL,
  platform text,
  status text NOT NULL CHECK (status IN ('pending', 'submitted', 'published')),
  description text,
  views integer,
  likes integer,
  comments integer,
  saves integer,
  shares integer,
  performance_level text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_promotions_product_id ON public.promotions (product_id);
CREATE INDEX idx_promotions_creator_id ON public.promotions (creator_id) WHERE creator_id IS NOT NULL;
CREATE INDEX idx_promotions_status ON public.promotions (status);
CREATE INDEX idx_promotions_product_id_status ON public.promotions (product_id, status);

ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER promotions_updated_at
  BEFORE UPDATE ON public.promotions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE public.promotions IS '推广任务（我的推广）';

-- ------------------------------------------------------------
-- 8. promotion_videos
-- ------------------------------------------------------------
CREATE TABLE public.promotion_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  promotion_id uuid NOT NULL REFERENCES public.promotions(id) ON DELETE CASCADE,
  title text,
  platform text,
  thumbnail_url text,
  video_link text,
  duration text,
  progress integer CHECK (progress IS NULL OR (progress >= 0 AND progress <= 100)),
  plays integer,
  likes integer,
  shares integer,
  comments integer,
  favorites integer,
  engagement_rate text,
  conversion_rate text,
  percentages jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_promotion_videos_promotion_id ON public.promotion_videos (promotion_id);

ALTER TABLE public.promotion_videos ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER promotion_videos_updated_at
  BEFORE UPDATE ON public.promotion_videos
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE public.promotion_videos IS '推广任务下的视频';

-- ------------------------------------------------------------
-- 9. messages
-- ------------------------------------------------------------
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
  type text NOT NULL CHECK (type IN ('user', 'admin')),
  avatar_url text,
  sender_name text,
  "text" text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_user_id ON public.messages (user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_messages_created_at ON public.messages (created_at DESC);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER messages_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE public.messages IS '消息中心消息';

-- ------------------------------------------------------------
-- 10. message_attachments
-- ------------------------------------------------------------
CREATE TABLE public.message_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  name text NOT NULL,
  size integer,
  type text,
  file_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_message_attachments_message_id ON public.message_attachments (message_id);

ALTER TABLE public.message_attachments ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER message_attachments_updated_at
  BEFORE UPDATE ON public.message_attachments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE public.message_attachments IS '消息附件';
```

---

## 五、歧义与设计风险说明

1. **notifications.user_id ON DELETE**  
   数据模型建议「用户删除时禁止删」为 RESTRICT；当前脚本采用 **CASCADE**，便于在 Supabase Auth 删除用户时一并清理通知。若业务要求「禁止删除有关联通知的用户」，请将 `notifications.user_id` 外键改为 `ON DELETE RESTRICT`。

2. **products.user_id ON DELETE RESTRICT**  
   与数据模型一致：存在产品时不允许删除用户；若希望「删用户时一并删其产品」，可改为 `ON DELETE CASCADE`（需同时考虑 promotions、product_documents 等依赖）。

3. **promotions.status 枚举**  
   已用 CHECK 限定为 `pending`、`submitted`、`published`；与前端约定一致。若后续新增状态，需执行 `ALTER TABLE ... ADD CONSTRAINT` 或新 CHECK 替换。

4. **verification_codes 无 user 外键**  
   按当前业务仅按 email 校验，不依赖 users 表；若需「仅已注册用户可收登录码」，可在应用层校验或增加 user_id 外键。

5. **RLS 策略**  
   所有表已开启 RLS，未编写具体策略。需在 Supabase 中按「谁可读/写哪几行」补充 POLICY，否则默认拒绝所有访问（service_role 除外）。

6. **messages.text 与保留字**  
   `text` 为 PostgreSQL 类型名，用作列名仍合法；若与 ORM 或代码风格冲突，可重命名为 `body` 或 `content`，并同步 API 与前端字段名。

---

**文档结束**。将「四、完整 SQL 初始化脚本」中的代码块复制到 Supabase SQL Editor 执行即可完成表结构初始化；RLS 策略需在 Supabase Dashboard 或后续迁移中补充。
