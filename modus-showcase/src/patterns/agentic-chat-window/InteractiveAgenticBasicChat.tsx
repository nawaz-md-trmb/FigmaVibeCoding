// @ts-nocheck
import { useCallback, useEffect, useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import oneDark from "react-syntax-highlighter/dist/esm/styles/prism/one-dark";
import {
  ModusWcButton,
  ModusWcCollapse,
  ModusWcIcon,
  ModusWcLoader,
  ModusWcLogo,
  ModusWcTypography,
} from "@trimble-oss/moduswebcomponents-react";
import { AiUxPromptComposerSurface } from "./AiUxPromptComposerSurface";

const _ICON_MAP = {
  Menu:'menu',X:'cancel_circle',Home:'home',Search:'search',Copy:'copy_content',Check:'check_simple',
  CheckCircle:'check_circle',ChevronDown:'caret_down_bold',ChevronRight:'chevron_right_bold',
  Settings:'settings',Users:'users',User:'person',Bell:'notifications',
  AlertTriangle:'warning_filled',AlertCircle:'alert_outlined',Info:'info_outlined',
  Sparkles:'ai_stars',Loader:'sync',Loader2:'sync',Send:'launch',MessageSquare:'message',
  RefreshCw:'sync',Plus:'add',Edit:'pencil',Star:'star',ThumbsUp:'thumbs_up',ThumbsDown:'thumbs_down',Share:'share',
};
type IconAlias = keyof typeof _ICON_MAP;
function getModusIconName(name: IconAlias | string): string {
  return (_ICON_MAP as Record<string, string>)[name] ?? String(name);
}

/** Demo delay so the thinking row is visible before the assistant message mounts. */
const ASSISTANT_REPLY_DELAY_MS = 900;

const SAMPLE_CODE = `<modus-wc-card bordered="false" padding="compact">
  <p>This is some content within the card body.</p>
  <div slot="footer">
    <modus-wc-button aria-label="Primary Action">Primary Action</modus-wc-button>
    <modus-wc-button variant="outlined" color="tertiary" aria-label="Secondary Action">
      Secondary
    </modus-wc-button>
  </div>
</modus-wc-card>`;

/** Plaintext copied by the message toolbar “Copy” control (matches visible reply). */
const ASSISTANT_REPLY_CLIPBOARD_TEXT = [
  "You can place a modus-wc-button inside a modus-wc-card by utilizing the slot=\"footer\" actions row (or equivalent actions region in your stack's card API). Example:",
  "",
  SAMPLE_CODE.trim(),
  "",
  "In this example:",
  "- modus-wc-card wraps the card body.",
  "- Buttons sit in slot=\"footer\" (or the documented actions slot for your version).",
  "- modus-wc-button pairs filled primary with outlined tertiary secondary actions.",
].join("\n");

let messageIdSeq = 0;
function nextMessageId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  messageIdSeq += 1;
  return `msg-${messageIdSeq}`;
}

function InlineCode({ children }: { children: string }) {
  return <code className="agentic-basic-chat-inline-code">{children}</code>;
}

/** Modus emblem (`modus-wc-logo` + `emblem`) in the same fixed square sizes as the former gradient tiles (`--sm` / `--md` / `--lg`). */
function AgentEmblemTile({ size }: { size: "sm" | "md" | "lg" }) {
  const tier =
    size === "lg"
      ? "agentic-basic-chat-agent-tile--lg"
      : size === "md"
        ? "agentic-basic-chat-agent-tile--md"
        : "agentic-basic-chat-agent-tile--sm";
  return (
    <span className={`agentic-basic-chat-agent-tile ${tier} shrink-0 self-center`}>
      <ModusWcLogo name="modus" emblem alt="" />
    </span>
  );
}

function AgenticChatPromptComposer({
  draft,
  onDraft,
  onSubmit,
  sendBlocked,
}: {
  draft: string;
  onDraft: (v: string) => void;
  onSubmit: () => void;
  sendBlocked?: boolean;
}) {
  return (
    <AiUxPromptComposerSurface
      starterChips={false}
      minimalControlStrip
      value={draft}
      onChange={onDraft}
      placeholder="How can I help you?"
      onSend={() => {
        if (!draft.trim() || sendBlocked) return;
        onSubmit();
      }}
      sendDisabled={!draft.trim() || Boolean(sendBlocked)}
      footer={
        <ModusWcTypography className="text-[var(--modus-wc-color-base-content)]" hierarchy="p" size="xs" customClass="!m-0 text-center">
          <span className="text-[var(--modus-wc-color-primary)]">Trimble AI</span>
          {" can make mistakes. Check results."}
        </ModusWcTypography>
      }
    />
  );
}

