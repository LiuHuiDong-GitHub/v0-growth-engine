const DEFAULT_MYSQL_PORT = 3306

function normalizeMysqlPort(value?: string): number {
  if (!value) return DEFAULT_MYSQL_PORT
  const parsed = Number.parseInt(value, 10)
  if (Number.isNaN(parsed)) return DEFAULT_MYSQL_PORT
  return parsed
}

export const serverEnv = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  jwtSecret: process.env.JWT_SECRET ?? "growthengine-local-dev-secret",
  mysql: {
    host: process.env.MYSQL_HOST ?? "localhost",
    // 用户给的是“localhost”，这里做容错回退 3306
    port: normalizeMysqlPort(process.env.MYSQL_PORT),
    user: process.env.MYSQL_USER ?? "root",
    password: process.env.MYSQL_PASSWORD ?? "",
    database: process.env.MYSQL_DATABASE ?? "growthengineData",
  },
  ai: {
    baseUrl: process.env.AI_BASE_URL ?? "https://api.scnet.cn/api/llm/v1",
    apiKey: process.env.AI_API_KEY ?? "",
    model: process.env.AI_MODEL ?? "MiniMax-M2.5",
  },
}

export const isProduction = serverEnv.nodeEnv === "production"
