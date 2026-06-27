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

Configure storage directory, listen address, and eviction-related options via flags and environment (see `cmd/fetchurl` and `internal/app` in the repository).

## Container image

Published by CI as:

```text
ghcr.io/fetchurl/fetchurl
```

Also tagged with release versions. For local SDK integration tests you can build a local tag:

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
- Implements `/health` for readiness.
- Speaks the wire protocol from SPEC.md — use the SDKs or any compliant client with `FETCHURL_SERVER` pointing at your deployment.

## Specialized servers

The protocol allows other implementations (Workers, alternate languages, CDN-oriented stores). The Go server is the **reference**, not the only permitted design.
