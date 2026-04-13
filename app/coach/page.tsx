"use client";

import { useChat } from "ai/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function CoachPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat({
      api: "/api/chat", // We'll add this endpoint
      initialMessages: [
        {
          id: "1",
          role: "assistant",
          content:
            "I'm here to help with your health goals. What would you like to chat about?",
        },
      ],
    });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="p-4 bg-white shadow">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Health Coach Chat</h1>
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 rounded-lg ${msg.role === "user" ? "bg-blue-100 text-right" : "bg-white"}`}
            >
              <p>{msg.content}</p>
            </div>
          ))}
          {isLoading && (
            <div className="p-3 bg-gray-100 rounded-lg">Thinking...</div>
          )}
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg">
              {error.message}
            </div>
          )}
        </div>
      </div>

      <div className="p-4 bg-white border-t">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
