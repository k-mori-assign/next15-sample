'use server';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { firebaseAuth } from '@/lib/firebase-client';
import { z } from 'zod';

const signUpSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(6, 'パスワードは6文字以上で入力してください'),
});

export async function signUp(formData: FormData) {
  try {
    const validatedFields = signUpSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    if (!validatedFields.success) {
      return { error: '入力データが無効です' };
    }

    const { email, password } = validatedFields.data;

    // Firebase Authでアカウント作成
    const userCredential = await createUserWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );

    const user = userCredential.user;

    return { success: true, userId: user.uid };
  } catch (error: unknown) {
    console.error('Sign up error:', error);
    
    if (error && typeof error === 'object' && 'code' in error) {
      const errorCode = error.code as string;
      
      if (errorCode === 'auth/email-already-in-use') {
        return { error: 'このメールアドレスは既に使用されています' };
      } else if (errorCode === 'auth/weak-password') {
        return { error: 'パスワードは6文字以上で入力してください' };
      } else if (errorCode === 'auth/invalid-email') {
        return { error: '有効なメールアドレスを入力してください' };
      }
    }
    
    return { error: '会員登録中にエラーが発生しました' };
  }
} 
