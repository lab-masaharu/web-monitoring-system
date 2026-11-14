# 2026-11-15 AI 開発フローの共通ファイル整備

- 関連: ブランチ `chore/ai-dev-workflow`、決定記録 [0001](../decisions/0001-github-issue-driven-workflow.md)
- 担当: Claude Code

## 実施したこと

- `main`（3a8cbbb）からブランチを作成し、共通ファイルを追加した: `AGENTS.md`、`CLAUDE.md`、`docs/decisions/`、`docs/handover/`、`.github/ISSUE_TEMPLATE/`、`.github/pull_request_template.md`、`.github/workflows/ci.yml`。
- CI は既存の `npm test` をそのまま実行する（Node 22、依存パッケージなし、権限は `contents: read` だけ）。
- Issue テンプレートで使う `task` ラベルを作成した。
- 既存のソースコードとテストは変更していない。

## テスト結果

- `npm test`: 7 件成功、0 件失敗（ローカル、Node 22）。

## 未完了・未解決

- この変更の PR を作成し、GitHub Actions で CI が成功することを確認する。
- 独立レビューの運用は、このフローを 1 件通した後に開始する。

## 次にやること

1. この変更の PR を作成し、CI の結果を確認する。
2. 実証用の Issue を 1 件作り、Issue → 実装 → PR → レビュー → CI → 承認の流れを通す。
