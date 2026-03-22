import "dotenv/config";
import fs from "fs";
import { da } from "zod/locales";

async function main() {
  const prompt = "Transcrever esse audio";
  const apiUrl = "https://openrouter.ai/api/v1/chat/completions";
  const model = process.env.OPENROUTER_MODEL_MEDIA;
  const apiKey = process.env.OPENROUTER_API_KEY;
  const audio = fs.readFileSync("./combustivel.m4a");
  const base64Audio = audio.toString("base64");
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
                data: base64Audio,
                format: "m4a",
              },
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
