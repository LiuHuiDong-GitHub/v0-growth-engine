import { NextResponse } from "next/server"

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ success: true, data }, init)
}

export function fail(
  message: string,
  code = "BAD_REQUEST",
  status = 400,
  details?: unknown,
) {
  return NextResponse.json(
    {
      success: false,
      code,
      message,
      ...(details ? { details } : {}),
    },
    { status },
  )
}

export function serverError(message = "服务器内部错误") {
  return fail(message, "SERVER_ERROR", 500)
}
