# Builder Admin Monitor

The local admin monitor is a static public-builder dashboard for checking the builder package surface before launch.

Run:

```bash
npm run admin:monitor
```

Open:

```txt
http://127.0.0.1:4177
```

## Scope

The monitor shows public-builder status only:

- SDK build and test gate
- OpenAPI and docs surface
- DNA x402 normal payment path
- optional Dark Null private receipt path
- `$NULL` flywheel metadata
- local cleanliness checks for secrets and machine-specific paths
- cropped local `$NULL` logo asset

It does not expose private backend source, database routes, runtime secrets, operator wallets, private server config, or deployment keys.

## Verify Before Sharing

Use this command before publishing or handing the repo to another builder:

```bash
git pull --ff-only && npm ci && npm run acceptance
```

The admin monitor is intentionally plain: operational panels, status rows, and copyable commands. No hidden runtime dependency is required.
