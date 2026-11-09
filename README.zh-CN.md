# IDigiTrust SSL 工具站 MCP

[English](README.md) | 简体中文

> [!WARNING]
> **请勿向托管服务提交生产环境私钥、PFX/P12/JKS 密钥库或相关密码，包括通过 MCP 客户端提交。仅使用测试材料。生产密钥应在本地或你控制的可信环境中生成和处理。**
> 托管服务生成的私钥仅用于测试。AI 服务和 MCP 客户端可能将输入输出保留在聊天记录或日志中；不要公开含私钥的响应。

免费 SSL/PKI 工具，支持 HTTPS 体检、CSR 生成与解析、证书解析与匹配、DCV 预检及格式转换。

- 网站：https://tools.idigitrust.com/
- MCP 地址：`https://tools.idigitrust.com/api/v1/mcp`
- 传输：标准 Streamable HTTP，无状态 JSON 响应；支持该传输的客户端无需自定义适配器。
- 无需注册或 API Key；按 IP 限流，超限返回 HTTP 429。
- 本仓库提供文档、注册元数据和验证脚本，不包含闭源托管服务的源码，也不提供自部署安装包。

## 接入

[英文接入指南](README.md#connect-a-client)提供 VS Code、Cursor、Claude Code 的完整配置。请合并配置，不要覆盖已有服务。首次测试可调用 `dcv.list_cas`，无需上传密钥或扫描域名。

协议支持 `2025-06-18`、`2025-11-25`。POST 使用 `Content-Type: application/json` 和 `Accept: application/json, text/event-stream`，初始化后携带协商的 `MCP-Protocol-Version`。初始化通知返回 202 空响应，不签发会话 ID，GET/DELETE 返回 405；不提供独立 SSE、旧式 HTTP+SSE 或 stdio。

[完整 curl 示例](examples/lifecycle.sh)包含初始化、通知、工具列表与调用。[验证记录](verification/README.md)说明实际测试范围。HTTPS/DCV 工具建议超时至少 120 秒。

## 工具与安全

工具包括 `inspect.run`、`dcv.list_cas`、`dcv.check`、`cert.decode`、`csr.decode`、`csr.generate`、`cert.match`、`convert.run`。参数以 `tools/list` 和[运行时说明](https://tools.idigitrust.com/mcp.txt)为准。

生成、匹配和转换涉及私钥时仅使用测试材料。内存处理不能保证客户端或 AI 服务不保留信息。证书和 CSR 也可能包含内部域名或组织信息，发送前应检查。只检测你有权测试的域名。

HTTPS 支持 TLCP/SM2 检测，但不校验 SM2 根信任；证书查看器暂不支持 SM2 证书及 CSR。关闭吊销检查不等于关闭 AIA 联网。证书自动化页面仅作产品介绍，没有 MCP 管理接口。
