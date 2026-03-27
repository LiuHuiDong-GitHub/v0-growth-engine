import mysql, { type Pool } from "mysql2/promise"
import bcrypt from "bcryptjs"
import { serverEnv } from "./env"

let pool: Pool | null = null
let bootstrapped = false
let bootstrapPromise: Promise<void> | null = null

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: serverEnv.mysql.host,
      port: serverEnv.mysql.port,
      user: serverEnv.mysql.user,
      password: serverEnv.mysql.password,
      database: serverEnv.mysql.database,
      connectionLimit: 10,
      namedPlaceholders: true,
    })
  }
  return pool
}

export async function query<T = unknown[]>(
  sql: string,
  params?: Record<string, unknown> | unknown[],
) {
  await ensureDatabaseReady()
  const [rows] = await getPool().query(sql, params as never)
  return rows
}

export async function execute(
  sql: string,
  params?: Record<string, unknown> | unknown[],
) {
  await ensureDatabaseReady()
  return getPool().execute(sql, params as never)
}

export async function ensureDatabaseReady() {
  if (bootstrapped) return
  if (!bootstrapPromise) {
    bootstrapPromise = bootstrap()
  }
  await bootstrapPromise
  bootstrapped = true
}

async function bootstrap() {
  await createTables()
  await seedIfNeeded()
}

async function createTables() {
  const p = getPool()
  await p.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      uuid CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
      name VARCHAR(120) NOT NULL,
      email VARCHAR(160) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role ENUM('creator','merchant','admin') NOT NULL,
      avatar_url VARCHAR(512) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `)
  await p.query(`
    CREATE TABLE IF NOT EXISTS verification_codes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(160) NOT NULL,
      code VARCHAR(12) NOT NULL,
      purpose ENUM('login','password_reset') DEFAULT 'login',
      expires_at DATETIME NOT NULL,
      used_at DATETIME NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_verification_email (email),
      INDEX idx_verification_expire (expires_at)
    )
  `)
  await p.query(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      title VARCHAR(200) NOT NULL,
      message TEXT NOT NULL,
      unread BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_notifications_user (user_id, unread)
    )
  `)
  await p.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      uuid CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
      user_id INT NOT NULL,
      name VARCHAR(200) NOT NULL,
      description TEXT NULL,
      full_description LONGTEXT NULL,
      link VARCHAR(512) NULL,
      avatar_url VARCHAR(512) NULL,
      tags_json JSON NULL,
      contact_name VARCHAR(120) NULL,
      contact_email VARCHAR(160) NULL,
      contact_phone VARCHAR(80) NULL,
      contact_website VARCHAR(255) NULL,
      category_type VARCHAR(80) NULL,
      category_keywords_json JSON NULL,
      demo_video_url VARCHAR(512) NULL,
      screenshots_json JSON NULL,
      progress VARCHAR(50) DEFAULT '匹配中',
      developer_deadline DATE NULL,
      blogger_deadline DATE NULL,
      pricing_type VARCHAR(80) NULL,
      price VARCHAR(80) NULL,
      original_price VARCHAR(80) NULL,
      incentive_enabled BOOLEAN DEFAULT TRUE,
      base_reward INT DEFAULT 0,
      bonus_targets_json JSON NULL,
      applicants INT DEFAULT 0,
      expected_reach VARCHAR(120) NULL,
      target_audience VARCHAR(255) NULL,
      status ENUM('matching','confirmed','published','observing','ended') NOT NULL DEFAULT 'matching',
      expected_publish_date DATE NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_products_user (user_id),
      INDEX idx_products_status (status)
    )
  `)
  await p.query(`
    CREATE TABLE IF NOT EXISTS product_documents (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_id INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      size VARCHAR(40) NULL,
      icon VARCHAR(20) NULL,
      file_path VARCHAR(512) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      INDEX idx_documents_product (product_id)
    )
  `)
  await p.query(`
    CREATE TABLE IF NOT EXISTS promotions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      uuid CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
      product_id INT NOT NULL,
      creator_id INT NULL,
      expected_publish_date DATE NULL,
      title VARCHAR(255) NOT NULL,
      platform VARCHAR(80) NULL,
      status ENUM('pending','submitted','published') NOT NULL DEFAULT 'pending',
      description TEXT NULL,
      views INT DEFAULT 0,
      likes INT DEFAULT 0,
      comments INT DEFAULT 0,
      saves INT DEFAULT 0,
      shares INT DEFAULT 0,
      performance_level VARCHAR(16) DEFAULT '中',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE SET NULL,
      INDEX idx_promotion_product (product_id),
      INDEX idx_promotion_creator (creator_id),
      INDEX idx_promotion_status (status)
    )
  `)
  await p.query(`
    CREATE TABLE IF NOT EXISTS promotion_videos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      promotion_id INT NOT NULL,
      title VARCHAR(255) NULL,
      platform VARCHAR(80) NULL,
      thumbnail_url VARCHAR(512) NULL,
      video_link VARCHAR(512) NULL,
      duration VARCHAR(20) NULL,
      progress INT DEFAULT 0,
      plays INT DEFAULT 0,
      likes INT DEFAULT 0,
      shares INT DEFAULT 0,
      comments INT DEFAULT 0,
      favorites INT DEFAULT 0,
      engagement_rate VARCHAR(20) DEFAULT '0%',
      conversion_rate VARCHAR(20) DEFAULT '0%',
      percentages_json JSON NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (promotion_id) REFERENCES promotions(id) ON DELETE CASCADE,
      INDEX idx_video_promotion (promotion_id)
    )
  `)
  await p.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NULL,
      type ENUM('user','admin') NOT NULL,
      avatar_url VARCHAR(512) NULL,
      sender_name VARCHAR(100) NULL,
      text TEXT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
      INDEX idx_messages_user (user_id)
    )
  `)
  await p.query(`
    CREATE TABLE IF NOT EXISTS message_attachments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      message_id INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      size INT NULL,
      type VARCHAR(100) NULL,
      file_url VARCHAR(512) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
    )
  `)
}

