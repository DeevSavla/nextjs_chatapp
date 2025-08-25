"use client"

import { useState } from "react";
import { Send, MessageCircle, Loader2 } from "lucide-react";

export default function Home() {
  const [message, setMessage] = useState("")
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)
  const [streaming, setStreaming] = useState("")
  const [streamResponse, setStreamResponse] = useState("")

  const handleChat = async () => {
    if (!message.trim()) return;
    
    setLoading(true)
    setResponse("")

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      })

      const data = await res.json()
      setResponse(data.response)
    } catch (error: any) {
      setResponse("Error: " + error.message)
    }

    setLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleChat()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Chat Assistant
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Start a conversation with our intelligent AI assistant
          </p>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Input Section */}
          <div className="p-6 border-b border-gray-100">
            <div className="relative">
              <textarea 
                value={message} 
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here... (Press Enter to send)"
                rows={4}
                className="w-full p-4 pr-14 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
                disabled={loading}
              />
              <button
                onClick={handleChat}
                disabled={loading || !message.trim()}
                className="absolute bottom-3 right-3 p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
            
            {/* Character Counter */}
            <div className="flex justify-between items-center mt-2">
              <div className="text-sm text-gray-500">
                {message.length > 0 && `${message.length} characters`}
              </div>
              <div className="text-sm text-gray-400">
                Shift + Enter for new line
              </div>
            </div>
          </div>

          {/* Response Section */}
          <div className="p-6">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-3 text-blue-600">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="text-lg font-medium">Thinking...</span>
                </div>
              </div>
            )}
            
            {response && !loading && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-700 font-semibold">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  AI Response:
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {response}
                  </p>
                </div>
              </div>
            )}
            
            {!response && !loading && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">
                  Send a message to start the conversation
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p className="text-sm">
            Powered by AI • Built with Next.js
          </p>
        </div>
      </div>
    </div>
  );
}