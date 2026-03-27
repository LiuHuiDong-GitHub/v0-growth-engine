-- ============================================================
-- GrowthEngine PostgreSQL 初始化脚本（Supabase 兼容）
-- 基于 docs/DATABASE_DATA_MODEL.md，生产级规范
-- 使用：复制到 Supabase Dashboard → SQL Editor 直接执行
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
