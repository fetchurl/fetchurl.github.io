---
title: SDKs
description: Language clients for JavaScript, Python, Rust, and Java.
order: 4
---

All SDKs implement **protocol-level** client behavior against [fetchurl/spec](https://github.com/fetchurl/spec). They treat the server as untrusted and verify hashes.

| Language | Repository | Package notes |
|----------|------------|---------------|
| JavaScript / TypeScript | [fetchurl/sdk-js](https://github.com/fetchurl/sdk-js) | `fetchurl-sdk` (npm); Web Crypto; inject `fetch` |
| Python | [fetchurl/sdk-python](https://github.com/fetchurl/sdk-python) | `fetchurl-sdk` (PyPI / uv); stdlib-friendly `Fetcher` protocols |
| Rust | [fetchurl/sdk-rust](https://github.com/fetchurl/sdk-rust) | `fetchurl-sdk` crate; `FetchSession` state machine, your HTTP I/O |
| Java | [fetchurl/sdk-java](https://github.com/fetchurl/sdk-java) | `io.github.fetchurl:fetchurl-sdk` |

## JavaScript example

```js
import { fetchurl, parseFetchurlServer } from 'fetchurl-sdk';

const servers = parseFetchurlServer(process.env.FETCHURL_SERVER ?? '');
const data = await fetchurl({
  fetch,
  servers,
  algo: 'sha256',
  hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  sourceUrls: ['https://cdn.example.com/file.tar.gz'],
});
// data is Uint8Array, hash-verified
```

## Python

```python
from fetchurl import fetch, UrllibFetcher, parse_fetchurl_server
import os

servers = parse_fetchurl_server(os.environ.get("FETCHURL_SERVER", ""))
# Drive FetchSession with your HTTP client — see package docs.
```

## Rust

Use `FetchSession` and the verifier APIs with any HTTP library. See `examples/get.rs` in the crate repository.

## Environment

Every SDK honors **`FETCHURL_SERVER`** as defined in the protocol (single URL or RFC 8941 list). Empty/absent disables server use.

## Integration tests

SDK repos typically run integration tests against a Docker image of the reference server (`FETCHURL_TEST_IMAGE`, often `fetchurl:local` or `ghcr.io/fetchurl/fetchurl`).