function AgentThinkingState({ stepLabel }: { stepLabel: string }) {
  return (
    <article
      className="agentic-basic-chat-thinking pt-1"
      aria-busy="true"
      aria-live="polite"
      aria-label="Assistant is thinking"
    >
      <div className="flex gap-2">
        <div
          className="agentic-basic-chat-thinking__loader-slot flex shrink-0 items-center justify-center"
          aria-hidden="true"
        >
          <ModusWcLoader variant="spinner" size="md" color="primary" />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <ModusWcTypography hierarchy="h2" size="md" weight="semibold" customClass="!m-0" label="Modus Agent" />
          <div className="flex min-w-0 items-center gap-1 font-mono text-xs leading-snug text-[var(--modus-wc-color-base-content-low-contrast)]">
            <span className="min-w-0 truncate">{stepLabel}</span>
            <ModusWcIcon name={getModusIconName("ChevronRight")} size="xs" decorative />
          </div>
        </div>
      </div>
    </article>
  );
}

function UserBubble({ text }: { text: string }) {
  return (
    <article
      className="ml-auto flex min-w-0 max-w-full flex-col items-end px-0.5 pb-1 text-right"
      aria-label="Your message"
    >
      <div className="flex min-w-0 justify-end">
        <div className="chat-bubble-pattern-bubble chat-bubble-pattern-bubble--sender flex min-w-0 max-w-[min(18.5rem,100%)] flex-col px-4 py-3 text-left shadow-none">
          <ModusWcTypography className="text-[var(--modus-wc-color-base-content)]" hierarchy="p" size="sm" customClass="!m-0 leading-normal" label={text} />
        </div>
      </div>
    </article>
  );
}

