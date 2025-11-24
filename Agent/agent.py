import re # 👈 Nhớ import regex
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agno.agent import Agent
from agno.models.ollama import Ollama
from agno.models.google import Gemini
from agno.db.mongo import MongoDb
from dotenv import load_dotenv
import os

from prompts import CHAT_AGENT_PROMPT
from data import get_film_data

load_dotenv()

app = FastAPI(title="YSoul Agent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGO_CONNECTION_STRING = os.getenv("MONGO_DB_URL")
storage = MongoDb(
    db_url=MONGO_CONNECTION_STRING,
    db_name="ysoul_agent_memory", 
    session_collection="chat_history"
)

# --- AGENT ---
class MasterAgent(Agent):
    name = "YSoulAssistant"
    
    def __init__(self, **kwargs):
        model_id = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
        
        super().__init__(
            model=Gemini(
                id=model_id,
                api_key=os.getenv("GEMINI_API_KEY"),
                temperature=0.1,
            ),
            instructions=CHAT_AGENT_PROMPT, 
            tools=[get_film_data],
            db=storage, 
            add_history_to_context=True,    
            debug_mode=True, 
            markdown=True,
            **kwargs
        )

    def run_chat(self, prompt: str, session_id: str) -> str:
        try:
            # ⚠️ KHÔNG CỘNG CHUỖI SYSTEM NOTE Ở ĐÂY NỮA
            response = super().run(prompt, session_id=session_id, stream=False)
            if hasattr(response, 'content'):
                return response.content
            return str(response)
        except Exception as e:
            print(f"❌ Agent Error: {e}")
            return f"Lỗi xử lý: {str(e)}"

# --- 👇 HÀM DỌN RÁC (VỆ SĨ CHO MODEL NHỎ) ---
def clean_response(text: str) -> str:
    # 1. Xóa các dòng System Note bị leak (Dòng gây lỗi của bạn)
    # Regex này tìm mọi chuỗi bắt đầu bằng -(System Note và kết thúc bằng )
    text = re.sub(r'-\(System Note:.*?\)', '', text, flags=re.IGNORECASE)
    
    # 2. Xóa các dòng Instruction bị leak khác (nếu có)
    text = re.sub(r'\(Instruction:.*?\)', '', text, flags=re.IGNORECASE)
    
    # 3. Xóa dòng trống thừa do regex tạo ra
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    return '\n'.join(lines)

ysoul_agent = MasterAgent()

class ChatRequest(BaseModel):
    message: str
    session_id: str

@app.post("/api/chat")
def chat_endpoint(req: ChatRequest):
    if not ysoul_agent:
        raise HTTPException(status_code=500, detail="Agent chưa được khởi tạo.")
    
    print(f"📩 Session: {req.session_id} | User: {req.message}")
    
    # ❌ TUYỆT ĐỐI KHÔNG CỘNG: req.message + "System Note..." TẠI ĐÂY
    raw_reply = ysoul_agent.run_chat(req.message, session_id=req.session_id)
    
    # ✅ Làm sạch trước khi trả về Frontend
    clean_reply = clean_response(raw_reply)
    
    return {"reply": clean_reply}