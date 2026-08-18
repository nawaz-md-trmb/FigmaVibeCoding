// @ts-nocheck
import React, { useCallback, useState, type FocusEvent } from "react";
import {
  ModusWcButton,
  ModusWcButtonGroup,
  ModusWcChip,
  ModusWcDivider,
  ModusWcDropdownMenu,
  ModusWcIcon,
  ModusWcLoader,
  ModusWcMenu,
  ModusWcMenuItem,
  ModusWcSelect,
  ModusWcTextInput,
  ModusWcTypography,
} from "@trimble-oss/moduswebcomponents-react";
function getModusIconSize(className?: string): 'sm' | 'md' | 'lg' {
  if (!className) return 'md';
  if (className.includes('h-3') || className.includes('h-4')) return 'sm';
  if (className.includes('h-7') || className.includes('h-8')) return 'lg';
  return 'md';
}
import { AiUxGradientFrame } from "./AiUxSpecCard";

const PROMPT_STARTERS = ["Summarize", "Compare options", "Next steps"] as const;
const PROMPT_OVERFLOW_CHIPS = [
  "Site photos",
  "CAD layer",
  "Safety checklist",
  "Handoff notes",
] as const;

/** Demo attachment sources (ChatGPT / Gemini–style picker). */
const PROMPT_ATTACHMENT_SOURCES = [
  { value: "device", label: "Upload from this device", icon: "laptop" as const },
  { value: "photos", label: "Photos & media", icon: "image" as const },
  { value: "project", label: "Project files", icon: "folder_project" as const },
  { value: "cloud", label: "Cloud storage", icon: "cloud_upload" as const },
] as const;

/** Starter chips row for the full Prompt pattern only. */
function AiUxPromptStarterRow({ onDismiss }: { onDismiss: () => void }) {
  const [activeChip, setActiveChip] = useState<string | null>(null);
  const [overflowOpen, setOverflowOpen] = useState(false);

  const collapsePromptOverflow = useCallback(() => {
    setOverflowOpen(false);
    setActiveChip((prev) =>
      prev && (PROMPT_OVERFLOW_CHIPS as readonly string[]).includes(prev)
        ? null
        : prev,
    );
  }, []);

  const toggleChip = (label: string) =>
    setActiveChip((prev) => (prev === label ? null : label));

  return (
    <div className="flex flex-wrap items-start justify-between gap-2">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        <ModusWcIcon
          name="ai_stars"
          size={getModusIconSize("h-4 w-4")}
          customClass="modus-ai-mark-gradient-icon h-4 w-4 shrink-0"
          decorative
        />
        {PROMPT_STARTERS.map((label) => (
          <ModusWcChip
            key={label}
            label={label}
            size="sm"
            variant="outline"
            active={activeChip === label}
            onChipClick={() => toggleChip(label)}
          />
        ))}
        {overflowOpen ? (
          <>
            {PROMPT_OVERFLOW_CHIPS.map((label) => (
              <ModusWcChip
                key={label}
                label={label}
                size="sm"
                variant="outline"
                active={activeChip === label}
                onChipClick={() => toggleChip(label)}
              />
            ))}
            <ModusWcButton
              variant="borderless"
              color="tertiary"
              size="sm"
              shape="square"
              aria-label="Hide extra starter chips"
              onButtonClick={collapsePromptOverflow}
            >
              <ModusWcIcon name="chevron_left" size="sm" decorative />
            </ModusWcButton>
          </>
        ) : (
          <ModusWcChip
            label="+4"
            size="sm"
            variant="outline"
            aria-label="Show four more starter options"
            onChipClick={() => setOverflowOpen(true)}
          />
        )}
      </div>
      <ModusWcButton
        variant="borderless"
        color="tertiary"
        size="sm"
        shape="square"
        aria-label="Hide starter suggestions"
        onButtonClick={onDismiss}
      >
        <ModusWcIcon name="close" size="sm" decorative />
      </ModusWcButton>
    </div>
  );
}

