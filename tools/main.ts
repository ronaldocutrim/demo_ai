import "dotenv/config";

async function main() {
  const prompt = "in file helper.ts implement a cpf formatter";

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENROUTER_APY_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL,
      // Context window
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if(!response.ok) {
    throw new Error(`Request failed with status ${response.status} - ${response.statusText}`);
  }

  const output = await response.json();
  console.log(JSON.stringify(output, null, 2));
}

main()