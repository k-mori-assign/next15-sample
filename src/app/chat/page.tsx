import Link from 'next/link';
import { Suspense } from 'react';
import { getChatMessages } from '@/apis/chat';
import { ChatClient } from './components/ChatClient';

export const dynamic = 'force-dynamic';

function ChatClientWrapper() {
  const messagesPromise = getChatMessages();
  return <ChatClient messagesPromise={messagesPromise} />;
}

export default function ChatPage() {
  console.log('page render');
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-4">
        <Link href="/" className="text-blue-600 hover:underline">
          ← トップに戻る
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-6">チャット</h1>
      <Suspense fallback={<div className="text-center py-8">チャットを読み込み中...</div>}>
        <ChatClientWrapper />
      </Suspense>
    </div>
  );
} 