/** Bottom toolbar shared by Prompt and Parameters (templates, options, source, attach, send). */
export function AiUxPromptControlStrip({
  onPromptChange = () => {},
  leadingControls = true,
  optionsSelectSlot,
  onSend,
  sendDisabled = false,
}: {
  onPromptChange?: (value: string) => void;
  leadingControls?: boolean;
  /** When set, replaces the default “Options” select (e.g. model picker). */
  optionsSelectSlot?: React.ReactNode;
  onSend?: () => void;
  sendDisabled?: boolean;
}) {
  const [promptOptions, setPromptOptions] = useState("options");
  const [voiceInputActive, setVoiceInputActive] = useState(false);
  const [attachmentMenuOpen, setAttachmentMenuOpen] = useState(false);

  const setPromptOptionsFromSelect = useCallback((val: string) => {
    setPromptOptions(val);
    setVoiceInputActive(val === "voice_input");
  }, []);

  const toggleVoiceInput = useCallback(() => {
    setVoiceInputActive((prev) => {
      const next = !prev;
      if (next) {
        setPromptOptions("voice_input");
      } else {
        setPromptOptions((current) =>
          current === "voice_input" ? "options" : current,
        );
      }
      return next;
    });
  }, []);

  const attachmentAndSend = (
    <>
      <ModusWcDropdownMenu
        menuVisible={attachmentMenuOpen}
        onMenuVisibilityChange={(e: CustomEvent<{ isVisible: boolean }>) =>
          setAttachmentMenuOpen(e.detail.isVisible)
        }
        menuPlacement="bottom-end"
        customClass="relative"
        buttonColor="tertiary"
        buttonVariant="borderless"
        buttonSize="sm"
        buttonShape="square"
        buttonAriaLabel="Add attachment from a source"
        menuOffset={4}
      >
        <div slot="button" className="inline-flex size-8 items-center justify-center">
          <ModusWcIcon name="add" size="sm" decorative />
        </div>
        <div slot="menu" className="z-[130] w-[min(100vw-2rem,17.5rem)]">
          <div className="px-3 py-2">
            <ModusWcTypography className="text-[var(--modus-wc-color-base-content)]" hierarchy="p" size="xs" weight="semibold" customClass="m-0" label="Add to prompt" />
            <ModusWcTypography className="text-[var(--modus-wc-color-base-content-low-contrast)]" hierarchy="p" size="xs" customClass="m-0 mt-0.5" label="Choose where files come from" />
          </div>
          <div className="divider-wrapper">
            <ModusWcDivider customClass="!m-0" />
          </div>
          <ModusWcMenu size="sm" customClass="py-1">
            {PROMPT_ATTACHMENT_SOURCES.map((src) => (
              <ModusWcMenuItem
                key={src.value}
                label={src.label}
                value={src.value}
                onItemSelect={() => setAttachmentMenuOpen(false)}
              >
                <ModusWcIcon
                  slot="start-icon"
                  name={src.icon}
                  size="sm"
                  decorative
                />
              </ModusWcMenuItem>
            ))}
          </ModusWcMenu>
        </div>
      </ModusWcDropdownMenu>
      <ModusWcButton
        variant="borderless"
        color="tertiary"
        size="sm"
        shape="square"
        aria-label={
          voiceInputActive ? "Stop voice input" : "Start voice input"
        }
        aria-pressed={voiceInputActive}
        onButtonClick={toggleVoiceInput}
      >
        <span
          className="inline-flex size-8 shrink-0 items-center justify-center overflow-hidden"
          aria-live={voiceInputActive ? "polite" : undefined}
        >
          {voiceInputActive ? (
            <ModusWcLoader
              variant="bars"
              size="xs"
              color="primary"
              aria-label="Voice input active"
              customClass="shrink-0"
            />
          ) : (
            <ModusWcIcon name="mic" size="sm" decorative />
          )}
        </span>
      </ModusWcButton>
      <ModusWcButton
        variant="filled"
        color="primary"
        size="sm"
        shape="square"
        aria-label="Send prompt"
        disabled={sendDisabled}
        onButtonClick={() => onSend?.()}
      >
        <ModusWcIcon name="paper_plane" size="sm" decorative />
      </ModusWcButton>
    </>
  );

  if (!leadingControls) {
    return (
      <div className="flex flex-wrap items-center justify-end gap-1">
        {attachmentAndSend}
      </div>
    );
  }

  const optionsSelect =
    optionsSelectSlot ?? (
      <ModusWcSelect
        label=""
        options={[
          { value: "options", label: "Options" },
          { value: "attachments", label: "Attachments" },
          { value: "voice_input", label: "Voice input" },
          { value: "cad", label: "CAD context" },
          { value: "messages", label: "Messages" },
        ]}
        value={promptOptions}
        size="sm"
        onInputChange={(e: CustomEvent) => {
          const val =
            (typeof e.detail === "string" ? e.detail : null) ??
            (e.detail?.target as HTMLSelectElement | undefined)?.value ??
            "options";
          setPromptOptionsFromSelect(val);
        }}
        customClass="min-w-[9.5rem]"
      />
    );

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <ModusWcButtonGroup
          variant="outlined"
          color="tertiary"
          selectionType="default"
          aria-label="Templates and clear"
        >
          <ModusWcButton size="sm" variant="outlined" color="tertiary">
            Templates
          </ModusWcButton>
          <ModusWcButton
            size="sm"
            variant="outlined"
            color="tertiary"
            onButtonClick={() => onPromptChange("")}
          >
            Clear
          </ModusWcButton>
        </ModusWcButtonGroup>
        {optionsSelect}
      </div>
      <div className="flex flex-wrap items-center gap-1">
        <ModusWcButtonGroup
          variant="outlined"
          color="tertiary"
          selectionType="default"
          aria-label="Source scope"
        >
          <ModusWcButton size="sm" variant="outlined" color="tertiary">
            Source
          </ModusWcButton>
          <ModusWcButton
            size="sm"
            variant="outlined"
            color="tertiary"
            shape="square"
            aria-label="Filter or refine source"
          >
            <ModusWcIcon name="filter" size="sm" decorative />
          </ModusWcButton>
        </ModusWcButtonGroup>
        {attachmentAndSend}
      </div>
    </div>
  );
}