async function seedIfNeeded() {
  const p = getPool()
  const [users] = await p.query<Array<{ count: number }>>("SELECT COUNT(*) AS count FROM users")
  if ((users[0]?.count ?? 0) > 0) return

  const passwordHash = await bcrypt.hash("123456", 10)
  await p.query(
    `
      INSERT INTO users (name, email, password_hash, role, avatar_url) VALUES
      ('博主测试账号', 'creator@test.com', ?, 'creator', 'https://api.dicebear.com/7.x/avataaars/svg?seed=creator'),
      ('开发者测试账号', 'merchant@test.com', ?, 'merchant', 'https://api.dicebear.com/7.x/bottts/svg?seed=merchant'),
      ('最高级管理员', 'admin@test.com', ?, 'admin', 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin')
    `,
    [passwordHash, passwordHash, passwordHash],
  )

  const [allUsers] = await p.query<Array<{ id: number; role: "creator" | "merchant" | "admin" }>>(
    "SELECT id, role FROM users ORDER BY id ASC",
  )
  const creator = allUsers.find((u) => u.role === "creator")?.id
  const merchant = allUsers.find((u) => u.role === "merchant")?.id
  const admin = allUsers.find((u) => u.role === "admin")?.id
  if (!creator || !merchant || !admin) return

  for (let i = 1; i <= 20; i += 1) {
    const statusPool = ["matching", "confirmed", "published", "observing", "ended"] as const
    const status = statusPool[(i - 1) % statusPool.length]
    const tags = JSON.stringify(["AI 工具", "增长", `标签${i}`])
    const screenshots = JSON.stringify([
      "/app-screenshot-1.jpg",
      "/app-screenshot-2.jpg",
      "/app-screenshot-3.jpg",
    ])
    const bonusTargets = JSON.stringify([
      { views: 10000, bonus: 100 + i * 10 },
      { views: 50000, bonus: 500 + i * 20 },
    ])
    await p.query(
      `
      INSERT INTO products (
        user_id, name, description, full_description, link, avatar_url, tags_json,
        contact_name, contact_email, contact_phone, contact_website,
        category_type, category_keywords_json, demo_video_url, screenshots_json,
        pricing_type, price, original_price, incentive_enabled, base_reward,
        bonus_targets_json, applicants, expected_reach, target_audience, status,
        expected_publish_date, developer_deadline, blogger_deadline
      )
      VALUES (
        :userId, :name, :description, :fullDescription, :link, :avatar, CAST(:tags AS JSON),
        :contactName, :contactEmail, :contactPhone, :contactWebsite,
        :categoryType, CAST(:categoryKeywords AS JSON), :demoVideo, CAST(:screenshots AS JSON),
        :pricingType, :price, :originalPrice, 1, :baseReward,
        CAST(:bonusTargets AS JSON), :applicants, :expectedReach, :targetAudience, :status,
        DATE_ADD(CURDATE(), INTERVAL :offset DAY),
        DATE_ADD(CURDATE(), INTERVAL :offset DAY),
        DATE_ADD(CURDATE(), INTERVAL :offsetPlus DAY)
      )
      `,
      {
        userId: merchant,
        name: `MVP产品-${i}`,
        description: `这是第${i}个可真实联调的产品数据。`,
        fullDescription: `MVP产品-${i} 的完整描述（可供产品详情展示与AI扩写）。`,
        link: `https://example${i}.com`,
        avatar: `https://api.dicebear.com/7.x/shapes/svg?seed=product-${i}`,
        tags,
        contactName: "运营同学",
        contactEmail: `ops${i}@growthengine.local`,
        contactPhone: `1380000${String(i).padStart(4, "0")}`,
        contactWebsite: `https://brand${i}.example.com`,
        categoryType: "效率工具",
        categoryKeywords: JSON.stringify(["效率", "AI", "SaaS"]),
        demoVideo: "/product-demo-video-thumbnail.jpg",
        screenshots,
        pricingType: "订阅制",
        price: "$9.9/月",
        originalPrice: "$19.9/月",
        baseReward: 100 + i * 5,
        bonusTargets,
        applicants: 30 + i,
        expectedReach: `${i * 10}万+`,
        targetAudience: "创作者、出海开发者、独立团队",
        status,
        offset: i,
        offsetPlus: i + 7,
      },
    )
  }

  const [products] = await p.query<Array<{ id: number; name: string }>>(
    "SELECT id, name FROM products ORDER BY id ASC LIMIT 20",
  )
  for (const product of products) {
    for (let d = 1; d <= 2; d += 1) {
      await p.query(
        `
          INSERT INTO product_documents (product_id, name, size, icon, file_path)
          VALUES (?, ?, ?, ?, ?)
        `,
        [
          product.id,
          `${product.name}-资料-${d}.pdf`,
          `${1.2 + d} MB`,
          "📄",
          `/mock-files/${product.id}/${d}.pdf`,
        ],
      )
    }
    const statusPool = ["pending", "submitted", "published"] as const
    const status = statusPool[product.id % statusPool.length]
    await p.query(
      `
        INSERT INTO promotions (
          product_id, creator_id, expected_publish_date, title, platform, status, description,
          views, likes, comments, saves, shares, performance_level
        )
        VALUES (?, ?, DATE_ADD(CURDATE(), INTERVAL 3 DAY), ?, 'YouTube', ?, ?, ?, ?, ?, ?, ?, '中')
      `,
      [
        product.id,
        creator,
        `${product.name} - 推广任务`,
        status,
        "MVP联调推广任务",
        10000 + product.id * 300,
        800 + product.id * 20,
        90 + product.id,
        120 + product.id,
        75 + product.id,
      ],
    )
  }

  const [promotions] = await p.query<Array<{ id: number; title: string }>>(
    "SELECT id, title FROM promotions ORDER BY id ASC LIMIT 20",
  )
  for (const [idx, promotion] of promotions.entries()) {
    await p.query(
      `
        INSERT INTO promotion_videos (
          promotion_id, title, platform, thumbnail_url, video_link, duration, progress,
          plays, likes, shares, comments, favorites, engagement_rate, conversion_rate, percentages_json
        )
        VALUES (?, ?, 'YouTube', '/laptop-analytics-dashboard.jpg', ?, '2:35', ?, ?, ?, ?, ?, ?, ?, ?, CAST(? AS JSON))
      `,
      [
        promotion.id,
        `${promotion.title} - 视频${idx + 1}`,
        `https://www.youtube.com/watch?v=demo${promotion.id}`,
        50 + ((idx + 1) % 50),
        5000 + idx * 300,
        500 + idx * 20,
        200 + idx * 10,
        80 + idx * 3,
        300 + idx * 8,
        `${(4 + (idx % 4) * 0.5).toFixed(1)}%`,
        `${(1.2 + (idx % 4) * 0.2).toFixed(1)}%`,
        JSON.stringify([80, 70, 65, 60, 75]),
      ],
    )
  }

  for (let i = 1; i <= 20; i += 1) {
    const userId = i % 2 === 0 ? creator : merchant
    await p.query(
      `
        INSERT INTO notifications (user_id, title, message, unread)
        VALUES (?, ?, ?, ?)
      `,
      [
        userId,
        `系统通知 ${i}`,
        `这是第 ${i} 条通知，来自本地 MySQL 模拟数据。`,
        i % 3 === 0 ? 0 : 1,
      ],
    )
  }

  for (let i = 1; i <= 20; i += 1) {
    const type = i % 3 === 0 ? "admin" : "user"
    const userId = type === "user" ? creator : admin
    await p.query(
      `
        INSERT INTO messages (user_id, type, avatar_url, sender_name, text)
        VALUES (?, ?, ?, ?, ?)
      `,
      [
        userId,
        type,
        `https://api.dicebear.com/7.x/avataaars/svg?seed=msg-${i}`,
        type === "admin" ? "Platform" : null,
        `这是一条用于本地联调的消息内容 #${i}`,
      ],
    )
  }

  const [messages] = await p.query<Array<{ id: number }>>(
    "SELECT id FROM messages ORDER BY id ASC LIMIT 20",
  )
  for (const [idx, msg] of messages.entries()) {
    if (idx % 2 === 0) {
      await p.query(
        `
          INSERT INTO message_attachments (message_id, name, size, type, file_url)
          VALUES (?, ?, ?, ?, ?)
        `,
        [msg.id, `附件-${idx + 1}.pdf`, 1024 * (idx + 1), "application/pdf", "/mock-files/attachment.pdf"],
      )
    }
  }
}

