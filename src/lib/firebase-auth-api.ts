// Firebase Auth REST APIを使用したトークン更新
export async function refreshFirebaseToken(refreshToken: string): Promise<{
  idToken: string;
  refreshToken: string;
  expiresIn: string;
}> {
  const response = await fetch(`https://securetoken.googleapis.com/v1/token?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh Firebase token');
  }

  const data = await response.json();
  
  return {
    idToken: data.id_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
  };
} 
