# ExecViz Development Workflow

## 1. Start with a written task

Record the problem, user outcome, acceptance criteria, and affected contract in an issue or in `docs/PROJECT_STATUS.md`. Keep one focused change per branch.

## 2. Create a branch

```bash
git switch main
git pull --ff-only origin main
git switch -c feat/trace-playback
```

Use prefixes such as `feat/`, `fix/`, `docs/`, `test/`, or `chore/`.

## 3. Implement in vertical slices

Prefer a small end-to-end slice over isolated UI polish. For example: one assignment trace should travel from API response to active line, variable card, timeline, and test before adding loops or animations.

## 4. Validate locally

```bash
npm ci
npm run typecheck
npm run lint
npm run build
```

Run the manual smoke test in `docs/RELEASE_CHECKLIST.md` for execution changes. Never commit secrets, generated `.next` output, or local environment files.

## 5. Commit clearly

Use imperative messages such as `feat: add active trace step state` or `fix: reject oversized execution input`. Keep unrelated formatting out of feature commits.

## 6. Review before merge

Check the PR template, API contract, security impact, docs, tests, and screenshots. The active maintainer reviews behavior rather than trusting a green build alone.

## 7. Release deliberately

Merge only when CI passes. Tag a Version 0 release after the release checklist is complete. Update the changelog or release notes with known limitations.

## Emergency rollback

Keep the previous known-good commit or release tag available. Revert a bad merge rather than rewriting shared history.
