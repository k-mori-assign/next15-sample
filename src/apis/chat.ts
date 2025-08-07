import { auth } from '@/lib/auth';
import type { Message, MessagesRes, PostMessageParams, SendMessageResponse } from '@/types/chat';

// テストユーザー： k_mori66666@gmail.com
const CHAT_ROOM_ID = 'A00134-999-1';

export async function getChatMessages(): Promise<Message[]> {
  const session = await auth();
  
  if (!session?.firebaseIdToken) {
    throw new Error('認証が必要です: Firebaseトークンが取得できません');
  }

  if (!process.env.API_BASE_URL) {
    throw new Error('API_BASE_URL環境変数が設定されていません');
  }

  const apiUrl = `${process.env.API_BASE_URL}/api/assign-career-change/v1/chat-rooms/${CHAT_ROOM_ID}/messages`;

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.firebaseIdToken}`,
        'Content-Type': 'application/json',
      },
      next: {
        tags: ['chat-messages'],
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Chat API Error:', {
        status: response.status,
        statusText: response.statusText,
        url: apiUrl,
        errorText,
      });
      throw new Error(`チャットメッセージの取得に失敗しました: ${response.status} ${response.statusText}`);
    }

    const data: MessagesRes = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    // 開発環境ではモックデータを返す
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          messageId: '1',
          message: 'こんにちは！',
          sender: 'user',
          postedAt: new Date().toISOString(),
        },
        {
          messageId: '2',
          message: 'はい、こんにちは！',
          sender: 'assistant',
          postedAt: new Date().toISOString(),
        },
      ];
    }
    throw error;
  }
}

export async function sendChatMessage(request: PostMessageParams): Promise<SendMessageResponse> {
  const session = await auth();
  
  if (!session?.firebaseIdToken) {
    throw new Error('認証が必要です: Firebaseトークンが取得できません');
  }

  if (!process.env.API_BASE_URL) {
    throw new Error('API_BASE_URL環境変数が設定されていません');
  }

  const apiUrl = `${process.env.API_BASE_URL}/api/assign-career-change/v1/chat-rooms/${CHAT_ROOM_ID}/messages`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.firebaseIdToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Chat Send API Error:', {
        status: response.status,
        statusText: response.statusText,
        url: apiUrl,
        errorText,
      });
      throw new Error(`メッセージの送信に失敗しました: ${response.status} ${response.statusText}`);
    }

    // レスポンスが空の場合の処理
    const responseText = await response.text();
    let data: SendMessageResponse;
    
    if (responseText.trim() === '') {
      // 空のレスポンスの場合は成功として扱う
      console.log('Chat Send API Response: Empty response (success)');
      data = {
        message: {
          messageId: `temp-${Date.now()}`,
          message: request.message,
          sender: 'user',
          postedAt: new Date().toISOString(),
        },
        success: true,
      };
    } else {
      // JSONレスポンスがある場合はパース
      data = JSON.parse(responseText);
      console.log('Chat Send API Response:', data);
    }
    
    return data;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
} 
