from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Dict, Any
import json
import asyncio
import uuid
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="Strands Chat App", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class ChatMessage(BaseModel):
    id: str
    user_id: str
    username: str
    message: str
    timestamp: datetime
    message_type: str = "user"  # user, system, tool

class ToolUsage(BaseModel):
    id: str
    tool_name: str
    parameters: Dict[str, Any]
    result: Dict[str, Any]
    timestamp: datetime
    execution_time: float
    status: str  # success, error, pending

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.user_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.active_connections.append(websocket)
        self.user_connections[user_id] = websocket

    def disconnect(self, websocket: WebSocket, user_id: str):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        if user_id in self.user_connections:
            del self.user_connections[user_id]

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                # Remove broken connections
                if connection in self.active_connections:
                    self.active_connections.remove(connection)

# Global instances
manager = ConnectionManager()
chat_history: List[ChatMessage] = []
tool_usage_history: List[ToolUsage] = []

# Simulate Strands SDK functionality
class MockStrandsSDK:
    def __init__(self):
        self.tools = {
            "web_search": {"description": "Search the web for information", "usage_count": 0},
            "code_analyzer": {"description": "Analyze code patterns", "usage_count": 0},
            "data_processor": {"description": "Process and transform data", "usage_count": 0},
            "text_summarizer": {"description": "Summarize long text content", "usage_count": 0},
            "image_generator": {"description": "Generate images from text", "usage_count": 0}
        }
    
    async def execute_tool(self, tool_name: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Simulate tool execution"""
        await asyncio.sleep(1)  # Simulate processing time
        
        if tool_name not in self.tools:
            raise ValueError(f"Tool {tool_name} not found")
        
        self.tools[tool_name]["usage_count"] += 1
        
        # Mock results based on tool type
        mock_results = {
            "web_search": {"results": ["Result 1", "Result 2", "Result 3"], "count": 3},
            "code_analyzer": {"complexity": "medium", "issues": 2, "suggestions": ["Use more descriptive variable names"]},
            "data_processor": {"processed_rows": 1000, "output_format": "json"},
            "text_summarizer": {"summary": "This is a summarized version of the input text.", "reduction": "75%"},
            "image_generator": {"image_url": "https://example.com/generated-image.png", "style": "photorealistic"}
        }
        
        return mock_results.get(tool_name, {"status": "completed"})
    
    def get_tool_stats(self) -> Dict[str, Any]:
        """Get tool usage statistics"""
        return {
            "tools": self.tools,
            "total_executions": sum(tool["usage_count"] for tool in self.tools.values()),
            "last_updated": datetime.now().isoformat()
        }

strands_sdk = MockStrandsSDK()

# WebSocket endpoint for real-time chat
@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            # Create chat message
            chat_message = ChatMessage(
                id=str(uuid.uuid4()),
                user_id=user_id,
                username=message_data.get("username", f"User {user_id}"),
                message=message_data["message"],
                timestamp=datetime.now()
            )
            
            chat_history.append(chat_message)
            
            # Broadcast to all connected clients
            await manager.broadcast(json.dumps({
                "type": "chat_message",
                "data": chat_message.dict()
            }, default=str))
            
            # Check if message contains tool command
            if message_data["message"].startswith("/tool"):
                await handle_tool_command(message_data["message"], user_id)
                
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)

async def handle_tool_command(message: str, user_id: str):
    """Handle tool execution commands"""
    try:
        # Parse tool command: /tool tool_name param1=value1 param2=value2
        parts = message.split(" ")
        if len(parts) < 2:
            return
        
        tool_name = parts[1]
        parameters = {}
        
        # Parse parameters
        for part in parts[2:]:
            if "=" in part:
                key, value = part.split("=", 1)
                parameters[key] = value
        
        # Record tool usage start
        tool_usage = ToolUsage(
            id=str(uuid.uuid4()),
            tool_name=tool_name,
            parameters=parameters,
            result={},
            timestamp=datetime.now(),
            execution_time=0,
            status="pending"
        )
        tool_usage_history.append(tool_usage)
        
        # Notify clients about tool execution start
        await manager.broadcast(json.dumps({
            "type": "tool_execution_start",
            "data": tool_usage.dict()
        }, default=str))
        
        # Execute tool
        start_time = datetime.now()
        try:
            result = await strands_sdk.execute_tool(tool_name, parameters)
            execution_time = (datetime.now() - start_time).total_seconds()
            
            # Update tool usage record
            tool_usage.result = result
            tool_usage.execution_time = execution_time
            tool_usage.status = "success"
            
            # Send tool result as system message
            system_message = ChatMessage(
                id=str(uuid.uuid4()),
                user_id="system",
                username="Strands AI",
                message=f"Tool '{tool_name}' executed successfully. Result: {json.dumps(result, indent=2)}",
                timestamp=datetime.now(),
                message_type="tool"
            )
            chat_history.append(system_message)
            
            # Broadcast tool completion
            await manager.broadcast(json.dumps({
                "type": "tool_execution_complete",
                "data": tool_usage.dict()
            }, default=str))
            
            await manager.broadcast(json.dumps({
                "type": "chat_message",
                "data": system_message.dict()
            }, default=str))
            
        except Exception as e:
            execution_time = (datetime.now() - start_time).total_seconds()
            tool_usage.result = {"error": str(e)}
            tool_usage.execution_time = execution_time
            tool_usage.status = "error"
            
            # Send error message
            error_message = ChatMessage(
                id=str(uuid.uuid4()),
                user_id="system",
                username="Strands AI",
                message=f"Tool '{tool_name}' failed: {str(e)}",
                timestamp=datetime.now(),
                message_type="system"
            )
            chat_history.append(error_message)
            
            await manager.broadcast(json.dumps({
                "type": "tool_execution_error",
                "data": tool_usage.dict()
            }, default=str))
            
            await manager.broadcast(json.dumps({
                "type": "chat_message",
                "data": error_message.dict()
            }, default=str))
            
    except Exception as e:
        print(f"Error handling tool command: {e}")

# REST API endpoints
@app.get("/")
async def root():
    return {"message": "Strands Chat App API", "version": "1.0.0"}

@app.get("/chat/history")
async def get_chat_history():
    """Get chat message history"""
    return {"messages": [msg.dict() for msg in chat_history]}

@app.get("/tools/available")
async def get_available_tools():
    """Get list of available tools"""
    return {"tools": strands_sdk.tools}

@app.get("/tools/stats")
async def get_tool_stats():
    """Get tool usage statistics"""
    return strands_sdk.get_tool_stats()

@app.get("/tools/usage")
async def get_tool_usage_history():
    """Get tool usage history"""
    return {"usage_history": [usage.dict() for usage in tool_usage_history]}

@app.post("/tools/{tool_name}/execute")
async def execute_tool_api(tool_name: str, parameters: Dict[str, Any]):
    """Execute a tool via REST API"""
    try:
        result = await strands_sdk.execute_tool(tool_name, parameters)
        
        # Record usage
        tool_usage = ToolUsage(
            id=str(uuid.uuid4()),
            tool_name=tool_name,
            parameters=parameters,
            result=result,
            timestamp=datetime.now(),
            execution_time=1.0,  # Placeholder
            status="success"
        )
        tool_usage_history.append(tool_usage)
        
        return {"result": result, "usage_id": tool_usage.id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)