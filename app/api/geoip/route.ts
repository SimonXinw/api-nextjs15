import maxmind from "maxmind";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

// 定义 GeoIP 数据库路径
const ipDbPath: string = path.join(
  process.cwd(),
  "lib/geoip/database/geolite2-country.mmdb"
);

// 使用全局变量存储数据库实例
let ipDbInstance: any;

// 加载 GeoIP 数据库实例（只加载一次）
async function loadGeoIPDatabase() {
  if (!ipDbInstance) {
    try {
      ipDbInstance = await maxmind.open(ipDbPath);
    } catch (error) {
      throw new Error(`无法加载 GeoIP 数据库: ${error}`);
    }
  }
  return ipDbInstance;
}

// 转换 IPv6 回环地址
function normalizeIP(ip: string | null) {
  if (ip === "::1") {
    return "127.0.0.1"; // 将 IPv6 回环地址转换为 IPv4 回环地址
  }
  return ip;
}

/**
 * @handleGeoIp
 * 测试接口: https://xxx.com/api/geoip?ip=207.148.80.179
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ip = normalizeIP(searchParams.get("ip")) || "127.0.0.1"; // 默认 IP

  try {
    // 加载并缓存 GeoIP 数据库实例
    const ipDb = await loadGeoIPDatabase();

    // 查询 IP 信息
    const ipInfo = ipDb?.get(ip);

    // 返回成功响应
    return NextResponse.json(ipInfo, { status: 200 });
  } catch (error) {
    // 返回错误响应
    return NextResponse.json(
      {
        code: 500,
        message: `查询 geoip 数据库发生错误. IP: ${ip}. 错误信息: ${error}`,
      },
      { status: 500 }
    );
  }
}
