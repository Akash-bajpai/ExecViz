# Execute API Contract

## Request

`POST /api/execute`

```json
{
  "code": "let total = 5; console.log(total);",
  "language": "javascript",
  "timeoutMs": 5000
}
```

Supported Version 0 languages: `javascript` and `typescript`.

## Success response

```json
{
  "success": true,
  "steps": [],
  "output": ["5"],
  "durationMs": 12
}
```

## Error response

```json
{
  "success": false,
  "steps": [],
  "output": [],
  "error": {
    "message": "Readable error message",
    "kind": "parse"
  },
  "durationMs": 3
}
```

`kind` is one of `parse`, `runtime`, `timeout`, or `internal`.

## Frontend integration checklist

- Store `steps` after a successful response.
- Reset the active step to zero for every run.
- Render `line`, `kind`, `callStack`, `scopes`, and `consoleOutput`.
- Display `error.message` and keep prior trace state from leaking into a failed run.
