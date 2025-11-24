from agno.agent import Agent
from agno.models.ollama import Ollama
from dotenv import load_dotenv
import os
from prompts import CHAT_AGENT_PROMPT
load_dotenv()

# ⚠️ Lưu ý: Đảm bảo bạn đã định nghĩa MASTER_PROMPT và các Agent con (ChatAgent, DataAgent...) ở bên trên hoặc import vào.

class MasterAgent(Agent):
    """
    The Master Agent orchestrates other specialized agents (tools)
    and delegates the task automatically based on the user's request.
    """

    name = "MasterAgent"
    description = "Delegates tasks to the appropriate specialized tool based on the user's input."

    def __init__(self, **kwargs):

        model_id = os.getenv("OLLAMA_MODEL", "llama3.2:1b")

        super().__init__(
            model=Ollama(id=model_id), 
            
            instructions=[CHAT_AGENT_PROMPT], 
            markdown=True,
            **kwargs
        )

    def run(self, prompt: str) -> str:
        """
        Receives a user prompt and lets Ollama decide which tool to call.
        """
        
        try:
            # Gọi hàm run của lớp cha
            response = super().run(prompt)
            
            # Kiểm tra nếu response là stream hoặc object, xử lý để lấy content
            if hasattr(response, 'content'):
                print("✅ Task delegated successfully.")
                return response.content
            return str(response)
            
        except Exception as e:
            print(f"⚠️ MasterAgent error: {e}")
            return f"Error: {e}"

# Phần main để test (uncomment để chạy)
if __name__ == "__main__":
    # Đảm bảo server ollama đang chạy (`ollama serve`)
    agent = MasterAgent()
    print("🤖 MasterAgent (Ollama Local) is ready! Type 'exit' to quit.\n")

    while True:
        user_input = input("You: ")
        if user_input.lower().strip() in ["exit", "quit"]:
            print("👋 Goodbye!")
            break
        try:
            reply = agent.run(user_input)
            print(f"YSOUL: {reply}\n")
        except Exception as e:
            print(f"⚠️ Error: {e}\n")