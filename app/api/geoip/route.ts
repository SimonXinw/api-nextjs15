import maxmind from "maxmind";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

// 定义 GeoIP 数据库路径
const ipDbPath: string = path.join(
  process.cwd(),
  "lib/geoip/database/geolite2-country.mmdb"
);

let ipDbInstance: any;

// 异步加载 GeoIP 数据库
async function loadGeoIPDatabase() {
  if (!ipDbInstance) {
    ipDbInstance = await maxmind.open(ipDbPath);
  }
  return ipDbInstance;
}

function normalizeIP(ip: string | null) {
  if (ip === "::1") {
    return "127.0.0.1"; // 转换 IPv6 回环地址
  }

  return ip;
}

/**
 * @handleGeoIp
 * test : https://xxx.com/api/geoip?ip=207.148.80.179
 */
export async function GET(req: NextRequest) {
  // 获取查询参数中的 IP 值
  const { searchParams } = new URL(req.url);

  const ip = normalizeIP(searchParams.get("ip")) || "127.0.0.1"; // 默认 IP

  // console.log('服务端： 走进来了>>>>', process.cwd());

  try {
    // 加载 GeoIP 数据库实例
    const ipDb = await loadGeoIPDatabase();

    // 查询 IP 信息
    const ipInfo = ipDb.get(ip);

    // 返回成功响应
    return NextResponse.json(ipInfo, { status: 200 });
  } catch (error) {
    // 返回错误响应
    return NextResponse.json(
      {
        code: 200,
        success: false,
        message: "服务端: 查询数据库失败 Error - Geoip faied to query IP",
      },
      { status: 500 }
    );
  }
}
