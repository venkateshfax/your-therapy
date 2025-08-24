#!/usr/bin/env python3
"""
Simple test server to verify the basic structure works.
This uses only Python standard library modules.
"""

import http.server
import socketserver
import json
import urllib.parse
from datetime import datetime

class ChatHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            response = {
                "message": "Strands Chat App API (Test Version)",
                "version": "1.0.0",
                "status": "running",
                "timestamp": datetime.now().isoformat()
            }
            self.wfile.write(json.dumps(response).encode())
        
        elif self.path == '/health':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            response = {
                "status": "healthy",
                "timestamp": datetime.now().isoformat()
            }
            self.wfile.write(json.dumps(response).encode())
        
        elif self.path == '/tools/available':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            response = {
                "tools": {
                    "web_search": {"description": "Search the web for information", "usage_count": 0},
                    "code_analyzer": {"description": "Analyze code patterns", "usage_count": 0},
                    "data_processor": {"description": "Process and transform data", "usage_count": 0},
                    "text_summarizer": {"description": "Summarize long text content", "usage_count": 0},
                    "image_generator": {"description": "Generate images from text", "usage_count": 0}
                }
            }
            self.wfile.write(json.dumps(response).encode())
        
        else:
            self.send_response(404)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            response = {"error": "Not found"}
            self.wfile.write(json.dumps(response).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

if __name__ == "__main__":
    PORT = 8000
    print(f"🚀 Starting test server on port {PORT}")
    print(f"📱 API available at http://localhost:{PORT}")
    print("Note: This is a test server with limited functionality.")
    print("For full WebSocket support, install the required dependencies.")
    
    with socketserver.TCPServer(("", PORT), ChatHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Server stopped")