# CLAUDE.md

共通ルールは AGENTS.md にあります。必ず従ってください。

@AGENTS.md

## Claude Code 向けの補足

- Issue は本文とコメントを分けて取得し、本文から目的・完了条件・範囲外を読み取る。
  - 本文: `gh issue view <番号>`
  - コメント: `gh issue view <番号> --json comments`（コメントが 0 件なら `{"comments":[]}` が返る）
  - `--comments` だけを付けると、対話端末以外ではコメントしか出力されず、本文を読めない。
- PR は `gh pr create --fill-first` ではなく、PR テンプレートを埋めた本文で作成する。作成前に本文と差分の概要を人間に提示し、承認を得る。
- Docker（`docker`、`docker-compose`）は使わない。テストは `npm test` で実行する。
- 作業終了時は `docs/handover/` に引継ぎを書き、次の作業者が Issue 番号とブランチから再開できるようにする。
