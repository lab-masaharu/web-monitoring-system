# 0001. GitHub Issue を起点とする AI 開発フローを採用する

- 状態: 提案
- 日付: 2026-11-15
- 関連: ブランチ `chore/ai-dev-workflow`（このリポジトリが最初の実証対象）

## 背景

これまでは、別の場所で書いた長文の指示書を AI に手動でコピー＆ペーストして作業していた。
指示、実装、検証、判断の履歴が複数の場所に分散し、過去の議論を探す手間や、AI に同じ説明を繰り返す手間が増えていた。

## 決定

作業依頼、仕様、進捗、判断履歴を GitHub とリポジトリ内の Markdown に集約し、各 AI がそこを参照して作業する。

1. GitHub Issue で作業を依頼する（`.github/ISSUE_TEMPLATE/`）。
2. Claude Code が Issue を読み、ブランチで実装とテストを行う。
3. Pull Request で変更を提出する（`.github/pull_request_template.md`）。
4. Codex が独立レビューを行う。
5. GitHub Actions が自動テストを行う（`.github/workflows/ci.yml`）。
6. 人間が最終判断し、マージする。
7. 判断を `docs/decisions/`、引継ぎを `docs/handover/` に残す。

AI 共通ルールは `AGENTS.md`、Claude Code 固有の補足は `CLAUDE.md` に置く。

## 理由

- GitHub をコードと作業履歴の正本にすると、Issue、PR、レビュー、テスト結果が 1 か所でつながる。
- Markdown はツールに依存しないため、将来 AI を入れ替えても、ルールと履歴を再利用できる。
- push、PR 作成、本番操作には人間の承認を必須とし、AI の自律性と安全性を両立する。

## 影響・残課題

- 独立レビューの運用は、このフローを 1 件通した後に開始する。
- 認証は人間が自分で行う（認証情報を AI のチャットに入力しない）。
- `main` のブランチ保護の設定は、このフローが 1 件通った後に検討する。
