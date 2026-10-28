# Contributing

Thanks for your interest in the IDigiTrust SSL Toolkit. This repository is the
documentation and metadata home for the free service at
https://tools.idigitrust.com/ — the web tools and MCP endpoint itself are
closed-source.

## Ways to contribute

1. **Bug reports / false results** — open an Issue.
   For HTTPS audit or DCV pre-check discrepancies, include:
   - the domain (and port) you scanned
   - expected vs. actual result
   - timestamp (results are cached; `force`/hard-refresh may be needed)
2. **Client compatibility** — if you connected the MCP endpoint to a client
   (Cherry Studio, Claude, Cursor, custom adapters…), share what worked and
   what didn't. Transport notes live in https://tools.idigitrust.com/llms.txt
3. **Feature requests** — especially for `dcv.check`: which real-world failure
   modes (CDN/WAF combos, DNSSEC weirdness, split-horizon DNS) should a
   pre-check catch?

## For maintainers

- `server.json` must match the schema published by the
  [official MCP registry](https://github.com/modelcontextprotocol/registry)
  before submission — verify field names against the current schema.
- `deploy/llms-en.txt` is the English AI-index file; when tools change on the
  server, update it **and** the Chinese `llms.txt` at the site root in the
  same change.
- `deploy/robots.txt` should be deployed at the site root; review the
  AI-crawler allow-list quarterly.
