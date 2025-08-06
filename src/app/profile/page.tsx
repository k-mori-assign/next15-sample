import { auth } from '@/lib/auth';
import { getProfile, type UserProfile } from '@/apis/profile';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function ProfilePage() {
  const session = await auth();
  
  if (!session) {
    redirect('/auth/signin');
  }

  // デバッグ用：セッション情報を確認
  console.log('Session:', {
    user: session.user,
    hasFirebaseToken: !!session.firebaseIdToken,
    hasRefreshToken: !!session.firebaseRefreshToken,
  });

  // トップレベルでAPI取得とエラーハンドリング
  let profile: UserProfile | null = null;
  let error: string | null = null;

  try {
    profile = await getProfile();
  } catch (err) {
    console.error('Profile error:', err);
    error = err instanceof Error ? err.message : '不明なエラー';
  }

  // エラーがある場合はエラー画面を表示
  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-red-600">
                    エラーが発生しました
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    プロフィール情報の取得に失敗しました
                  </p>
                </div>
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  トップに戻る
                </Link>
              </div>
              <div className="mt-4 p-4 bg-gray-100 rounded-md">
                <p className="text-sm text-gray-700">
                  <strong>エラー詳細:</strong> {error || 'プロフィールデータが取得できませんでした'}
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  <strong>セッション情報:</strong>
                </p>
                <ul className="text-sm text-gray-600 mt-1 ml-4">
                  <li>ユーザーID: {session.user.id}</li>
                  <li>メール: {session.user.email}</li>
                  <li>Firebaseトークン: {session.firebaseIdToken ? 'あり' : 'なし'}</li>
                  <li>リフレッシュトークン: {session.firebaseRefreshToken ? 'あり' : 'なし'}</li>
                </ul>
                <p className="text-sm text-gray-700 mt-2">
                  <strong>環境変数:</strong> API_BASE_URL = {process.env.API_BASE_URL || '未設定'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // プロフィール情報を表示
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  プロフィール情報
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  ユーザーの詳細情報
                </p>
              </div>
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                トップに戻る
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">姓</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {profile.firstName}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">名</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {profile.lastName}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">性別</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {profile.gender === 'male' ? '男性' : 
                   profile.gender === 'female' ? '女性' : '未設定'}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">生年月日</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {profile.birthday}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">電話番号</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {profile.telephoneNumber}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">都道府県ID</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {profile.prefectureId}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
} 
