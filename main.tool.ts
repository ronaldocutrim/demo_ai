import "dotenv/config";
import { formatCpf } from "./helper";

async function main() {
  const { readdir } = await import("node:fs/promises");
  const prompt = "List files in the current directory using your tool.";
  const apiUrl = "https://openrouter.ai/api/v1/chat/completions";
  const model = process.env.OPENROUTER_MODEL;
  const apiKey = process.env.OPENROUTER_APY_KEY;
  
  const tools = [
    {
      type: "function",
      function: {
        name: "list_dir",
        description: "List file and folder names for a given directory path",
        parameters: {
          type: "object",
          properties: {
            path: {
              type: "string",
              description: "Absolute or relative directory path",
            },
          },
          required: ["path"],
        },
      },
    },
  ];

  const firstCall = await fetch(
   apiUrl,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: prompt }],
        tools,
      }),
    },
  );

  if (!firstCall.ok) {
    throw new Error(
      `Request failed with status ${firstCall.status} - ${firstCall.statusText}`,
    );
  }

  const firstOutput = await firstCall.json();
  console.log(JSON.stringify(firstOutput, null, 2));
  console.log({
    firstFormatCpf: formatCpf("61241093369"),
  });
  const firstMessage = firstOutput.choices?.[0]?.message;
  const toolCall = firstMessage?.tool_calls?.[0];

   if (toolCall?.function?.name === "list_dir") {
        const args = JSON.parse(toolCall.function.arguments ?? "{}");
        const entries = await readdir(args.path, { withFileTypes: true });
        const toolResult = entries.map(entry => ({
            name: entry.name,
            type: entry.isDirectory() ? "dir" : "file"
        }));

        const secondResponse = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model,
                messages: [
                    { role: "user", content: prompt },
                    firstMessage,
                    {
                        role: "tool",
                        tool_call_id: toolCall.id,
                        name: "list_dir",
                        content: JSON.stringify(toolResult)
                    }
                ],
                tools
            })
        });

        if (!secondResponse.ok) {
            throw new Error(`OpenRouter error: ${secondResponse.status} ${secondResponse.statusText}`);
        }

        const secondOutput = await secondResponse.json();
        console.log(JSON.stringify(secondOutput, undefined, "  "));
        console.log(secondOutput.choices?.[0]?.message?.content);
        return;
    }
    console.log("Model did not request tool usage.");
}

main();
