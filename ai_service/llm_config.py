import os
from dotenv import load_dotenv
from groq import Groq
from typing import Any, List, Dict, Optional
from langchain_core.language_models.chat_models import BaseChatModel
from langchain_core.messages import BaseMessage, AIMessage, HumanMessage, SystemMessage
from langchain_core.outputs import ChatResult, ChatGeneration
from pydantic import Field, validator

load_dotenv()

class GroqLLM(BaseChatModel):
    """Groq LLM wrapper for LangChain with streaming support."""

    client: Any = Field(default=None, exclude=True)
    model_name: str = Field(default="llama-3.1-8b-instant")
    temperature: float = Field(default=0.7)
    max_tokens: int = Field(default=1024)
    streaming: bool = Field(default=False)
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        
        # 1. Try loading from secrets.toml (Streamlit style)
        api_key = None
        secrets_path = os.path.join(os.path.dirname(__file__), "secrets.toml")
        if os.path.exists(secrets_path):
            try:
                with open(secrets_path, "r") as f:
                    for line in f:
                        if "GROQ_API_KEY" in line:
                            # Crude TOML parsing: key = "value"
                            parts = line.split("=", 1)
                            if len(parts) == 2:
                                api_key = parts[1].strip().strip('"').strip("'")
                                print(f"key loaded from secrets.toml")
                                break
            except Exception as e:
                print(f"Error reading secrets.toml: {e}")

        # 2. Fallback to Environment Variable
        if not api_key:
            api_key = os.getenv("GROQ_API_KEY")
            
        if not api_key:
             raise ValueError("groq_api_key not found in secrets.toml or environment variables")
             
        self.client = Groq(api_key=api_key)

    @property
    def _llm_type(self) -> str:
        return "groq"
    
    @property
    def _identifying_params(self) -> Dict[str, Any]:
        return {
            "model_name": self.model_name,
            "temperature": self.temperature,
            "max_tokens": self.max_tokens,
            "streaming": self.streaming
        }

    def _convert_messages_to_groq_format(self, messages: List[BaseMessage]) -> List[Dict]:
        groq_messages = []
        for message in messages:
            if isinstance(message, SystemMessage):
                groq_messages.append({"role": "system", "content": message.content})
            elif isinstance(message, AIMessage):
                groq_messages.append({"role": "assistant", "content": message.content})
            elif isinstance(message, HumanMessage):
                groq_messages.append({"role": "user", "content": message.content})
        return groq_messages

    def _create_chat_result(self, response: Any) -> ChatResult:
        text = response.choices[0].message.content
        return ChatResult(
            generations=[ChatGeneration(message=AIMessage(content=text))]
        )

    def _generate(self, messages: List[BaseMessage], stop=None, **kwargs) -> ChatResult:
        groq_messages = self._convert_messages_to_groq_format(messages)

        # ✅ Streaming mode
        if self.streaming:
            completion = self.client.chat.completions.create(
                model=self.model_name,
                messages=groq_messages,
                max_completion_tokens=self.max_tokens,
                temperature=self.temperature,
                stream=True
            )

            collected = []
            for chunk in completion:
                delta = chunk.choices[0].delta.content or ""
                print(delta, end="", flush=True)
                collected.append(delta)

            return ChatResult(
                generations=[ChatGeneration(message=AIMessage(content="".join(collected)))]
            )

        # ✅ Non-stream
        response = self.client.chat.completions.create(
            model=self.model_name,
            messages=groq_messages,
            temperature=self.temperature,
            max_tokens=self.max_tokens,
            stop=stop,
            stream=False
        )

        return self._create_chat_result(response)

    async def _agenerate(self, messages, stop=None, **kwargs):
        return self._generate(messages, stop=stop, **kwargs)


def get_llm(model="llama-3.1-8b-instant", streaming=False):
    """Return Groq LLM for use in Streamlit or async agents."""
    return GroqLLM(model_name=model, streaming=streaming)
