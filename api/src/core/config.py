from decouple import config

SESSION_COOKIE_NAME = config("SESSION_COOKIE_NAME")
SESSION_TTL_SECONDS = config("SESSION_TTL_SECONDS", cast=int, default=259200)
ENV = config("ENV", default='dev')
COOKIE_SECURE = ENV == "production"

COOKIE_SAMESITE = config("COOKIE_SAMESITE", default="lax")
