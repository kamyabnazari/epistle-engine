from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import uvicorn

class Todo(BaseModel):
    todo: str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://chat.openai.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_TODOS = {}

@app.post("/todos/{username}", response_model=Todo)
async def add_todo(username: str, todo: Todo):
    _TODOS.setdefault(username, []).append(todo.todo)
    return todo

@app.get("/todos/{username}", response_model=List[str])
async def get_todos(username: str):
    return _TODOS.get(username, [])

@app.delete("/todos/{username}")
async def delete_todo(username: str, todo: Todo):
    if username in _TODOS and todo.todo in _TODOS[username]:
        _TODOS[username].remove(todo.todo)
        return JSONResponse(content='OK', status_code=200)
    raise HTTPException(status_code=404, detail="Todo not found")

@app.get("/logo.png")
async def logo():
    return FileResponse('logo.png', media_type='image/png')

@app.get("/.well-known/ai-plugin.json")
async def ai_plugin():
    return FileResponse('./.well-known/ai-plugin.json', media_type='application/json')

@app.get("/openapi.yaml")
async def openapi():
    return FileResponse('openapi.yaml', media_type='text/yaml')

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5003)
