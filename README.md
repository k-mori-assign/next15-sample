# Next.js 15 + Firebase Auth + NextAuth v5 サンプル

Firebase AuthとNextAuth v5を組み合わせた認証システムのサンプルプロジェクトです。

## 機能

- Firebase Authによる認証（メール/パスワード、Google）
- NextAuth v5によるセッション管理
- JWT内にFirebaseのアクセストークンとリフレッシュトークンを保存
- 24時間のログイン保持
- Firebase Auth REST APIを使用したトークン更新
- Google認証でFirebase AuthのsignInWithCredentialを使用
- プロフィール画面での外部API呼び出し

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定してください：

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Firebase Config (Client)
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Firebase Admin SDK (Server)
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_CLIENT_ID=your-client-id
FIREBASE_ADMIN_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_ADMIN_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_ADMIN_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40your-project.iam.gserviceaccount.com

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# API
API_BASE_URL=https://api.example.com
```

### 3. Firebaseプロジェクトの設定

1. [Firebase Console](https://console.firebase.google.com/)でプロジェクトを作成
2. Authenticationを有効化し、メール/パスワードとGoogleプロバイダーを設定
3. プロジェクト設定からWebアプリを追加し、設定値を取得
4. サービスアカウントキーを生成し、Admin SDKの設定値を取得

### 4. Google OAuthの設定

1. [Google Cloud Console](https://console.cloud.google.com/)でOAuth 2.0クライアントIDを作成
2. 承認済みのリダイレクトURIに`http://localhost:3000/api/auth/callback/google`を追加

### 5. 開発サーバーの起動

```bash
npm run dev
```

## 使用方法

1. ホームページ（`/`）にアクセス
2. 「Googleでサインイン」または「会員登録」「サインイン」をクリック
3. メール/パスワードまたはGoogleで認証
4. 認証後、プロフィールページでユーザー情報を確認

## アーキテクチャ

### 認証フロー

1. **メール/パスワード認証**
   - ユーザーがメール/パスワードを入力
   - Firebase Authで認証
   - NextAuthのJWTにFirebaseトークンを保存

2. **Google認証**
   - ユーザーがGoogleでサインイン
   - NextAuthのsignInコールバックでGoogleのIDトークンを取得
   - Firebase Authの`signInWithCredential`を使用してサインイン
   - Firebaseのトークンを取得してNextAuthのユーザー情報に保存
   - JWTコールバックでトークンをJWTに保存

3. **トークン更新**
   - Firebase Auth REST APIを使用してリフレッシュトークンでトークンを更新
   - 24時間のセッション保持

### セキュリティ

- Firebaseトークンはサーバーサイドでのみアクセス可能
- クライアントサイドにはトークンが漏洩しない
- 外部API呼び出し時はサーバーサイドでトークンを使用
- Firebase Auth REST APIを使用した安全なトークン更新

## ファイル構成

```
src/
├── app/
│   ├── api/auth/[...nextauth]/route.ts  # NextAuth APIルート
│   ├── auth/
│   │   ├── signin/page.tsx              # サインインページ
│   │   └── signup/page.tsx              # 会員登録ページ
│   ├── profile/
│   │   ├── page.tsx                     # プロフィールページ
│   │   └── loading.tsx                  # ローディング状態
│   └── page.tsx                         # ホームページ
├── actions/
│   └── auth.ts                          # 認証関連のServerActions
├── apis/
│   └── profile.ts                       # プロフィールAPIクライアント
├── lib/
│   ├── auth.ts                          # NextAuth設定
│   ├── firebase.ts                      # Firebase Admin SDK
│   ├── firebase-client.ts               # Firebase Client SDK
│   └── firebase-auth-api.ts             # Firebase Auth REST API
└── types/
    └── auth.ts                          # 認証関連の型定義
```

## 技術的な詳細

### Firebase Auth REST API

- `https://securetoken.googleapis.com/v1/token` - リフレッシュトークンを使用したトークン更新

### Google認証の流れ

1. NextAuthでGoogle認証を実行
2. signInコールバックでGoogleのIDトークンを取得
3. Firebase Authの`signInWithCredential`を使用してサインイン
4. FirebaseのIDトークンとリフレッシュトークンを取得
5. NextAuthのユーザー情報に保存
6. JWTコールバックでJWTに保存

### コールバックの役割分担

- **signInコールバック**: Google認証時にFirebase Authでサインインし、トークンを取得
- **JWTコールバック**: トークンをJWTに保存し、リフレッシュ処理を実行
- **sessionコールバック**: セッションにトークンを含める（サーバーサイドのみ）

## 注意事項

- 本番環境では適切な環境変数を設定してください
- Firebase Admin SDKの秘密鍵は安全に管理してください
- Google OAuthの設定は本番環境のドメインに合わせて更新してください
- Firebase Auth REST APIの使用には適切なAPIキーが必要です
