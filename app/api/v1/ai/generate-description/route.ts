import { NextRequest } from "next/server"
import { serverEnv } from "@/lib/server/env"
import { fail, ok, serverError } from "@/lib/server/http"

const FALLBACK_TEXT = `这是由本地MVP生成的产品文案：
- 目标用户：独立开发者、内容创作者、增长运营人员
- 核心价值：降低获客成本、提高内容转化效率、可视化追踪推广效果
- 建议卖点：真实案例、透明数据、快速上线、低学习成本`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const prompt = String(body?.prompt ?? "").trim()
    if (!prompt) return fail("prompt 不能为空", "VALIDATION_ERROR", 400)

    if (!serverEnv.ai.apiKey) {
      return ok({ text: FALLBACK_TEXT })
    }

    const resp = await fetch(`${serverEnv.ai.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serverEnv.ai.apiKey}`,
      },
      body: JSON.stringify({
        model: serverEnv.ai.model,
        messages: [
          {
            role: "system",
            content:
              "你是GrowthEngine平台的产品文案助手。输出中文，简洁、结构化、可直接用于产品发布页。",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      }),
    })

    if (!resp.ok) {
      const text = await resp.text()
      console.error("AI upstream error:", text)
      return ok({ text: FALLBACK_TEXT })
    }

    const data = await resp.json()
    const text =
      data?.choices?.[0]?.message?.content ||
      data?.data?.[0]?.content ||
      FALLBACK_TEXT
    return ok({ text })
  } catch (error) {
    console.error(error)
    return serverError()
  }
}
