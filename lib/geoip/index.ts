import maxmind from 'maxmind';
import path from 'path';
import { fileURLToPath } from 'url'; // 使用import.meta.url获取当前文件的URL，然后转换为路径

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ipDbPath = path.join(__dirname, './database/geolite2-country.mmdb');

let ipDbInstance: any;

// 异步加载 GeoIP 数据库
async function loadGeoIPDatabase() {
  if (!ipDbInstance) {
    ipDbInstance = await maxmind.open(ipDbPath);
  }
  return ipDbInstance;
}

function normalizeIP(ip: string) {
  if (ip === '::1') {
    return '127.0.0.1'; // 转换 IPv6 回环地址
  }
  return ip;
}

/**
 * @handleGeoIp
 * test : https://xxx.com/api/geoip?ip=207.148.80.179
 */
export async function getGeoIpData(rawIp: string) {
  try {
    const ip = normalizeIP(rawIp);

    // 加载 GeoIP 数据库实例
    const ipDb = await loadGeoIPDatabase();

    // 查询 IP 信息
    const ipInfo = ipDb.get(ip);

    // 返回成功响应
    return ipInfo;
  } catch (error) {
    // 返回错误响应
    console.error(`服务端: geoip function query database error >>>${error}`);

    return null;
  }
}
