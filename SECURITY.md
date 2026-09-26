# Security Policy

## Scope

ExecViz executes user-provided code. The current VM sandbox is intended for an educational/demo MVP and must not be treated as a production-grade isolation boundary.

## Current safety requirements

- Keep `require`, `process`, filesystem, network, and host secrets unavailable to user code.
- Enforce execution timeouts and trace-step limits.
- Enforce request-size limits.
- Avoid shell-string interpolation with user code.
- Do not commit `.env.local`, API keys, tokens, or credentials.

## Reporting a vulnerability

Do not open a public issue for a suspected sandbox escape or secret exposure. Contact the repository owner privately through GitHub before publishing details.

## Known limitation

Node's `vm` module is not a complete security boundary against every escape, resource exhaustion, or prototype-pollution scenario. A production deployment should use a separately isolated worker/container runtime with operating-system resource limits.
