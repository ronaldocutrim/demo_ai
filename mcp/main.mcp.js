
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
    name: "Cadastrar despesa",
    version: "1.0.1"
});


server.tool(
  "cadastrar_despesa",
  "POST request for API for add a expense",
  {
    empresa: z.string().describe("Empresa em que foi comprado"),
    descricao:z.string().describe("Descrição dos produtos com preco de cada item"),
    preco: z.string().describe("Preco total dos items"),
    data: z.string().describe("Data da compra"),
    local: z.string().describe("Local da compra")
  },
  async (despesa) => {
    try {
      await fetch("http://localhost:3000/notas_fiscais", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(despesa),
      });
      const response = await fetch("http://localhost:3000/notas_fiscais", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      })
      const data = await response.json()
      return {
        content: [
          {
            type: "text",
            text: `
              Adicionado com sucesso!
              Listagem completa: ${JSON.stringify(data, null, 2)}
            `,
          },
        ],
      };
    } catch (err) {
      return {
        content: [
          {
            type: "text",
            text: "error: falha ao executar ação",
          },
        ],
      };
    }
  }
);

const transport = new StdioServerTransport();
server.connect(transport);
