# AGENTS.md — AI 共通ルール

このリポジトリで作業するすべての AI エージェント（Claude Code、Codex、GitHub Copilot ほか）が従うルールです。
Claude Code 固有の補足は `CLAUDE.md` にあります。

## プロジェクト概要

- Web サイト監視システム（HTTP 死活監視）。ローカル実行専用。VPS・n8n には依存しない。
- Node.js 22 以上、ES Modules、外部依存パッケージなし。
- 判定: HTTP 200 は `UP`。それ以外のステータス、タイムアウト、接続エラー、不正 URL は `DOWN`。

| 用途 | コマンド |
| --- | --- |
| テスト | `npm test` |
| 監視対象のテスト用サーバー起動 | `npm start` |
| URL を直接チェック | `node src/cli.js <url> [url ...]` |

テストはループバック上のローカルサーバーだけを使い、外部ネットワークに出ない。

## 作業の流れ

1. 作業は必ず GitHub Issue から始める。Issue の「完了条件」と「範囲外」を読んでから着手する。
2. ブランチ名は `issue-<番号>-<短い英語の説明>`。`main` へ直接コミットしない。
3. 実装したら `npm test` を実行し、結果を PR に書く。
4. PR 本文に `Closes #<番号>` を入れ、`.github/pull_request_template.md` の項目を埋める。
5. 独立レビュー（Codex）と GitHub Actions の結果を受けて、人間が最終判断する。
6. 設計上の判断をしたら `docs/decisions/` に記録し、作業終了時に `docs/handover/` を更新する。

## 役割

| 担当 | 役割 |
| --- | --- |
| Claude Code | 実装とテスト |
| Codex | 独立レビュー（実装者とは別の視点で、コードと根拠を検証する） |
| GitHub Copilot | コード補完、小規模修正 |
| GitHub Actions | 自動テスト |
| 人間 | 最終承認、マージ、外部への書き込みの承認 |

実装したエージェントが、自分の変更のレビュー担当を兼ねない。

## 禁止事項と承認が必要な操作

- 禁止: `main` への直接 push、force push、履歴の書き換え、本番環境・VPS・本番 DB の操作。
- 禁止: 秘密情報（API キー、パスワード、トークン、秘密鍵）をコード、コミット、ログ、Issue、PR、チャットに書くこと。`.env` を読まないこと。
- 禁止: 未追跡ファイルや未コミット変更の削除・上書き（`git reset --hard`、`git clean`、`git checkout -- <file>` など）。
- 人間の承認が必要: push、PR の作成・更新、Issue の作成・更新、Docker の起動、新しい依存パッケージの追加。

## 完了の定義

- `npm test` がすべて成功している。
- 変更に対応するテストを追加または更新している（ドキュメントのみの変更を除く）。
- PR テンプレートの項目が埋まっている。
- 判断があれば `docs/decisions/`、作業終了時は `docs/handover/` に記録がある。
