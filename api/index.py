from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import base64
import hmac
import time
from urllib.parse import quote

# Create FastAPI instance
app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TokenRequest(BaseModel):
    user_id: str
    access_key: str

# [0] version=2022-05-01&res=userid%2F292608&et=1739941828&method=sha1&sign=UXtAHJHCuyyio3SjvgFsNa%2FGAwQ%3D
def generate_token(user_id,access_key):
    version = '2022-05-01'
    res = 'userid/%s' % user_id
    # User-defined token expiration time
    et = str(int(time.time()) + 3600)
    # Signature method, MD5, SHA1, SHA256 are supported
    method = 'md5'
    # Decode the access_key
    key = base64.b64decode(access_key)
    # Calculate the sign
    org = et + '\n' + method + '\n' + res + '\n' + version
    sign_b = hmac.new(key=key, msg=org.encode(), digestmod=method)
    sign = base64.b64encode(sign_b.digest()).decode()
    # The value part is URL encoded, and the method/res/version value is simple and does not need to be encoded
    sign = quote(sign, safe='')
    res = quote(res, safe='')

    # Concatenate token parameters
    token = 'version=%s&res=%s&et=%s&method=%s&sign=%s' % (version, res, et, method, sign)

    # print(token)
    return token

@app.post("/api/py/token")
async def create_token(request: TokenRequest):
    try:
        token = generate_token(request.user_id, request.access_key)
        return {"success": True, "token": token}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)