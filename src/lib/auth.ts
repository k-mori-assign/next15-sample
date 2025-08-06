import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { signInWithEmailAndPassword, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { firebaseAuth } from './firebase-client';
import { refreshFirebaseToken } from './firebase-auth-api';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const userCredential = await signInWithEmailAndPassword(
            firebaseAuth,
            credentials.email as string,
            credentials.password as string
          );

          const user = userCredential.user;
          
          // Firebaseのトークンを取得
          const idToken = await user.getIdToken(true);
          const refreshToken = user.refreshToken;

          return {
            id: user.uid,
            email: user.email || '',
            name: user.displayName || '',
            image: user.photoURL || '',
            firebaseIdToken: idToken,
            firebaseRefreshToken: refreshToken,
          };
        } catch (error) {
          console.error('Firebase sign in error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' && account.id_token) {
        try {
          // GoogleのIDトークンを使用してFirebase Authでサインイン
          const credential = GoogleAuthProvider.credential(account.id_token);
          const userCredential = await signInWithCredential(firebaseAuth, credential);
          
          // Firebaseのトークンを取得
          const idToken = await userCredential.user.getIdToken(true);
          const refreshToken = userCredential.user.refreshToken;
          
          // NextAuthのユーザー情報を更新
          user.firebaseIdToken = idToken;
          user.firebaseRefreshToken = refreshToken;
          
          return true;
        } catch (error) {
          console.error('Error signing in with Google credential:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      // 初回サインイン時
      if (user) {
        token.firebaseIdToken = user.firebaseIdToken;
        token.firebaseRefreshToken = user.firebaseRefreshToken;
        // トークンの有効期限を設定（1時間 = 3600秒）
        token.firebaseTokenExpiry = Date.now() + (60 * 60 * 1000);
      }

      // トークンの有効期限をチェックして更新（Firebase Auth REST API使用）
      if (token.firebaseRefreshToken && token.firebaseTokenExpiry) {
        const now = Date.now();
        const expiryTime = token.firebaseTokenExpiry as number;
        
        // 有効期限の5分前になったら更新
        const shouldRefresh = now >= (expiryTime - (5 * 60 * 1000));
        
        if (shouldRefresh) {
          try {
            console.log('Refreshing Firebase token...');
            const firebaseTokens = await refreshFirebaseToken(token.firebaseRefreshToken as string);
            
            token.firebaseIdToken = firebaseTokens.idToken;
            token.firebaseRefreshToken = firebaseTokens.refreshToken;
            // 新しい有効期限を設定
            token.firebaseTokenExpiry = Date.now() + (parseInt(firebaseTokens.expiresIn) * 1000);
            
            console.log('Firebase token refreshed successfully');
          } catch (error) {
            console.error('Error refreshing Firebase token:', error);
            // リフレッシュに失敗した場合、トークンをクリア
            token.firebaseIdToken = undefined;
            token.firebaseRefreshToken = undefined;
            token.firebaseTokenExpiry = undefined;
          }
        }
      }

      return token;
    },
    async session({ session, token }) {
      // サーバーサイドでのみトークンを含める
      if (typeof window === 'undefined') {
        session.firebaseIdToken = token.firebaseIdToken as string;
        session.firebaseRefreshToken = token.firebaseRefreshToken as string;
      }
      
      session.user.id = token.sub || '';
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24時間
  },
  pages: {
    signIn: '/auth/signin',
  },
}); 
