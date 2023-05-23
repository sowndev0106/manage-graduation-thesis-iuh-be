import RedisCache from "@core/infrastructure/redis";

function withRedisCache(ttlSeconds: number = 300) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cache = await RedisCache.instance();
      const cacheKey = `${propertyKey}:${JSON.stringify(args)}`;

      const cachedData = await cache.get(cacheKey);
      if (cachedData !== null) {
        try {
          return JSON.parse(cachedData);
        } catch (error: any) {
          return cachedData;
        }
      }

      const result = await originalMethod.apply(this, args);

      if (typeof result === "string") {
        await cache.set(cacheKey, result, ttlSeconds);
      } else {
        await cache.set(cacheKey, JSON.stringify(result), ttlSeconds);
      }

      return result;
    };

    return descriptor;
  };
}

export default withRedisCache;
