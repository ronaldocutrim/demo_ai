import "dotenv/config";
import express from "express";

const app = express();
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { res.sendStatus(204); return; }
  next();
});
app.use(express.json({ limit: "10mb" }));

interface NotaFiscal {
  descricao: string;
  preco: number;
  data: string;
  local: string;
  empresa: string;
}

const PROMPT = `
Analise essa imagem de nota fiscal ou comprovante e extraia as informações.
Retorne APENAS um JSON válido (sem markdown, sem explicações) com este formato exato:
{
  "descricao": "descrição detalhada do item ou serviço colocando entre () significado de nomes tecnicos, se tiver mais de 1 item quebrar a linha colocando nome e valor do item",
  "preco": 0.00,
  "data": "YYYY-MM-DD",
  "local": "Cidade, UF",
  "empresa": "Nome da empresa"
}
`.trim();

app.post("/extract", async (req, res) => {
  const { base64, mimeType = "image/png" } = req.body;

  if (!base64) {
    res.status(400).json({ error: "Campo 'base64' é obrigatório" });
    return;
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL_MEDIA;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: PROMPT },
            {
              type: "image_url",
              image_url: { url: `data:${mimeType};base64,${base64}` },
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    res.status(502).json({ error: "Erro ao chamar OpenRouter", detail: err });
    return;
  }

  const json = await response.json();
  const content = json.choices?.[0]?.message?.content ?? "";

  let nota: NotaFiscal;
  try {
    nota = JSON.parse(content);
  } catch {
    res.status(422).json({ error: "Resposta do modelo não é JSON válido", raw: content });
    return;
  }

  res.json(nota);
}); 

const PORT = 3001;
app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));
