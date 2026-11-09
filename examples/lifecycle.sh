#!/bin/sh
# No private key or domain scan. The hosted server supports 2025-11-25.
set -eu
endpoint="${MCP_TEST_URL:-https://tools.idigitrust.com/api/v1/mcp}"
post() {
  curl --fail-with-body --silent --show-error --max-time 120 "$endpoint" \
    -H 'Content-Type: application/json' \
    -H 'Accept: application/json, text/event-stream' \
    -H 'MCP-Protocol-Version: 2025-11-25' --data "$1"
  printf '\n'
}
post '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-11-25","capabilities":{},"clientInfo":{"name":"curl-example","version":"1.0.0"}}}'
# The notification intentionally produces an empty HTTP 202 response.
post '{"jsonrpc":"2.0","method":"notifications/initialized"}'
post '{"jsonrpc":"2.0","id":2,"method":"tools/list"}'
post '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"dcv.list_cas","arguments":{}}}'
