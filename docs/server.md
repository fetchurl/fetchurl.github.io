---
title: Server
description: Reference Go server, CLI, and container image.
order: 3
---

## Reference implementation

Repository: [github.com/fetchurl/fetchurl](https://github.com/fetchurl/fetchurl)

This is the **reference server and CLI** for the protocol. It is not the protocol source of truth — that is [fetchurl/spec](https://github.com/fetchurl/spec).

Module path: `github.com/fetchurl/fetchurl`.

## Install

```bash
go install github.com/fetchurl/fetchurl/cmd/fetchurl@latest
```

## Run

```bash
go run ./cmd/fetchurl server
# or after install:
fetchurl server
```

HTTP routes (fixed path prefix on this implementation):

| Path | Role |
|------|------|
| `GET /api/fetchurl/{algo}/{hash}` | CAS fetch (with `X-Source-Urls` as needed) |
| `GET /api/fetchurl/health` | Health check — **200** when healthy |

Point clients at `http://<host>:<port>/api/fetchurl` via **`FETCHURL_SERVER`**.

## Configuration

Flags on `fetchurl server` (also settable via matching environment variables). Defaults match the reference CLI in [fetchurl/fetchurl](https://github.com/fetchurl/fetchurl).

| Flag | Environment | Default | Meaning |
|------|-------------|---------|---------|
| `--port` | `FETCHURL_PORT` | `8080` | Listen port |
| `--cache-dir` | `FETCHURL_CACHE_DIR` | `./cache` | On-disk blob store root |
| `--max-cache-size` | `FETCHURL_MAX_CACHE_SIZE` | `1073741824` (1 GiB) | Soft cap on total cached bytes |
| `--min-free-space` | `FETCHURL_MIN_FREE_SPACE` | `0` (disabled) | Minimum free disk bytes; when set, overrides max-cache-size for eviction pressure |
| `--eviction-interval` | `FETCHURL_EVICTION_INTERVAL` | `1m` | How often the server checks for eviction |
| `--eviction-strategy` | `FETCHURL_EVICTION_STRATEGY` | `lru` | Eviction strategy (`lru`) |
| `--upstream` | `FETCHURL_UPSTREAM` | _(none)_ | Daisy-chain upstream base URL(s); repeatable flag, or comma-separated in the env var |

Examples:

```bash
fetchurl server --port 8080 --cache-dir /var/cache/fetchurl --max-cache-size 10737418240

# Docker: pass the server subcommand after the image name
docker run --rm -p 8080:8080 \
  -v fetchurl-cache:/data \
  ghcr.io/fetchurl/fetchurl server --cache-dir /data
```

Upstream values are **fetchurl base URLs** (same shape as `FETCHURL_SERVER` entries), ready to append `/:algo/:hash`.

## Container image

Published by CI as:

```text
ghcr.io/fetchurl/fetchurl
```

Also tagged with release versions. The image **entrypoint** is the `fetchurl` binary with no default command, so you must pass **`server`** (and optional flags):

```bash
docker run --rm -p 8080:8080 ghcr.io/fetchurl/fetchurl server
```

For local SDK integration tests you can build a local tag:

```bash
docker build -t fetchurl:local .
# FETCHURL_TEST_IMAGE=fetchurl:local …
```

## Development

```bash
go test ./...
```

## Implementation notes

- Stores verified blobs; may evict according to policy (size, free space, LRU, etc.).
- Should dedupe in-flight requests for the same content key.
- Implements `/api/fetchurl/health` for readiness.
- Speaks the wire protocol from SPEC.md — use the SDKs or any compliant client with `FETCHURL_SERVER` pointing at your deployment.

## Specialized servers

The protocol allows other implementations (Workers, alternate languages, CDN-oriented stores). The Go server is the **reference**, not the only permitted design.