function AssistantRichButtonCardReply({
  onCopyCode,
  copied,
  onCopyReply,
  onShareReply,
}: {
  onCopyCode: () => void;
  copied: boolean;
  onCopyReply: () => void;
  onShareReply: () => void;
}) {
  const [thinkingOpen, setThinkingOpen] = useState(false);

  return (
    <article className="space-y-3 pt-1">
      <div className="flex items-center gap-2">
        <AgentEmblemTile size="md" />
        <ModusWcTypography hierarchy="h2" size="md" weight="semibold" customClass="!m-0" label="Modus Agent" />
      </div>

      <ModusWcCollapse
        expanded={thinkingOpen}
        onExpandedChange={(e: CustomEvent<{ expanded: boolean }>) =>
          setThinkingOpen(e.detail.expanded)
        }
      >
        <div slot="header" className="w-full min-w-0">
          <ModusWcTypography className="text-[var(--modus-wc-color-base-content-low-contrast)]" hierarchy="p" size="sm" customClass="block w-full py-1 !m-0 text-left font-normal" label="Show Thinking" />
        </div>
        <div slot="content" className="border-l border-[var(--modus-wc-color-base-200)] pl-3 pt-2">
          {["get_modus_component_data", "get_modus_component_data"].map((name, i) => (
            <ModusWcButton
              key={i}
              variant="borderless"
              color="tertiary"
              size="sm"
              customClass="agentic-basic-chat-telemetry-btn mb-1 w-full !rounded-lg last:mb-0"
            >
              <span className="agentic-basic-chat-telemetry-row flex w-full min-w-0 items-center justify-between gap-2 self-stretch">
                <span className="flex min-w-0 flex-1 items-center gap-2">
                  <ModusWcIcon
                    name={getModusIconName("CheckCircle")}
                    size="xs"
                    decorative
                    customClass="shrink-0 text-[var(--modus-wc-color-success,#0c7f4b)]"
                  />
                  <span className="truncate font-mono text-xs leading-none text-[var(--modus-wc-color-base-content-low-contrast)]">
                    {name}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-1 text-xs leading-none text-[var(--modus-wc-color-base-content-low-contrast)]">
                  Result
                  <ModusWcIcon name={getModusIconName("ChevronRight")} size="xs" decorative />
                </span>
              </span>
            </ModusWcButton>
          ))}
        </div>
      </ModusWcCollapse>

      <p className="m-0 text-sm leading-relaxed text-[var(--modus-wc-color-base-content)]">
        You can place a <InlineCode>modus-wc-button</InlineCode> inside a <InlineCode>modus-wc-card</InlineCode> by
        utilizing the <InlineCode>slot=&quot;footer&quot;</InlineCode>
        actions row (or equivalent actions region in your stack’s card API). Example:
      </p>

      <div className="agentic-basic-chat-code-block-host pt-1">
        <div className="agentic-basic-chat-code-block overflow-hidden rounded-[10px] bg-[#1a1a1a] ring-1 ring-black/40">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-3">
            <ModusWcTypography hierarchy="p" size="sm" customClass="agentic-basic-chat-code-lang !m-0 font-medium !text-white" label="HTML" />
            <ModusWcButton
              variant="borderless"
              color="tertiary"
              size="sm"
              customClass="!text-white/90 hover:!bg-white/10"
              onButtonClick={onCopyCode}
            >
              <ModusWcIcon name={getModusIconName("Copy")} size="xs" decorative />
              {copied ? "Copied" : "Copy"}
            </ModusWcButton>
          </div>
          <div className="agentic-basic-chat-code-block-scroll max-h-[min(12rem,42vh)] overflow-auto">
            <SyntaxHighlighter
              language="markup"
              style={oneDark}
              PreTag="div"
              showLineNumbers={false}
              customStyle={{
                margin: 0,
                padding: "1rem 1.25rem",
                background: "#1a1a1a",
                borderRadius: 0,
                fontSize: "0.8125rem",
                lineHeight: 1.65,
              }}
              codeTagProps={{
                style: {
                  fontFamily:
                    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                  whiteSpace: "pre",
                },
              }}
            >
              {SAMPLE_CODE}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>

      <ModusWcTypography hierarchy="p" size="sm" weight="semibold" customClass="!mb-2 !mt-4 !block" label="In this example:" />
      <ul className="agentic-basic-chat-prose-list">
        <li>
          <p className="m-0 text-sm text-[var(--modus-wc-color-base-content)]">
            <InlineCode>modus-wc-card</InlineCode> wraps the card body.
          </p>
        </li>
        <li>
          <p className="m-0 text-sm text-[var(--modus-wc-color-base-content)]">
            Buttons sit in <InlineCode>slot=&quot;footer&quot;</InlineCode> (or the documented actions slot for your
            version).
          </p>
        </li>
        <li>
          <p className="m-0 text-sm text-[var(--modus-wc-color-base-content)]">
            <InlineCode>modus-wc-button</InlineCode> pairs filled primary with outlined tertiary secondary actions.
          </p>
        </li>
      </ul>

      <div
        className="flex flex-wrap gap-1 pt-2"
        role="toolbar"
        aria-label="Message actions"
      >
        <ModusWcButton
          variant="borderless"
          color="tertiary"
          shape="square"
          size="sm"
          aria-label="Thumbs up"
        >
          <ModusWcIcon name={getModusIconName("ThumbsUp")} size="xs" decorative />
        </ModusWcButton>
        <ModusWcButton
          variant="borderless"
          color="tertiary"
          shape="square"
          size="sm"
          aria-label="Thumbs down"
        >
          <ModusWcIcon name={getModusIconName("ThumbsDown")} size="xs" decorative />
        </ModusWcButton>
        <ModusWcButton variant="borderless" color="tertiary" shape="square" size="sm" aria-label="Regenerate">
          <ModusWcIcon name={getModusIconName("RefreshCw")} size="xs" decorative />
        </ModusWcButton>
        <ModusWcButton
          variant="borderless"
          color="tertiary"
          shape="square"
          size="sm"
          aria-label="Share"
          onButtonClick={onShareReply}
        >
          <ModusWcIcon name={getModusIconName("Share")} size="xs" decorative />
        </ModusWcButton>
        <ModusWcButton
          variant="borderless"
          color="tertiary"
          shape="square"
          size="sm"
          aria-label="Copy"
          onButtonClick={onCopyReply}
        >
          <ModusWcIcon name={getModusIconName("Copy")} size="xs" decorative />
        </ModusWcButton>
      </div>
    </article>
  );
}

type ChatMessage =
  | { id: string; role: "user"; text: string }
  | { id: string; role: "assistant" };

