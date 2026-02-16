from fastapi import HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from typing import Any, Dict, Optional


def error_response(
    *,
    status_code: int,
    code: str,
    message: str,
    details: Optional[Any] = None
) -> JSONResponse:
    return JSONResponse(
        status_code=status_code, 
        content={
            "errors": {
                "code": code,
                "message": message,
                "details": details
            }
        }
    )

async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    detail = exc.detail
    if isinstance(detail, Dict):
        code = str(detail.get("code", "HTTP_ERROR"))
        message = str(detail.get("message", "Request failed"))
        details = detail.get("details")
        return error_response(status_code=exc.status_code, code=code, message=message, details=details)

    if isinstance(detail, str):
        return error_response(status_code=exc.status_code, code="HTTP_ERROR", message=detail)
    
    return error_response(status_code=exc.status_code, code="HTTP_ERROR", message="Request failed", details=detail)

async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    field_errors = []
    for e in exc.errors():
        loc = e.get("loc", [])
        msg = e.get("msg", "Invalid input")
        field_errors.append({"loc": list(loc), "message": msg})

    return error_response(
        status_code=422,
        code="VALIDATION_ERROR",
        message="Invalid request data",
        details={"fields": field_errors},
    )

async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    return error_response(
        status_code=500,
        code="INTERNAL_SERVER_ERROR",
        message="Something went wrong",
        details=None,
    )


USER_NOT_FOUND_ERR = {
    "code": "USER_NOT_FOUND", 
    "message": "User is not found.",
    "details": None
}
USER_CONFLICT_ERR = {
    "code": "DUPLICATE_EMAIL", 
    "message": "This email has been registered.",
    "details": None
}
USER_UNAUTH_ERR =  {
    "code": "UNAUTHORIZED", 
    "message": "Invalid credentials.",
    "details": None
}
NO_SESSION_ERR = {
    "code": "UNAUTHORIZED", 
    "message": "Missing session.",
    "details": None
}
INVALID_SESSION_ERR = {
    "code": "UNAUTHORIZED", 
    "message": "Invalid session.",
    "details": None
}
EXPIRE_SESSION_ERR = {
    "code": "UNAUTHORIZED", 
    "message": "Session expired.",
    "details": None
}

TASK_NOT_FOUND_ERR = {
    "code": "OBJECT_NOT_FOUND", 
    "message": "Task is not found.",
    "details": None
}
NO_PERMISSION_ERR = {
    "code": "FORBIDDEN", 
    "message": "You do not have permission to read/update/delete this task.",
    "details": None
}

