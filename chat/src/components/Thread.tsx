import {
  AuiIf,
  ComposerPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
} from "@assistant-ui/react";
import { ArrowUpIcon } from "lucide-react";

export function Thread() {
  return (
    <ThreadPrimitive.Root className="flex h-full flex-col">
      <ThreadPrimitive.Viewport className="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
        <AuiIf condition={(s) => s.thread.isEmpty}>
          <div className="flex flex-1 items-center justify-center">
            <p className="text-muted-foreground text-sm">
              Envie uma mensagem para começar.
            </p>
          </div>
        </AuiIf>

        <ThreadPrimitive.Messages>
          {({ message }) =>
            message.role === "user" ? <UserMessage /> : <AssistantMessage />
          }
        </ThreadPrimitive.Messages>

        <ThreadPrimitive.ViewportFooter className="sticky bottom-0 bg-background pt-2">
          <ComposerPrimitive.Root className="flex w-full items-end rounded-3xl border border-border bg-muted pl-4">
            <ComposerPrimitive.Input
              placeholder="Pergunte alguma coisa..."
              rows={1}
              className="min-h-10 max-h-40 flex-1 resize-none bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
            />
            <ComposerPrimitive.Send className="m-2 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:opacity-30">
              <ArrowUpIcon className="size-4" />
            </ComposerPrimitive.Send>
          </ComposerPrimitive.Root>
        </ThreadPrimitive.ViewportFooter>
      </ThreadPrimitive.Viewport>
    </ThreadPrimitive.Root>
  );
}

function UserMessage() {
  return (
    <MessagePrimitive.Root className="flex justify-end">
      <div className="max-w-[80%] rounded-2xl bg-primary px-4 py-2.5 text-sm text-primary-foreground">
        <MessagePrimitive.Parts />
      </div>
    </MessagePrimitive.Root>
  );
}

function AssistantMessage() {
  return (
    <MessagePrimitive.Root className="flex justify-start">
      <div className="max-w-[80%] rounded-2xl bg-muted px-4 py-2.5 text-sm">
        <MessagePrimitive.Parts />
      </div>
    </MessagePrimitive.Root>
  );
}
