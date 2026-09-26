# Version 0 Checklist

## Foundation

- [x] Repository ownership and canonical remote confirmed
- [x] `.env.example` added
- [x] Contribution and security guidance added
- [x] Architecture and API contract documented
- [ ] Choose and document one active execution route

## Backend

- [x] JavaScript/TypeScript parsing and instrumentation exists
- [x] VM runner exists
- [x] Timeout and trace-step caps exist
- [ ] Confirm real variable values in snapshots
- [ ] Add API tests for valid, parse-error, runtime-error, timeout, and oversized code

## Frontend

- [x] Monaco editor exists
- [x] Run/output flow exists
- [ ] Store `ExecutionResult.steps`
- [ ] Add active-step state
- [ ] Add previous/next/reset controls
- [ ] Add play/pause and speed controls
- [ ] Highlight current source line
- [ ] Render variables, call stack, and step-aware console

## Release gate

- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] Manual smoke test passes on Windows
- [ ] Security limitations are visible in docs
- [ ] Demo script is recorded
- [ ] Version 0 tag/release is created
