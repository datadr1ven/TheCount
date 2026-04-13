"use client";

import { useState, useEffect } from "react";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content:
            "I'm here to help with your health goals. What would you like to chat about?",
        },
      ]);
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await generateText({
        model: openai("gpt-4o-mini"),
        prompt: `You are a health coach. Respond helpfully and encourage healthy habits. Context: ${messages.map((m) => `${m.role}: ${m.content}`).join("\n")}\nuser: ${input}`,
        system:
          "You are a knowledgeable health coach focused on fitness, nutrition, and well-being.",
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: response.text,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError("Failed to get response. Please check your API key.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

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
          {messages.map((msg, index) => (
            <div
              key={index}
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
              {error}
            </div>
          )}
        </div>
      </div>

      <div className="p-4 bg-white border-t">
        <div className="max-w-2xl mx-auto flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={isLoading}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
