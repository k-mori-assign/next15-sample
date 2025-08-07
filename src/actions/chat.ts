'use server';

import { revalidateTag } from 'next/cache';
import { sendChatMessage } from '@/apis/chat';
import type { PostMessageParams } from '@/types/chat';

export async function sendMessageAction(request: PostMessageParams) {
  try {
    // await new Promise(resolve => setTimeout(resolve, 2000));
    // throw new Error('test');
    const result = await sendChatMessage(request);
    
    // チャットメッセージのキャッシュを無効化
    revalidateTag('chat-messages');
    
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in sendMessageAction:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
} 