export type AiUxPromptComposerSurfaceProps = {
  /** Larger hero layout and attachment-only strip (Prompt Initial CTA). */
  hero?: boolean;
  /**
   * When false, omits the starter chip row and the “Show suggestions” recall
   * (e.g. chat thread composer that should stay minimal).
   */
  starterChips?: boolean;
  /**
   * When true, toolbar is only attach (+) and send (hides Templates, Clear, Options slot, Source).
   * Ignored when `hero` is true (hero already uses this strip).
   */
  minimalControlStrip?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Replaces the default Options select (e.g. model picker). */
  optionsSelectSlot?: React.ReactNode;
  onSend?: () => void;
  sendDisabled?: boolean;
  /** Content below the gradient frame (e.g. disclaimer). */
  footer?: React.ReactNode;
  /** Passed to {@link AiUxGradientFrame}. */
  frameClassName?: string;
};

/**
 * Composite prompt shell from the AI UX Prompt pattern: gradient frame, starter chips,
 * borderless single-line text input, and control strip (by default: templates, context select, source, attach, send).
 */
export function AiUxPromptComposerSurface({
  hero = false,
  starterChips = true,
  minimalControlStrip = false,
  value,
  onChange,
  placeholder = "How can I help you?",
  optionsSelectSlot,
  onSend,
  sendDisabled = false,
  footer,
  frameClassName = "",
}: AiUxPromptComposerSurfaceProps) {
  const [starterBarVisible, setStarterBarVisible] = useState(true);
  const [promptFieldFocused, setPromptFieldFocused] = useState(false);
  const showStarterUi = starterChips && !hero;
  const fullControlStrip = !hero && !minimalControlStrip;

  const onPromptFieldFocusIn = useCallback((e: FocusEvent<HTMLDivElement>) => {
    const host = e.currentTarget.firstElementChild;
    if (
      host?.tagName?.toLowerCase() === "modus-wc-text-input" &&
      host.contains(e.target as Node)
    ) {
      setPromptFieldFocused(true);
    }
  }, []);

  const onPromptFieldFocusOut = useCallback((e: FocusEvent<HTMLDivElement>) => {
    const host = e.currentTarget.firstElementChild;
    const next = e.relatedTarget as Node | null;
    if (host && next && host.contains(next)) return;
    setPromptFieldFocused(false);
  }, []);

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <AiUxGradientFrame
        className={`ai-ux-gradient-frame--prompt-composer ${promptFieldFocused ? "ai-ux-gradient-frame--prompt-composer--field-focused" : ""} ${frameClassName}`.trim()}
        innerClassName="!bg-[var(--modus-wc-color-base-page)]"
        overflowVisible
      >
        <div className="ai-ux-prompt-surface flex flex-col gap-2 p-3">
          {showStarterUi && starterBarVisible ? (
            <AiUxPromptStarterRow onDismiss={() => setStarterBarVisible(false)} />
          ) : null}
          {showStarterUi && !starterBarVisible ? (
            <div className="flex justify-end">
              <ModusWcButton
                variant="borderless"
                color="tertiary"
                size="sm"
                onButtonClick={() => setStarterBarVisible(true)}
              >
                Show suggestions
              </ModusWcButton>
            </div>
          ) : null}
          <div
            className="min-w-0 w-full"
            onFocusCapture={onPromptFieldFocusIn}
            onBlurCapture={onPromptFieldFocusOut}
          >
            <ModusWcTextInput
              label=""
              aria-label="Prompt"
              value={value}
              placeholder={placeholder}
              size="sm"
              bordered={false}
              customClass="!outline-none focus:!outline-none focus-visible:!outline-none !shadow-none focus:!shadow-none focus-visible:!shadow-none !ring-0 focus:!ring-0 focus-visible:!ring-0 !border-transparent focus:!border-transparent focus-visible:!border-transparent w-full min-w-0"
              onInputChange={(e: CustomEvent) =>
                onChange(e.detail?.target?.value ?? "")
              }
            />
          </div>
          <AiUxPromptControlStrip
            onPromptChange={onChange}
            leadingControls={fullControlStrip}
            optionsSelectSlot={optionsSelectSlot}
            onSend={onSend}
            sendDisabled={sendDisabled}
          />
        </div>
      </AiUxGradientFrame>
      {footer}
    </div>
  );
}
