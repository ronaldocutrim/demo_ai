import "dotenv/config";
import fs from "fs";

async function main() {
  const prompt = "Extraia as informações dessa imagem e me liste em json as informacoes";
  const apiUrl = "https://openrouter.ai/api/v1/chat/completions";
  const model = process.env.OPENROUTER_MODEL_MEDIA;
  const apiKey = process.env.OPENROUTER_API_KEY;
  const imagem = fs.readFileSync("./image.png");
  const base64Image = imagem.toString("base64");
  console.log({
    base64Image
  })
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
              type: "image_url",
              image_url: {
                url: `data:image/png;base64,${base64Image}`,
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
