# IDigiTrust SSL Toolkit MCP Server

[English](README.md) | [简体中文](README.zh-CN.md)

> [!WARNING]
> **Production key material must not be sent to this hosted service.** Do not send production private keys, keystores (PFX/P12 or JKS files), or their passwords to this hosted service, including through MCP clients. Use test credentials only. Generate and process production key material locally or in an environment you control.
> Hosted key generation is for testing. MCP clients and AI providers may retain tool inputs and outputs in conversation history or logs. Do not publish responses containing private keys.

Free hosted SSL/PKI tools for HTTPS audits, CSR generation and decoding, certificate inspection and matching, DCV checks, and certificate format conversion.

- Web: https://tools.idigitrust.com/
- MCP endpoint: `https://tools.idigitrust.com/api/v1/mcp`
- Transport: **standard Streamable HTTP**, stateless, with JSON responses. No custom transport adapter is required for clients supporting this transport.
- Authentication: no API key or registration required; shared per-IP rate limits apply.
- This repository contains documentation, registry metadata, and an interoperability check. The hosted application is closed-source; cloning this repository does not install a self-hosted server.

## Connect a client

Use a current client supporting Streamable HTTP. Merge the following entries into your existing configuration without overwriting other servers. Client-specific authentication and tool approval settings still apply.

### VS Code / GitHub Copilot

Add to `.vscode/mcp.json` in your workspace:

```json
{
  "servers": {
    "ssl-toolkit": {
      "type": "http",
      "url": "https://tools.idigitrust.com/api/v1/mcp"
    }
  }
}
```

Start the server from VS Code's MCP controls, review the trust prompt, and enable the tools you want to use. See the [official configuration reference](https://code.visualstudio.com/docs/agents/reference/mcp-configuration).

### Cursor

Add to `.cursor/mcp.json` in your project, or `~/.cursor/mcp.json` for user-wide configuration:

```json
{
  "mcpServers": {
    "ssl-toolkit": {
      "url": "https://tools.idigitrust.com/api/v1/mcp"
    }
  }
}
```

Enable the server in Cursor's MCP settings and review tool permissions. See [Cursor's MCP documentation](https://prod.cursor.com/docs/mcp).

### Claude Code

```sh
claude mcp add --transport http --scope user ssl-toolkit https://tools.idigitrust.com/api/v1/mcp
claude mcp get ssl-toolkit
```

Run `/mcp` within Claude Code to inspect the connection. These commands configure **Claude Code**, not Claude Desktop. See [Claude Code's MCP documentation](https://code.claude.com/docs/en/mcp).

### First request

Ask your client: “Use ssl-toolkit's dcv.list_cas tool to list the supported certificate authorities.” This requires no domain scan, private key, password, or keystore.

The configuration examples follow the linked client documentation. The [verification record](verification/README.md) distinguishes SDK tests from client UI tests; no blanket claim of compatibility with every MCP client is made.

## Transport and troubleshooting

Supported protocol versions: `2025-06-18` and `2025-11-25`. The client negotiates the version during initialization.

- Each message uses POST to the same MCP endpoint. Send `Content-Type: application/json` and `Accept: application/json, text/event-stream`.
- Subsequent requests carry the negotiated `MCP-Protocol-Version` header.
- Accepted notifications, including `notifications/initialized`, return HTTP 202 with an empty body.
- Request responses use `application/json`. There is no session ID. GET and DELETE return HTTP 405; a standalone SSE stream, legacy HTTP+SSE, and stdio are not provided.
- JSON responses and GET 405 are permitted by the [Streamable HTTP specification](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports). Streamable HTTP does not require every response to be an SSE stream.
- HTTP 406: check `Accept`; HTTP 415: check `Content-Type`; HTTP 400: check protocol version and request format.
- HTTP 403 can indicate a rejected browser Origin. Non-browser clients normally omit Origin. Do not disable Origin validation to bypass this error.
- HTTP 429: reduce request frequency and retry later. HTTPS/DCV calls may take time; use a tool-call timeout of at least 120 seconds where configurable.
- Tool execution failures use `result.isError`; protocol errors use a JSON-RPC error. Inspect `content[].text` for results and details.

See [the complete curl lifecycle example](examples/lifecycle.sh), [the standard SDK check](scripts/check-streamable.mjs), and the [runtime tool schemas](https://tools.idigitrust.com/mcp.txt).

## Available tools

| Tool | Purpose | Sensitive data |
|---|---|---|
| `inspect.run` | HTTPS/TLCP protocol and cipher audit, chain revocation checks | Domain and port |
| `dcv.list_cas` | List supported certificate authorities | None |
| `dcv.check` | DNS/HTTP domain-control validation pre-check | Domain and validation token |
| `cert.decode` | Parse certificates and inspect chains/revocation | Certificate and optional chain |
| `csr.decode` | Parse CSR fields and verify its signature | CSR |
| `csr.generate` | Generate RSA/ECC keys and a CSR | **Returns a private key; testing only** |
| `cert.match` | Compare certificate, key, and CSR public-key fingerprints | **Test keys/passwords only** |
| `convert.run` | Convert PEM, PFX/P12, and JKS | **Test keys/keystores/passwords only** |

Use `tools/list` as the authoritative input schema. Only inspect domains you are authorized to test. Certificates and CSRs may also contain nonpublic organization or hostname information; review inputs before sending them.

## Security and limitations

Do not send production private keys, keystores (PFX/P12 or JKS files), or their passwords to this hosted service, including through MCP clients. Use test credentials only. Generate and process production key material locally or in an environment you control.

In-memory server processing does not protect against retention by your client, AI provider, or logging infrastructure. This documentation does not promise end-to-end zero retention. Public certificate inspection and domain diagnostics do not require uploading a production private key.

HTTPS audit supports TLCP/SM2 detection, but SM2 root trust is not verified; the certificate viewer does not currently parse SM2 certificates or CSRs. Disabling revocation checks does not disable AIA fetching. The certificate automation page is informational, not an MCP certificate-management API.

## Contributing and license

See [CONTRIBUTING.md](CONTRIBUTING.md) and [LICENSE](LICENSE). The repository license does not make the hosted application source code available.
