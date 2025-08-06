import { auth } from '@/lib/auth';

export type UserProfile = {
  firstName: string;
  lastName: string;
  gender: 'male' | 'female' | 'none';
  birthday: string;
  telephoneNumber: string;
  prefectureId: number;
};

export async function getProfile(): Promise<UserProfile> {
  const session = await auth();
  
  if (!session?.firebaseIdToken) {
    throw new Error('認証が必要です: Firebaseトークンが取得できません');
  }

  const apiUrl = `${process.env.API_BASE_URL}/api/assign-career-change/v1/users/profile`;
  
  if (!process.env.API_BASE_URL) {
    throw new Error('API_BASE_URL環境変数が設定されていません');
  }

  console.log('API呼び出し:', {
    url: apiUrl,
    hasToken: !!session.firebaseIdToken,
    tokenLength: session.firebaseIdToken.length,
  });

  const response = await fetch(apiUrl, {
    headers: {
      'Authorization': `Bearer ${session.firebaseIdToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('API Error:', {
      status: response.status,
      statusText: response.statusText,
      url: apiUrl,
      errorText,
    });
    throw new Error(`プロフィールの取得に失敗しました: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  console.log('API Response:', data);
  
  return data;
} 
