// Uses the official SDK without a custom protocol adapter.
// MCP_SDK_ROOT points to its package directory; requests use test data only.
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { readFile } from 'node:fs/promises';
const root = process.env.MCP_SDK_ROOT;
if (!root) throw new Error('Set MCP_SDK_ROOT to the official @modelcontextprotocol/sdk directory');
const { Client } = await import(pathToFileURL(`${root}/dist/esm/client/index.js`).href);
const { StreamableHTTPClientTransport } = await import(pathToFileURL(`${root}/dist/esm/client/streamableHttp.js`).href);
const sdkVersion = JSON.parse(await readFile(`${root}/package.json`, 'utf8')).version;
const endpoint = new URL(process.env.MCP_TEST_URL || 'https://tools.idigitrust.com/api/v1/mcp');
const observations = [];
const transport = new StreamableHTTPClientTransport(endpoint, {
  fetch: async (url, init) => {
    const response = await fetch(url, { ...init, signal: init?.signal ? AbortSignal.any([init.signal, AbortSignal.timeout(30000)]) : AbortSignal.timeout(30000) });
    const body = typeof init?.body === 'string' ? JSON.parse(init.body) : null;
    observations.push({ method: init?.method || 'GET', rpc: body?.method,
      status: response.status, contentType: response.headers.get('content-type'),
      protocolHeader: new Headers(init?.headers).get('mcp-protocol-version') });
    return response;
  }
});
const client = new Client({ name: 'ssl-toolkit-interop', version: '1.0.0' });
try {
  await client.connect(transport);
  const tools = await client.listTools();
  assert.equal(tools.tools.length, 8);
  const call = await client.callTool({ name: 'dcv.list_cas', arguments: {} });
  assert.notEqual(call.isError, true);
  assert.equal(call.content[0].type, 'text');
  JSON.parse(call.content[0].text);
  await client.ping();
  assert.equal(transport.sessionId, undefined);
  assert(observations.some(x => x.rpc === 'initialize' && x.status === 200));
  assert(observations.some(x => x.rpc === 'notifications/initialized' && x.status === 202));
  assert(observations.some(x => x.rpc === 'tools/list' && x.protocolHeader === '2025-11-25'));
  const headers = { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream', 'MCP-Protocol-Version': '2025-11-25' };
  const denied = await fetch(endpoint, { method: 'POST', headers: { ...headers, Origin: 'https://attacker.example' }, body: JSON.stringify({ jsonrpc: '2.0', id: 9, method: 'tools/list' }) });
  assert.equal(denied.status, 403);
  const get = await fetch(endpoint, { headers: { Accept: 'text/event-stream' } });
  assert.equal(get.status, 405);
  console.log(JSON.stringify({ checkedAt: new Date().toISOString(), endpoint: endpoint.href, sdkVersion, server: client.getServerVersion(), tools: tools.tools.map(t => t.name), observations, originDenied: denied.status, standaloneSSE: get.status, passed: true }, null, 2));
} finally {
  await client.close();
}
