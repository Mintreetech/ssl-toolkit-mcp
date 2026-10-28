# IDigiTrust SSL Toolkit MCP Server

**免费、无需注册的 SSL/PKI 在线工具集 —— 同时提供网页版和 MCP（Model Context Protocol）接口，让你的 AI 助手直接做 HTTPS 体检、生成 CSR、DCV 预检和证书格式转换。**

A free SSL/PKI toolkit — web UI **plus** an MCP (Model Context Protocol) endpoint, so your AI assistant can run HTTPS audits, generate CSRs, pre-check DCV, and convert certificate formats.

- 🌐 Web: <https://tools.idigitrust.com/>
- 🔌 MCP Endpoint: `https://tools.idigitrust.com/api/v1/mcp`
- 📄 AI-readable index: <https://tools.idigitrust.com/llms.txt>
- 🔑 API Key: **not required** (shared IP rate limit, HTTP 429 on excess)

---

## 为什么用它 / Why

| 特性 | 说明 |
|---|---|
| **国密支持** | HTTPS 体检支持 **TLCP / SM2 / SM3 / SM4** 真实握手检测——这是 SSL Labs 等国外工具的空白 |
| **真实 DCV 预检** | DNS（`_dnsauth` 商业 CA / `_acme-challenge` ACME 自动切换）+ HTTP 文件双模式，**字节级比对**、CAA 树状回溯、以 `DigiCert DCV Bot/1.1` UA 探测 WAF 拦截 |
| **整链吊销检查** | OCSP / CRL **含交叉证书**，基于 CCADB 合并根库做根信任判定 |
| **隐私安全** | 私钥仅在内存处理，不落盘、不写日志；API 有 SSRF 防护 |
| **AI 原生** | MCP 端点开箱即用，Claude / Cherry Studio / 任意 MCP 客户端可直接调用 |

---

## 8 个 MCP 工具 / Tools

| 工具 | 功能 |
|---|---|
| `inspect.run` | HTTPS 体检：协议/套件评级（参考 SSL Labs 规则）、国密 TLCP/SM2、整链 OCSP/CRL 吊销检查 |
| `csr.generate` | 生成 RSA / ECC 私钥 + CSR（CN 自动并入 SAN，中文域名自动 Punycode） |
| `csr.decode` | 解析 CSR：Subject、公钥算法、SAN、SPKI 指纹、自签名完整性 |
| `cert.decode` | 解析证书（PEM/base64-DER/DER）：全字段 + 整链吊销检查 + 根信任识别 |
| `cert.match` | cert↔key↔CSR 三两匹配（SPKI SHA-256 指纹比对） |
| `dcv.check` | DCV 预检（DNS TXT/CNAME 或 HTTP 文件），返回完整事件流 |
| `dcv.list_cas` | 列出支持的 CA（Let's Encrypt / DigiCert / Sectigo / GoDaddy / GlobalSign / ZeroSSL） |
| `convert.run` | PEM / P12 / JKS 任意方向互转（含 AIA 智能补链） |

---

## 快速开始 / Quick Start

### MCP 客户端接入

MCP 端点为 **同源 POST JSON-RPC 2.0 over HTTP**（协议版本 `2024-11-05`）。支持自定义传输的客户端（Cherry Studio 等）填入 URL 即可；标准 Streamable HTTP 客户端请参考下方 [客户端兼容性](#客户端兼容性)。

示例 —— 调用 `dcv.list_cas`：

```bash
curl -X POST https://tools.idigitrust.com/api/v1/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"dcv.list_cas","arguments":{}}}'
```

完整协议说明（初始化、通知、错误处理、超时建议）见 <https://tools.idigitrust.com/llms.txt>。

### 网页版

七个免费模块：HTTPS 体检 · CSR 生成 · 证书匹配 · DCV 检测 · 格式转换 · 证书查看器 · 证书自动化（RoboTLS）。

---

## 客户端兼容性 / Client Compatibility

> ⚠️ 当前端点使用**自定义 HTTP JSON-RPC 传输**（一次请求一次响应），未提供 stdio / 旧式 HTTP+SSE / 标准 Streamable HTTP。支持自定义传输的客户端可直接使用；其他客户端需要适配器。详见 llms.txt 中的说明。

---

## 隐私与安全 / Privacy & Security

- 私钥仅在内存处理，不落盘、不写入日志
- API 层有 SSRF 防护，与网页共用 IP 限流（120 req/min）
- 包含私钥的响应（CSR 生成/格式转换）**请勿发布或写入公共日志**
- HTTPS/DCV 类工具同步等待，建议客户端超时 ≥ 120 秒

---

## License

站点内容与文档 © IDigiTrust。MCP 接口免费开放。
