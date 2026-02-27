from decouple import config

ENV = config("ENV", default='dev')
COOKIE_SECURE = ENV == "prod"
COOKIE_SAMESITE = config("COOKIE_SAMESITE", default="lax")
SESSION_COOKIE_NAME = config("SESSION_COOKIE_NAME")
SESSION_TTL_SECONDS = config("SESSION_TTL_SECONDS", cast=int, default=259200)
DOMAIN_NAME = config("DOMAIN_NAME")
