import { useChat } from "@ai-sdk/react";
import { ArrowUpIcon } from "lucide-react";
import { useState, type FormEvent } from "react";

export function ChatFromScratch() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat();

  const isLoading = status === "submitted" || status === "streaming";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();
    if (!text) return;
    sendMessage({ text });
    setInput("");
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
        {messages.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-muted-foreground text-sm">
              Envie uma mensagem para começar.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={
                message.role === "user" ? "flex justify-end" : "flex justify-start"
              }
            >
              <div
                className={
                  message.role === "user"
                    ? "max-w-[80%] rounded-2xl bg-primary px-4 py-2.5 text-sm text-primary-foreground"
                    : "max-w-[80%] rounded-2xl bg-muted px-4 py-2.5 text-sm whitespace-pre-wrap"
                }
              >
                {message.parts.map((part, i) => {
                  if (part.type === "text") {
                    return <span key={`${message.id}-${i}`}>{part.text}</span>;
                  }
                  return null;
                })}
              </div>
            </div>
          ))
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 bg-background p-6 pt-2"
      >
        <div className="flex w-full items-end rounded-3xl border border-border bg-muted pl-4">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Pergunte alguma coisa..."
            className="min-h-10 flex-1 resize-none bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={isLoading || input.trim().length === 0}
            className="m-2 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:opacity-30"
          >
            <ArrowUpIcon className="size-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
