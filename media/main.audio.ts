import "dotenv/config";
import fs from "fs";
import path from "path";

async function main() {
  const prompt = "Transcrever esse audio listando todas as despesas e somas dos items, use markdown";
  const apiUrl = "https://openrouter.ai/api/v1/chat/completions";
  const model = process.env.OPENROUTER_MODEL_MEDIA;
  const apiKey = process.env.OPENROUTER_API_KEY;
  const audio1 = fs.readFileSync(path.resolve(import.meta.dirname, "diferencial1.ogg"));
  const audio2 = fs.readFileSync(path.resolve(import.meta.dirname, "diferencial2.ogg"));
  const base64Audio1 = audio1.toString("base64");
  const base64Audio2 = audio2.toString("base64");
  const request = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
            {
              type: "input_audio",
              input_audio: {
                data: base64Audio1,
                format: "ogg",
              },
            },
            {
              type: "input_audio",
              input_audio: {
                data: base64Audio2,
                format: "ogg",
              }
            }
          ],
        },
      ],
    }),
  });

  if (!request.ok) {
    throw new Error(`Request failed with status ${request.status} - ${request.statusText}`);
  }

  const response = await request.json();
  console.log(JSON.stringify(response, null, 2));
}

main();
