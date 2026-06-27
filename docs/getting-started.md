---
title: Getting started
description: Run a cache server and point clients with FETCHURL_SERVER.
order: 1
---

## What you need

1. A **fetchurl server** reachable from your CI or build agents.
2. Clients (SDKs or package managers) that implement the protocol and set **`FETCHURL_SERVER`**.
3. Known **algorithm**, **content hash** (lowercase hex), and **source URLs** for each artifact.

## Run the reference server

The Go reference implementation lives in [fetchurl/fetchurl](https://github.com/fetchurl/fetchurl).

```bash
go install github.com/fetchurl/fetchurl/cmd/fetchurl@latest
fetchurl server
```

Or use the published container image:

```bash
docker run --rm -p 8080:8080 ghcr.io/fetchurl/fetchurl
```

Configure storage paths and listen addresses via CLI flags and environment variables (see the server repository).

## Point clients at the server

`FETCHURL_SERVER` must be the **full base URL ready to append `/:algo/:hash`**.

Single server:

```bash
export FETCHURL_SERVER="http://cache.local:8080/api/fetchurl"
# client requests: http://cache.local:8080/api/fetchurl/sha256/<hash>
```

Multiple servers (RFC 8941 list — starts with `"`):

```bash
export FETCHURL_SERVER='"http://cache-a/api/fetchurl", "http://cache-b/api/fetchurl"'
```

If `FETCHURL_SERVER` is absent or empty, clients **must** treat server support as disabled and fall back to direct download behavior as they implement it.

## Verify hashes always

Servers are **untrusted**, even over TLS. Clients must verify the downloaded content against the expected hash and only accept streams that complete successfully. Protocol SDKs do this for you.

## Prefer sha256

When multiple algorithms are available, clients should prefer **sha256**. Supported algorithms in scope include sha1, sha256, and sha512 (see the [protocol](./protocol/) page and the normative [SPEC.md](https://github.com/fetchurl/spec/blob/main/SPEC.md)).

## Next steps

- [Protocol overview](./protocol/) — request shape, headers, errors
- [Server](./server/) — reference implementation notes
- [SDKs](./sdks/) — language clients
