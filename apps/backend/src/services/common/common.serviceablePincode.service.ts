import prisma from "@repo/db";
import RedisService from "./redis.service"; // adjust path/file name to where your RedisService lives

const CITIES_CACHE_KEY = "serviceable:cities";
const CITIES_TTL_SECONDS = 60 * 60 * 24; // 1 day

class CommonServiceablePincodeService {
  async getAllCities(): Promise<string[]> {
    const cached = await RedisService.get<string[]>(CITIES_CACHE_KEY);
    if (cached) return cached;

    const rows = await prisma.serviceablePincode.findMany({
      where: { isActive: true },
      select: { city: true },
      distinct: ["city"],
      orderBy: { city: "asc" },
    });

    const cities = rows.map((r) => r.city);
    await RedisService.set(CITIES_CACHE_KEY, cities, CITIES_TTL_SECONDS);
    return cities;
  }

  // Call this after any create/update/delete of ServiceablePincode
  async clearCache(): Promise<void> {
    await RedisService.del(CITIES_CACHE_KEY);
  }
}

export default new CommonServiceablePincodeService();
