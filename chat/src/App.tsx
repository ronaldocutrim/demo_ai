import { useState } from "react";
import { AssistantChat } from "./components/AssistantChat";
import { ChatFromScratch } from "./components/ChatFromScratch";
import { ChatVanilla } from "./components/ChatVanilla";

type Tab = "vanilla" | "scratch" | "assistant";

const TABS: { id: Tab; label: string }[] = [
  { id: "vanilla", label: "Vanilla" },
  { id: "scratch", label: "AI SDK" },
  { id: "assistant", label: "Assistant UI" },
];

export function App() {
  const [tab, setTab] = useState<Tab>("vanilla");

  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col">
      <header className="border-b border-border px-6 pt-4">
        <h1 className="text-lg font-semibold">Chat</h1>
        <nav className="mt-3 flex gap-1" role="tablist">
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.id)}
                className={
                  active
                    ? "rounded-t-md border border-b-0 border-border bg-background px-4 py-2 text-sm font-medium"
                    : "rounded-t-md px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
                }
              >
                {t.label}
              </button>
            );
          })}
        </nav>
      </header>
      <main className="min-h-0 flex-1">
        {tab === "vanilla" && <ChatVanilla />}
        {tab === "scratch" && <ChatFromScratch />}
        {tab === "assistant" && <AssistantChat />}
      </main>
    </div>
  );
}
