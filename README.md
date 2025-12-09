# TanStack Start LWA Demo

**TanStack Start** を **AWS Lambda Web Adapter (LWA)** で動作させる最小構成のデモプロジェクトです。

## Status
PoC / Experimental

## Description
このリポジトリは、TanStack Start アプリケーションを Lambda Web Adapter を利用して AWS Lambda (Function URL) 上で動作させるための検証用構成です。

## QuickStart

### 前提条件
- DevContainer での起動を推奨します（Node.js 24, pnpm, AWS CLI, CDK がセットアップ済み）。
- AWS クレデンシャルが設定されていること（`aws configure` または環境変数）。

### 手順

1. 依存関係のインストール:
   ```bash
   pnpm install
   ```

2. デプロイ (CDK):
   ```bash
   # 初回のみ bootstrap が必要な場合があります
   # pnpm infra exec cdk bootstrap aws://<account-id>/us-east-1 aws://<account-id>/<your-region>

   pnpm infra cdk:deploy --all
   ```

3. 動作確認:
   デプロイ完了時に出力される CloudFront の URL にアクセスしてください。

## 構成

- `packages/app`: TanStack Start アプリケーション (Node.js 24 + LWA Dockerfile)
- `packages/infra`: AWS CDK (Lambda + Function URL + CloudFront)

## デバッグ：アプリケーションのローカル実行

```
# コンテナ起動
docker build -t tanstack-app:latest .
docker run --rm -it --name tanstack-app -p 3000:3000 tanstack-app:latest

# リクエスト送信
# devcontainer内から実行する場合（localhostではアクセスできない）
curl http://$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' tanstack-app):3000/

# ホストPCから実行する場合
curl http://localhost:3000/
```
