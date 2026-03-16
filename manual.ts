import "dotenv/config";
import { formatCpf } from "./helper";
async function main() {
  const prompt = "in file helper.ts implement a cpf formatter";

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPEN_ROUTER_APY_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPEN_ROUTER_MODEL,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if(!response.ok) {
    throw new Error(`Request failed with status ${response.status} - ${response.statusText}`);
  }

  const output = await response.json();
  console.log(JSON.stringify(output, null, 2));
  console.log({
    formattedCpf: formatCpf("61241093369")
  })
}

main()