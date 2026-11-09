# Streamable HTTP verification

The check uses the official `@modelcontextprotocol/sdk` client and its built-in `StreamableHTTPClientTransport`. Its fetch wrapper records HTTP status and headers and bounds request duration; it does not adapt the protocol.

## Reproduce

Requires Node.js 20 or later and npm. From the repository root:

```sh
npm install --prefix /tmp/ssl-toolkit-interop --ignore-scripts --no-audit --no-fund @modelcontextprotocol/sdk@1.32.2
MCP_SDK_ROOT=/tmp/ssl-toolkit-interop/node_modules/@modelcontextprotocol/sdk \
  node scripts/check-streamable.mjs
```

Optionally set `MCP_TEST_URL` to a local acceptance endpoint. The script initializes the connection, sends the initialized notification, lists eight tools, calls `dcv.list_cas`, and pings. It also checks stateless operation, rejection of an untrusted Origin, and GET 405. It does not send keys, passwords, or keystores, and does not scan a domain.

See [the recorded public endpoint result](streamable-http.json) for the exact date, SDK version, service version, and observed HTTP results. This is an interoperability smoke test, not an exhaustive conformance certification. VS Code, Cursor, and Claude Code configurations are based on their official documentation; their interactive UIs were not exercised in this environment.

`server.json` uses the hosted service version as its registry version. This is separate from the negotiated MCP protocol version and from the SDK dependency version. Before a later service release, verify the running version and update this metadata and evidence together.
