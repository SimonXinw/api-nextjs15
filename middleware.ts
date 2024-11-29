// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // 设置 CORS 头部
  response.headers.set("Access-Control-Allow-Origin", "*"); // 允许所有来源
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  // 处理 OPTIONS 请求（浏览器预检请求）
  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 200, headers: response.headers });
  }

  return response;
}

export const config = {
  matcher: ["/api/*"], // 只对指定 API 路由生效
};
