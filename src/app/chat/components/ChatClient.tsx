'use client';

import { use, useOptimistic, startTransition } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import type { Message } from '@/types/chat';
import { sendMessageAction } from '@/actions/chat';

interface ChatClientProps {
  messagesPromise: Promise<Message[]>;
}

export function ChatClient({ messagesPromise }: ChatClientProps) {
  console.log('ChatClient render');
  const { data: session, status } = useSession();
  const initialMessages = use(messagesPromise);
  const [messages, addOptimisticMessage] = useOptimistic<Message[], Message>(
    initialMessages,
    (state, newMessage) => [...state, newMessage]
  );
  
  // 認証チェック
  if (status === 'loading') {
    return <div className="text-center py-8">認証情報を確認中...</div>;
  }
  
  if (!session) {
    redirect('/auth/signin');
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const message = formData.get('message') as string;
    
    if (!message.trim()) return;

    // 楽観的更新をstartTransitionでラップ
    const optimisticMessage: Message = {
      messageId: `optimistic-${Date.now()}`,
      message: message,
      sender: 'user',
      postedAt: new Date().toISOString(),
    };

    startTransition(() => {
      addOptimisticMessage(optimisticMessage);
    });

    // フォームをリセット
    e.currentTarget.reset();

    const result = await sendMessageAction({ message });
    if(!result.success)  {
      alert('Failed to send message');
    }
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-lg">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.messageId} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs p-3 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                <div className="text-sm font-medium mb-1">
                  {message.sender}
                </div>
                <div className="text-sm">{message.message}</div>
                <div className="text-xs opacity-70 mt-1">
                  {new Date(message.postedAt).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            name="message"
            type="text"
            placeholder="メッセージを入力..."
            className="flex-1 px-3 py-2 border rounded-md"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            送信
          </button>
        </form>
      </div>
    </div>
  );
} 
