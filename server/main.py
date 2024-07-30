#import fast api
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from dotenv import dotenv_values
env=dotenv_values(".env")

app = FastAPI()

#enable cors
origins = [env["origins"]]

app.add_middleware(
    CORSMiddleware, 
    allow_origins = origins, 
    allow_credentials = True,
    allow_methods = ["get", "post"],
    allow_headers=["*"]
)

@app.get("/api/{path}")
def handlePath(path:str):
    return {"response": path}

@app.get("/{path}")
def handle404(path: str):
    return path

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app)