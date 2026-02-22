"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { conversationsApi } from "@/lib/api";
import { Conversation } from "@/types";
import { formatDateTime, truncate } from "@/lib/utils";
import Spinner from "@/components/ui/Spinner";
import Button from "@/components/ui/Button";
import { MessageSquare, Plus } from "lucide-react";

export default function MessagesPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const data = await conversationsApi.list();
      setConversations(data.results);
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartAiChat = async () => {
    try {
      const conv = await conversationsApi.startAiChat();
      router.push(`/chat?id=${conv.id}`);
    } catch {
      // silently fail
    }
  };

  if (isLoading) return <Spinner className="mt-20" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <Button onClick={handleStartAiChat} size="sm">
          <Plus className="w-4 h-4 mr-1" />
          AI Chat
        </Button>
      </div>

      {conversations.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No conversations yet</p>
          <Button onClick={handleStartAiChat} className="mt-4" size="sm">
            Start AI Chat
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() =>
                conv.type === "ai_chat"
                  ? router.push(`/chat?id=${conv.id}`)
                  : router.push(`/chat?id=${conv.id}`)
              }
              className="w-full bg-white rounded-xl border border-gray-200 p-4 text-left hover:border-primary-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900">
                      {conv.title || conv.type.replace("_", " ")}
                    </p>
                    {conv.last_message && (
                      <p className="text-sm text-gray-500 truncate">
                        {truncate(conv.last_message.content, 60)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-400 flex-shrink-0 ml-2">
                  {formatDateTime(conv.updated_at)}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
