"use client";

import { useState } from "react";
import { Send, MessageCircle, Loader2, Zap } from "lucide-react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [streamResponse, setStreamResponse] = useState("");

  const handleChat = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setResponse("");
    setStreamResponse("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      setResponse(data.response);
    } catch (error: any) {
      setResponse("Error: " + error.message);
    }

    setLoading(false);
  };

  const handleStreamChat = async () => {
    if (!message.trim()) return;

    setStreaming(true);
    setResponse("");
    setStreamResponse("");

    try {
      const res = await fetch("/api/stream-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!res.body) throw new Error("No response body");

      //pulls out each chunk data and reads it 
      const reader = res.body.getReader();
      //converts bytes into plain text 
      const decoder = new TextDecoder();

      while (true) {
        //promise when reader reads the chunk of data
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        setStreamResponse((prev) => prev + chunk); // ✅ append safely
      }
    } catch (error: any) {
      setStreamResponse("Error: " + error.message);
    }

    setStreaming(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleChat();
    } else if (e.key === "Enter" && e.shiftKey && e.ctrlKey) {
      e.preventDefault();
      handleStreamChat();
    }
  };

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
                placeholder="Type your message here... (Enter: Send, Ctrl+Shift+Enter: Stream)"
                rows={4}
                className="w-full p-4 pr-28 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
                disabled={loading || streaming}
              />

              {/* Button Group */}
              <div className="absolute bottom-3 right-3 flex gap-2">
                <button
                  onClick={handleStreamChat}
                  disabled={streaming || loading || !message.trim()}
                  className="p-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 group"
                  title="Stream Chat"
                >
                  {streaming ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Zap className="w-5 h-5" />
                  )}
                </button>

                <button
                  onClick={handleChat}
                  disabled={loading || streaming || !message.trim()}
                  className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
                  title="Regular Chat"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Character Counter */}
            <div className="flex justify-between items-center mt-2">
              <div className="text-sm text-gray-500">
                {message.length > 0 && `${message.length} characters`}
              </div>
              <div className="text-sm text-gray-400 text-right">
                <div>Enter: Send • Shift+Enter: New line</div>
                <div>Ctrl+Shift+Enter: Stream</div>
              </div>
            </div>
          </div>

          {/* Response Section */}
          <div className="p-6">
            {(loading || streaming) && (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-3 text-blue-600">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="text-lg font-medium">
                    {streaming ? "Streaming response..." : "Thinking..."}
                  </span>
                </div>
              </div>
            )}

            {/* Regular Response */}
            {response && !loading && !streaming && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-700 font-semibold">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  AI Response:
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {response}
                  </p>
                </div>
              </div>
            )}

            {/* Stream Response */}
            {streamResponse && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-700 font-semibold">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      streaming ? "bg-purple-500 animate-pulse" : "bg-green-500"
                    }`}
                  ></div>
                  AI Streaming Response:
                  {streaming && (
                    <span className="text-purple-600 text-sm font-normal">
                      (Live)
                    </span>
                  )}
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {streamResponse}
                    {streaming && (
                      <span className="inline-block w-2 h-5 bg-purple-500 ml-1 animate-pulse"></span>
                    )}
                  </p>
                </div>
              </div>
            )}

            {!response && !streamResponse && !loading && !streaming && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg mb-2">
                  Send a message to start the conversation
                </p>
                <div className="flex justify-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Send className="w-4 h-4" />
                    Regular Chat
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-4 h-4" />
                    Stream Chat
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p className="text-sm">Powered by AI • Built with Next.js</p>
        </div>
      </div>
    </div>
  );
}
