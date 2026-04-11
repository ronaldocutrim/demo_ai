import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { Hono } from "hono";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

const here = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(here, "../../.env") });

const apiKey = process.env.OPENROUTER_API_KEY;
const modelId = process.env.OPENROUTER_MODEL;

if (!apiKey) throw new Error("OPENROUTER_API_KEY not set in .env");
if (!modelId) throw new Error("OPENROUTER_MODEL not set in .env");

const openrouter = createOpenRouter({ apiKey });
const model = openrouter(modelId);

const app = new Hono();

app.post("/api/chat", async (c) => {
  const body = await c.req.json<{ messages: UIMessage[] }>();

  const result = streamText({
    model,
    system: "Você é um assistente prestativo. Responda sempre em português.",
    messages: await convertToModelMessages(body.messages),
  });

  return result.toUIMessageStreamResponse();
});

app.get("/health", (c) => c.text("ok"));

const port = Number(process.env.CHAT_API_PORT ?? 3002);
console.log(`Chat API rodando em http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch,
};
