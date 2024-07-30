# import fast api
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

import os

from dotenv import dotenv_values

env = dotenv_values(".env")

from pydantic import BaseModel

app = FastAPI()

# enable cors
origins = [env["origins"]]

dev = env["dev"]
if dev != "True":
    app = FastAPI(docs_url="/documentation", redoc_url=None)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class post(BaseModel):
    id: str
    post: str

@app.post("/api/post")
def handlePost(data: post):
    return data

@app.get("/api/count")
def handleCount(id):
    directory = './storage/test'
    return len([name for name in os.listdir(directory) if os.path.isfile(os.path.join(directory, name))])

@app.get("/api/img")
def handleImg(id: int):
    return FileResponse(f'./storage/test/{id}.png')

@app.get("/api/{path}")
def handlePath(path: str):
    return {"response": path}


@app.get("/{path}")
def handle404(path: str):
    return path


@app.get("/")
def root():
    return {"😎😎😎"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app)
