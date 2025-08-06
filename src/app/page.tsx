import { auth, signIn } from '@/lib/auth';
import Link from 'next/link';

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Next.js 15 + Firebase Auth + NextAuth v5
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Firebase AuthとNextAuth v5を組み合わせた認証システムのサンプル
          </p>
          
          <div className="mt-10">
            {session ? (
              <div className="space-y-4">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg max-w-md mx-auto">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      認証済みユーザー
                    </h3>
                    <div className="mt-2 max-w-xl text-sm text-gray-500">
                      <p>メール: {session.user.email}</p>
                      <p>名前: {session.user.name || '未設定'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center space-x-4">
                  <Link
                    href="/profile"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    プロフィールを見る
                  </Link>
                  <form action={async () => {
                    'use server';
                    const { signOut } = await import('@/lib/auth');
                    await signOut({ redirect: true, redirectTo: '/' });
                  }}>
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      サインアウト
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Google認証ボタン */}
                <div className="flex justify-center">
                  <form action={async () => {
                    'use server';
                    await signIn('google', { redirect: true, redirectTo: '/profile' });
                  }}>
                    <button
                      type="submit"
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Googleでサインイン
                    </button>
                  </form>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-50 text-gray-500">または</span>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <Link
                    href="/auth/signin"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    サインイン
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    会員登録
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
