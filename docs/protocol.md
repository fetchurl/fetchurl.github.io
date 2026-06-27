---
title: Protocol
description: Request shape, environment variables, trust model, and errors.
order: 2
---

This page is an **orientation**. Normative requirements live only in [fetchurl/spec `SPEC.md`](https://github.com/fetchurl/spec/blob/main/SPEC.md). When this site and the spec disagree, the **spec wins**.

## Motivation

- Repeated downloads in CI
- No shared standard for content-addressable caching across package managers
- Workflow caches are often keyed by intention (lockfile hash, derivation) rather than **content**
- Avoid MITM caching proxies and “redownload everything” as the only options

## Request

```http
GET /api/fetchurl/sha256/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 HTTP/1.1
X-Source-Urls: "https://cdn1.example/file.tar.gz", "https://backup.example/archive.tgz"
```

- Path segments: **algorithm** (lowercase, letters matching `[a-z0-9]` only) and **hash** (lowercase hex).
- `X-Source-Urls`: RFC 8941 list of source URLs. Prefer keeping it under 8192 characters.
- Sources should include **Content-Length**; without size, the server must reject.
- A source URL may be chosen **randomly** (mirror list). After streaming to the client starts, the server must **not** switch sources.

## Environment: `FETCHURL_SERVER`

| Rule | Behavior |
|------|----------|
| Full base URL(s) | Ready to append `/:algo/:hash` |
| Single value | Whole variable is one URL if it does not start with `"` |
| List | RFC 8941 list when first character is `"` |
| Empty / absent | Server support disabled |

Clients **must** check `FETCHURL_SERVER`. They **may** fall back to direct download on failure.

## Trust and verification

- Clients **must** assume the server is untrusted.
- Clients **must** verify the hash of bytes received.
- On hash mismatch at end of stream, the server **must** abort the connection; clients **must** treat non-graceful completion as rejection.
- Servers **may** stream while still hashing (TTFB optimization) but must abort if the final hash fails.

## Caching semantics (server)

- Cache entries may be **deleted at any time** (eviction policies are implementation-defined).
- Add/delete of a cache item must be **atomic**.
- On-disk layout suggestion: `/:algo/:shard/:hash` (shard = first *n* hex chars, default *n* = 2).
- Deduplicate concurrent fetches for the same `algo:hash` when practical.
- Real cache hits should send `Cache-Control: public, max-age=31536000, immutable`.
- Response `Content-Type` is always `application/octet-stream`.
- Health check: `GET …/health` under the same router as `FETCHURL_SERVER` (e.g. `/api/fetchurl/health`). **200** = healthy.

## Daisy chaining

Downstream servers may forward `X-Source-Urls` to upstreams so the upstream can fall back to origin sources.

## Errors (typical)

| Status | Meaning |
|--------|---------|
| **400** | Bad request (e.g. unsupported algorithm) |
| **404** | Cache miss and no usable sources |
| **502** | Upstream/source failed |
| Abrupt close | Treat as failure (e.g. hash mismatch) |

## Scope highlights

- Algorithms: sha1, sha256, sha512 (prefer sha256)
- Public (or well-hidden) data only — no auth in the protocol
- Focus: package manager dependency blobs and similar immutable artifacts
