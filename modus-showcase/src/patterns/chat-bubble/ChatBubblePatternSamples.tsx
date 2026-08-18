// @ts-nocheck
import {
  ModusWcAvatar,
  ModusWcTypography,
} from "@trimble-oss/moduswebcomponents-react";

export type ChatBubbleTurnProps = {
  /** When true, shows a leading/trailing Modus avatar for this turn. Default false so list and rail embeds stay compact. */
  showAvatar?: boolean;
};

export function ChatBubbleSenderSample({
  showAvatar = false,
}: ChatBubbleTurnProps) {
  const header = (
    <header className="mb-1 flex w-full flex-wrap items-baseline justify-end gap-x-2 text-right">
      <ModusWcTypography hierarchy="span" size="sm" weight="semibold" label="You" customClass="!m-0 text-right" />
      <ModusWcTypography className="text-[var(--modus-wc-color-base-content-low-contrast)]" hierarchy="span" size="xs" label="2:30 PM" customClass="!m-0 text-right" />
    </header>
  );

  const bubble = (
    <div className="flex min-w-0 justify-end">
      <div className="chat-bubble-pattern-bubble chat-bubble-pattern-bubble--sender flex min-w-0 max-w-[min(100%,22rem)] flex-col px-4 py-3 text-left">
        <ModusWcTypography
          hierarchy="p"
          size="md"
          label="Sounds good—let’s proceed with that plan."
        />
      </div>
    </div>
  );

  const footer = (
    <footer className="mt-1 w-full">
      <ModusWcTypography className="text-[var(--modus-wc-color-base-content-low-contrast)]" hierarchy="p" size="xs" label="Read" customClass="!m-0 text-right" />
    </footer>
  );

  return (
    <article
      className="ml-auto flex min-w-0 max-w-full flex-col items-end text-right"
      aria-label="Your message"
    >
      {showAvatar ? (
        <>
          {header}
          <div className="flex w-full min-w-0 justify-end">
            <div className="flex min-w-0 max-w-full items-start gap-3">
              <div className="flex min-w-0 flex-col items-end text-right">
                {bubble}
                {footer}
              </div>
              <ModusWcAvatar
                alt="You"
                initials="U"
                shape="circle"
                size="sm"
                customClass="shrink-0"
              />
            </div>
          </div>
        </>
      ) : (
        <>
          {header}
          {bubble}
          {footer}
        </>
      )}
    </article>
  );
}

export function ChatBubbleResponderSample({
  showAvatar = false,
}: ChatBubbleTurnProps) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      {showAvatar ? (
        <ModusWcAvatar
          alt="Assistant"
          initials="AI"
          shape="circle"
          size="sm"
          customClass="mt-0.5 shrink-0"
        />
      ) : null}
      <article
        className="min-w-0 flex-1 space-y-2"
        aria-label="Assistant reply"
      >
        <div className="chat-bubble-pattern-bubble chat-bubble-pattern-bubble--responder flex min-w-0 w-full max-w-full flex-col gap-3 text-left">
          <ModusWcTypography
            hierarchy="p"
            size="md"
            label="Here's a concise answer—adjust tone or depth if you need more detail."
          />
        </div>
      </article>
    </div>
  );
}

/** Full transcript band: trailing `--sender` bubble turn + leading `--responder` assistant turn. */
export function ChatBubbleTranscriptSnippet({
  showAvatar = false,
}: ChatBubbleTurnProps) {
  return (
    <div className="chat-bubble-pattern-surface chat-bubble-pattern-surface--page w-full max-w-lg rounded-xl px-4 py-6">
      <div className="flex w-full flex-col gap-10">
        <ChatBubbleSenderSample showAvatar={showAvatar} />
        <ChatBubbleResponderSample showAvatar={showAvatar} />
      </div>
    </div>
  );
}
