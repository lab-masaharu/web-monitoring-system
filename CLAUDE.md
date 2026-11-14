# CLAUDE.md

共通ルールは AGENTS.md にあります。必ず従ってください。

@AGENTS.md

## Claude Code 向けの補足

- Issue の取得は `gh issue view <番号> --comments` を使う。
- PR は `gh pr create --fill-first` ではなく、PR テンプレートを埋めた本文で作成する。作成前に本文と差分の概要を人間に提示し、承認を得る。
- Docker（`docker`、`docker-compose`）は使わない。テストは `npm test` で実行する。
- 作業終了時は `docs/handover/` に引継ぎを書き、次の作業者が Issue 番号とブランチから再開できるようにする。