export function InteractiveAgenticBasicChat({
  embedded = false,
  embeddedDensity = "default",
}: {
  /** When true, omit standalone card chrome and fill a parent column (e.g. Agentic Chat Window). */
  embedded?: boolean;
  /** Tighter horizontal and vertical inset when `embedded` (e.g. utility-panel body). */
  embeddedDensity?: "default" | "compact";
} = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [copied, setCopied] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const assistantDelayRef = useRef<number | null>(null);

  const onCopyReply = useCallback(() => {
    void navigator.clipboard.writeText(ASSISTANT_REPLY_CLIPBOARD_TEXT).catch(() => {});
  }, []);

  const onShareReply = useCallback(() => {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      void navigator
        .share({ title: "Modus Agent reply", text: ASSISTANT_REPLY_CLIPBOARD_TEXT })
        .catch(() => {});
    }
  }, []);

  const onCopyCode = useCallback(() => {
    void navigator.clipboard.writeText(SAMPLE_CODE).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  useEffect(
    () => () => {
      if (assistantDelayRef.current !== null) {
        window.clearTimeout(assistantDelayRef.current);
        assistantDelayRef.current = null;
      }
    },
    [],
  );

  const appendAssistantReply = useCallback(() => {
    if (assistantDelayRef.current !== null) return;
    setIsThinking(true);
    assistantDelayRef.current = window.setTimeout(() => {
      assistantDelayRef.current = null;
      setIsThinking(false);
      setMessages((prev) => [...prev, { id: nextMessageId(), role: "assistant" }]);
    }, ASSISTANT_REPLY_DELAY_MS);
  }, []);

  const sendFromComposer = useCallback(() => {
    const text = draft.trim();
    if (!text || isThinking) return;
    setDraft("");
    setMessages((prev) => [...prev, { id: nextMessageId(), role: "user", text }]);
    appendAssistantReply();
  }, [draft, appendAssistantReply, isThinking]);

  const sendSuggested = useCallback(
    (text: string) => {
      if (isThinking) return;
      setMessages((prev) => [...prev, { id: nextMessageId(), role: "user", text }]);
      appendAssistantReply();
    },
    [appendAssistantReply, isThinking],
  );

  useEffect(() => {
    const el = logRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, isThinking]);

  const compactEmbedded = embedded && embeddedDensity === "compact";
  const logScrollClassName = compactEmbedded
    ? "min-h-0 min-w-0 flex-1 space-y-4 overflow-y-auto px-3 pb-3 pt-3"
    : "min-h-0 min-w-0 flex-1 space-y-5 overflow-y-auto px-4 pb-5 pt-6";
  const composerBarClassName = compactEmbedded
    ? "mt-auto shrink-0 border-t border-[var(--modus-wc-color-base-200)] bg-[var(--modus-wc-color-base-page)] px-3 pb-2 pt-2"
    : embedded
      ? "mt-auto shrink-0 border-t border-[var(--modus-wc-color-base-200)] bg-[var(--modus-wc-color-base-page)] px-4 pb-4 pt-3"
      : "border-t border-[var(--modus-wc-color-base-200)] bg-[var(--modus-wc-color-base-page)] px-4 pb-4 pt-3";

  const transcript = (
    <>
      <div
        ref={logRef}
        className={logScrollClassName}
        role="log"
        aria-label="Conversation"
        aria-live="polite"
      >
          {messages.length === 0 ? (
            <>
              <header className="flex gap-3">
                <AgentEmblemTile size="lg" />
                <div className="min-w-0">
                  <ModusWcTypography hierarchy="h1" size="lg" weight="semibold" customClass="!m-0 leading-tight" label="Modus Agent" />
                  <ModusWcTypography className="text-[var(--modus-wc-color-base-content-low-contrast)]" hierarchy="p" size="sm" customClass="!mt-1 !mb-0" label="AI assistant for Modus Web Components" />
                </div>
              </header>

              <div
                className="flex w-full min-w-0 max-w-full flex-col gap-3"
                role="group"
                aria-label="Suggested prompts"
              >
                <ModusWcButton
                  variant="filled"
                  color="tertiary"
                  size="sm"
                  fullWidth={false}
                  customClass="agentic-basic-chat-suggest !inline-flex !h-auto min-h-[3.25rem] w-full min-w-0 max-w-full !items-center !justify-start !gap-0 !rounded-2xl !px-4 !py-3 !text-left !font-normal !overflow-hidden"
                  onButtonClick={() =>
                    sendSuggested("How do I use button inside a card?")
                  }
                >
                  <span className="agentic-basic-chat-suggest-label">
                    <ModusWcTypography hierarchy="p" size="sm" customClass="!m-0">
                      <span className="agentic-basic-chat-suggest-text block min-w-0 truncate text-left text-sm font-normal normal-case">
                        How do I use button inside a card?
                      </span>
                    </ModusWcTypography>
                  </span>
                </ModusWcButton>
                <ModusWcButton
                  variant="filled"
                  color="tertiary"
                  size="sm"
                  fullWidth={false}
                  customClass="agentic-basic-chat-suggest !inline-flex !h-auto min-h-[3.25rem] w-full min-w-0 max-w-full !items-center !justify-start !gap-0 !rounded-2xl !px-4 !py-3 !text-left !font-normal !overflow-hidden"
                  onButtonClick={() =>
                    sendSuggested("Show me how to use the accordion component in React")
                  }
                >
                  <span className="agentic-basic-chat-suggest-label">
                    <ModusWcTypography hierarchy="p" size="sm" customClass="!m-0">
                      <span className="agentic-basic-chat-suggest-text block min-w-0 truncate text-left text-sm font-normal normal-case">
                        Show me how to use the accordion component in React
                      </span>
                    </ModusWcTypography>
                  </span>
                </ModusWcButton>
              </div>

              <section className="min-w-0" aria-labelledby="abc-prev-label">
                <ModusWcTypography id="abc-prev-label" hierarchy="h2" size="md" weight="semibold" customClass="!mb-3 !mt-0" label="Previous Conversations" />
                <div className="flex flex-col gap-2">
                  <ModusWcButton
                    variant="borderless"
                    color="tertiary"
                    size="sm"
                    customClass="agentic-basic-chat-prev-convo-item !flex !h-auto min-h-[2.75rem] w-full !items-center !justify-start gap-3 !rounded-xl !px-3 !py-2.5 !text-left !font-normal !normal-case !text-[var(--modus-wc-color-base-content)]"
                    onButtonClick={() =>
                      sendSuggested("Using a Button Inside a Card")
                    }
                  >
                    <AgentEmblemTile size="sm" />
                    <ModusWcTypography className="text-[var(--modus-wc-color-base-content)]" hierarchy="p" size="sm" customClass="min-w-0 flex-1 truncate !m-0 text-left leading-snug !normal-case !font-normal" label="Using a Button Inside a Card" />
                  </ModusWcButton>
                  <ModusWcButton
                    variant="borderless"
                    color="tertiary"
                    size="sm"
                    customClass="agentic-basic-chat-prev-convo-item !flex !h-auto min-h-[2.75rem] w-full !items-center !justify-start gap-3 !rounded-xl !px-3 !py-2.5 !text-left !font-normal !normal-case !text-[var(--modus-wc-color-base-content)]"
                    onButtonClick={() =>
                      sendSuggested("How to Use Accordion Component in React")
                    }
                  >
                    <AgentEmblemTile size="sm" />
                    <ModusWcTypography className="text-[var(--modus-wc-color-base-content)]" hierarchy="p" size="sm" customClass="min-w-0 flex-1 truncate !m-0 text-left leading-snug !normal-case !font-normal" label="How to Use Accordion Component in React" />
                  </ModusWcButton>
                </div>
              </section>
            </>
          ) : null}

          {messages.map((m) =>
            m.role === "user" ? (
              <UserBubble key={m.id} text={m.text} />
            ) : (
              <AssistantRichButtonCardReply
                key={m.id}
                onCopyCode={onCopyCode}
                copied={copied}
                onCopyReply={onCopyReply}
                onShareReply={onShareReply}
              />
            ),
          )}
          {isThinking ? <AgentThinkingState stepLabel="get_modus_component_data" /> : null}
      </div>

      <div className={composerBarClassName}>
        <AgenticChatPromptComposer
          draft={draft}
          onDraft={setDraft}
          onSubmit={sendFromComposer}
          sendBlocked={isThinking}
        />
      </div>
    </>
  );

  if (embedded) {
    return (
      <div className="agentic-basic-chat-shell flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden text-[var(--modus-wc-color-base-content)]">
        {transcript}
      </div>
    );
  }

  return (
    <div className="agentic-basic-chat-shell text-[var(--modus-wc-color-base-content)]">
      <div className="mx-auto flex h-[min(640px,78vh)] min-h-[420px] w-full max-w-[22rem] flex-col overflow-hidden rounded-2xl border border-[var(--modus-wc-color-base-200)] bg-[var(--modus-wc-color-base-page)] shadow-[var(--app-elevation-floating)] sm:max-w-md">
        {transcript}
      </div>
    </div>
  );
}
