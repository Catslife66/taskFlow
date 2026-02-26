from decouple import config
import redis


REDIS_URL = config("REDIS_URL", default="redis://redis:6379/0")

_pool = redis.ConnectionPool.from_url(REDIS_URL, decode_responses=True)

def get_redis():
    return redis.client.Redis(connection_pool=_pool)
