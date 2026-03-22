# Demo IA

Demo de integração com IA usando **OpenRouter**, **MCP (Model Context Protocol)** e **Vercel AI SDK**.

## O que tem aqui

| Pasta | O que faz |
|-------|-----------|
| `mcp/` | Servidor MCP (`cadastrar_despesa`) + API Express que extrai dados de notas fiscais via visão computacional |
| `tools/` | Exemplos de uso de tools/function calling com o AI SDK |
| `sdk/` | Exemplo básico de chamada à API do OpenRouter |
| `rag/` | Exemplo de RAG com arquivo CSV de despesas |
| `client/` | Front-end estático servido pelo json-server |

## Pré-requisitos

- [Bun](https://bun.sh)
- Chave de API do [OpenRouter](https://openrouter.ai)

## Configuração

Crie um arquivo `.env` na raiz:

```env
OPENROUTER_API_KEY=sk-or-...
OPENROUTER_MODEL=openai/gpt-4o-mini
OPENROUTER_MODEL_MEDIA=openai/gpt-4o
```

## Como rodar

```bash
bun install

# Sobe o json-server (banco local) + a API de extração de notas
bun start
```

| Serviço | URL |
|---------|-----|
| Front-end / json-server | `http://localhost:3000` |
| API de extração de NF | `http://localhost:3001` |

## Scripts

```bash
bun run dev    # json-server com arquivos estáticos
bun run api    # API Express (extração de notas fiscais)
bun start      # ambos em paralelo
```

## MCP

O servidor MCP (`mcp/main.mcp.js`) expõe a tool `cadastrar_despesa` via stdio. Configure no seu cliente MCP:

```json
{
  "mcpServers": {
    "despesas": {
      "command": "bun",
      "args": ["mcp/main.mcp.js"]
    }
  }
}
```
