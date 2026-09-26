# ExecViz Release Checklist

## Product behavior

- [ ] JavaScript assignment example replays correctly.
- [ ] Loop example shows line changes and variable changes.
- [ ] Function example shows call-stack changes.
- [ ] Console events appear at the correct step.
- [ ] Previous, Next, Reset, Play, and Pause behave correctly.
- [ ] New runs clear stale trace, error, and playback state.
- [ ] Parse, runtime, timeout, oversized-input, and empty-input states are readable.

## Technical validation

- [ ] One canonical `/api/execute` route is documented and used.
- [ ] Real variables are present in scope snapshots.
- [ ] `npm ci` passes.
- [ ] `npm run typecheck` passes.
- [ ] `npm run lint` passes with no errors.
- [ ] `npm run build` passes.
- [ ] Automated tests pass.
- [ ] `git diff --check` passes.

## Security

- [ ] No host secrets are visible to user code.
- [ ] Timeout, code-size, and trace-step limits are enforced.
- [ ] VM limitations are documented.
- [ ] Production isolation decision is recorded.
- [ ] Rate limiting and abuse controls are planned before public untrusted execution.

## Docs and demo

- [ ] README quickstart works from a clean checkout.
- [ ] `.env.example` is current.
- [ ] Three demo snippets are included.
- [ ] A short demo recording or screenshots are available.
- [ ] Known limitations are listed.
- [ ] Version 0 tag and release notes are created.

## Rollback

- [ ] Previous known-good commit is identified.
- [ ] Rollback steps are documented.
- [ ] Deployment can be disabled without deleting user data.
