// @ts-nocheck
import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import {
  ModusWcButton,
  ModusWcChip,
  ModusWcDivider,
  ModusWcDropdownMenu,
  ModusWcIcon,
  ModusWcLogo,
  ModusWcMenu,
  ModusWcMenuItem,
  ModusWcTextInput,
  ModusWcTypography,
  ModusWcUtilityPanel,
} from "@trimble-oss/moduswebcomponents-react";
import { AiUxFollowUpChipRow } from "./AiUxFollowUpChipRow";
import { AiUxSourcesPatternRow } from "./AiUxSourcesPattern";
import { AiUxSpecCard } from "./AiUxSpecCard";
import "./AiUxGradientFrame.css";
import "./AiUxFloatingPromptPreview.css";

function getModusIconSize(className?: string): 'sm' | 'md' | 'lg' {
  if (!className) return 'md';
  if (className.includes('h-3') || className.includes('w-3') || className.includes('h-4') || className.includes('w-4')) return 'sm';
  if (className.includes('h-7') || className.includes('w-7') || className.includes('h-8') || className.includes('w-8')) return 'lg';
  return 'md';
}

/** No per-field focus chrome — the host pill provides `ai-ux-floating-prompt-pill--glow` on focus. */
const AI_UX_FLOATING_PROMPT_TEXT_INPUT_CLASS =
  "!m-0 !min-w-0 !shadow-none !outline-none focus:!outline-none focus-visible:!outline-none focus:!shadow-none focus-visible:!shadow-none !ring-0 focus:!ring-0 focus-visible:!ring-0 !border-transparent focus:!border-transparent focus-visible:!border-transparent";

/** Trimble/AEC-oriented starters: three visible + overflow (same row behavior as the Follow up pattern). */
const AI_UX_FLOATING_PROMPT_PRIMARY_CHIPS = [
  "Pull from Connect",
  "Clash summary",
  "Field handoff",
] as const;

const AI_UX_FLOATING_PROMPT_OVERFLOW_CHIPS = [
  "Quantity takeoff",
  "GNSS & layout",
  "BIM compare",
  "Export to Connect",
] as const;

type FloatingPromptSource = {
  id: string;
  title: string;
  meta: string;
  icon: string;
};

const INITIAL_FLOATING_PROMPT_SOURCES: FloatingPromptSource[] = [
  {
    id: "src-demo-1",
    title: "Field_Notes_2026-04-21.pdf",
    meta: "Document · 420 KB",
    icon: "file_type_pdf",
  },
  {
    id: "src-demo-2",
    title: "ProjectAlpha",
    meta: "Link · Trimble Connect",
    icon: "link",
  },
];

/** Placeholder tool catalog — products Trimble customers often use alongside an AI bar. */
const TRIMBLE_CONTEXT_TOOLS: {
  value: string;
  label: string;
  subLabel: string;
  /** `ModusWcIcon` `name` for `start-icon` (Connect uses `ModusWcLogo` in code instead). */
  icon?: string;
}[] = [
  {
    value: "connect",
    label: "Trimble Connect",
    subLabel: "Projects, files, and updates",
  },
  {
    value: "layout",
    label: "Field & machine data",
    subLabel: "Layout files, control points, or GNSS",
    icon: "location",
  },
  {
    value: "bim",
    label: "Model coordination",
    subLabel: "Tekla, BIM, and clash context",
    icon: "buildings",
  },
  {
    value: "geo",
    label: "Geospatial & mapping",
    subLabel: "Surfaces, imagery, and boundaries",
    icon: "map",
  },
  {
    value: "quantities",
    label: "Quantities & takeoff",
    subLabel: "Length, area, and counts",
    icon: "table",
  },
  {
    value: "clash",
    label: "Clash & issues",
    subLabel: "Multi-trade review helpers",
    icon: "warning_outlined",
  },
];

/** Fixed start column for `ModusWcMenuItem` so icons/logos share width with centered glyphs. */
function FloatingPromptMenuStartIcon({ children }: { children: ReactNode }) {
  return (
    <span className="ai-ux-floating-prompt-menu-start-icon" slot="start-icon">
      {children}
    </span>
  );
}

const SOURCES_DDM_MWB_INJECT_ID = "ai-ux-floating-prompt-src-ddm-mwb-attach";

/**
 * The dropdown uses `modus-wc-button` in its shadow. `::part` and host `customClass` do
 * not style the internal `.modus-wc-btn`; `filled`+`tertiary` also re-applies theme grays
 * over inline styles. We use `buttonVariant="filled"` when sources are attached and inject
 * a shadow `<style>` so `base-100` and tight horizontal padding still win over theme defaults.
 * The empty (add) state stays `borderless` on the host.
 */
function syncAiUxFloatingPromptSourcesMenuTriggerFromShadow(
  host: HTMLElement | null,
  hasAttached: boolean,
): void {
  if (!host?.shadowRoot) return;
  const mwb = host.shadowRoot.querySelector("modus-wc-button");
  if (!mwb?.shadowRoot) return;
  mwb.shadowRoot
    .getElementById(SOURCES_DDM_MWB_INJECT_ID)
    ?.remove();
  const btn = mwb.shadowRoot.querySelector<HTMLButtonElement>("button");
  if (!btn) return;
  if (hasAttached) {
    const style = mwb.ownerDocument.createElement("style");
    style.id = SOURCES_DDM_MWB_INJECT_ID;
    style.textContent = `
      button.modus-wc-btn {
        box-sizing: border-box !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        flex-shrink: 0 !important;
        min-width: min-content !important;
        width: max-content !important;
        max-width: 100% !important;
        height: 2rem !important;
        min-height: 2rem !important;
        /* Match tight 2rem square add trigger — minimal horizontal insets on the chip row */
        padding: 0 0.125rem !important;
        border: none !important;
        box-shadow: none !important;
        border-radius: 9999px !important;
        gap: 0.125rem;
        background: var(--modus-wc-color-base-100) !important;
        background-color: var(--modus-wc-color-base-100) !important;
        color: var(--modus-wc-color-base-content) !important;
      }
      button.modus-wc-btn:hover,
      button.modus-wc-btn:focus-visible {
        background: var(--modus-wc-color-base-200) !important;
        background-color: var(--modus-wc-color-base-200) !important;
      }
    `;
    mwb.shadowRoot.appendChild(style);
    btn.removeAttribute("style");
  } else {
    btn.removeAttribute("style");
  }
}

/**
 * Add + Tools triggers share `modus-wc-dropdown-menu` with component props for the
 * host button; menu bodies use `ModusWcMenu` / `ModusWcMenuItem` defaults (no design-token overrides).
 */
function AiUxFloatingPromptSourcesAndToolsDropdowns({
  sourcesOpen,
  onSourcesOpenChange,
  toolsOpen,
  onToolsOpenChange,
  initialAttachedSources = INITIAL_FLOATING_PROMPT_SOURCES,
}: {
  sourcesOpen: boolean;
  onSourcesOpenChange: (open: boolean) => void;
  toolsOpen: boolean;
  onToolsOpenChange: (open: boolean) => void;
  /**
   * Rows shown under “In this prompt” and on the paperclip control.
   * Default prompt shows none (`[]`); output / follow-up keeps the two demo sources.
   */
  initialAttachedSources?: FloatingPromptSource[];
}) {
  const [attachedSources, setAttachedSources] = useState<FloatingPromptSource[]>(
    () => [...initialAttachedSources],
  );

  const addDemoSource = (kind: "file" | "doc" | "link" | "connect") => {
    const id = `src-${Date.now()}`;
    let row: FloatingPromptSource;
    switch (kind) {
      case "file":
        row = {
          id,
          title: "Upload_sketch_001.jpg",
          meta: "Image (demo add)",
          icon: "image",
        };
        break;
      case "doc":
        row = {
          id,
          title: "RFP_Section_04_revB.docx",
          meta: "Document (demo add)",
          icon: "file_type_doc",
        };
        break;
      case "link":
        row = {
          id,
          title: "Issue #1284",
          meta: "Link · connect.trimble.com",
          icon: "link",
        };
        break;
      default:
        row = {
          id,
          title: "Trimble Connect · Shared folder",
          meta: "Cloud folder (demo add)",
          icon: "cloud_upload",
        };
    }
    setAttachedSources((prev) => [...prev, row]);
  };

  const addSourceInPrompt = (kind: "file" | "doc" | "link" | "connect") => {
    addDemoSource(kind);
  };

  const hasAttachedSources = attachedSources.length > 0;

  const sourcesDdmRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const apply = () =>
      syncAiUxFloatingPromptSourcesMenuTriggerFromShadow(
        sourcesDdmRef.current,
        hasAttachedSources,
      );
    apply();
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(apply);
    });
    const t1 = setTimeout(apply, 0);
    const t2 = setTimeout(apply, 120);
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [hasAttachedSources, sourcesOpen, attachedSources.length]);

  /** Max width + stacking for popover; `ai-ux-floating-prompt-dropdown-panel` clips to radius (CSS). */
  const floatingPromptMenuPanelClass =
    "ai-ux-floating-prompt-dropdown-panel z-[130] w-[min(100vw-2rem,20rem)]";

  return (
    <>
      <ModusWcDropdownMenu
        ref={(el) => {
          sourcesDdmRef.current = el;
        }}
        menuVisible={sourcesOpen}
        onMenuVisibilityChange={(e: CustomEvent<{ isVisible: boolean }>) =>
          onSourcesOpenChange(e.detail.isVisible)
        }
        menuPlacement="bottom-end"
        menuSize="sm"
        menuOffset={4}
        customClass={
          hasAttachedSources
            ? "ai-ux-floating-prompt-dropdown-host ai-ux-floating-prompt-sources-dd ai-ux-floating-prompt-sources-dd--attached shrink-0"
            : "ai-ux-floating-prompt-dropdown-host ai-ux-floating-prompt-sources-dd ai-ux-floating-prompt-sources-dd--empty shrink-0"
        }
        buttonAriaLabel={
          hasAttachedSources
            ? `Sources — ${attachedSources.length} attached`
            : "Add files, links, and sources"
        }
        buttonColor="tertiary"
        buttonVariant={hasAttachedSources ? "filled" : "borderless"}
        buttonSize="sm"
        buttonShape={hasAttachedSources ? "ellipse" : "square"}
      >
        <div
          slot="button"
          className={
            hasAttachedSources
              ? "inline-flex shrink-0 items-center justify-center gap-0.5 px-px"
              : "inline-flex h-full w-full min-h-0 items-center justify-center"
          }
        >
          {hasAttachedSources ? (
            <>
              <ModusWcIcon
                name="paperclip"
                size="sm"
                decorative
                customClass="shrink-0"
              />
              <ModusWcChip
                label={String(attachedSources.length)}
                size="sm"
                variant="outline"
                customClass="!m-0 h-5 !min-w-[1.25rem] !px-1 !py-0"
              />
              <ModusWcIcon
                name="expand_more"
                size="sm"
                decorative
                customClass="shrink-0 text-[var(--modus-wc-color-base-content-low-contrast)]"
              />
            </>
          ) : (
            <ModusWcIcon name="add" size="sm" decorative />
          )}
        </div>
        <div slot="menu" className={floatingPromptMenuPanelClass}>
          <div className="px-3 py-2">
            <ModusWcTypography
              hierarchy="p"
              size="sm"
              weight="semibold"
              label="Sources"
            />
            <ModusWcTypography
              hierarchy="p"
              size="xs"
              label="Attach files, project documents, links, and cloud references. They are embedded in this prompt and shown to the model as context."
            />
          </div>
          <div className="divider-wrapper">
            <ModusWcDivider customClass="!m-0" />
          </div>
          <div className="px-3 pb-1 pt-2">
            <ModusWcTypography
              hierarchy="p"
              size="xs"
              weight="semibold"
              label="In this prompt"
            />
            <ModusWcTypography className="!text-[var(--modus-wc-color-base-content-low-contrast)]" hierarchy="p" size="xs" customClass="!mt-1" label="Add a source to this prompt" />
          </div>
          <ModusWcMenu
            size="sm"
            ariaLabel="Add sources in this prompt"
            customClass="!py-0"
          >
            <ModusWcMenuItem
              label="Attach URL"
              value="in-prompt-link"
              onItemSelect={() => addSourceInPrompt("link")}
            >
              <FloatingPromptMenuStartIcon>
                <ModusWcIcon name="link" size="sm" decorative />
              </FloatingPromptMenuStartIcon>
            </ModusWcMenuItem>
            <ModusWcMenuItem
              label="Upload file from computer"
              value="in-prompt-file"
              onItemSelect={() => addSourceInPrompt("file")}
            >
              <FloatingPromptMenuStartIcon>
                <ModusWcIcon name="upload" size="sm" decorative />
              </FloatingPromptMenuStartIcon>
            </ModusWcMenuItem>
            <ModusWcMenuItem
              label="Add project document"
              value="in-prompt-doc"
              onItemSelect={() => addSourceInPrompt("doc")}
            >
              <FloatingPromptMenuStartIcon>
                <ModusWcIcon name="file_text" size="sm" decorative />
              </FloatingPromptMenuStartIcon>
            </ModusWcMenuItem>
            <ModusWcMenuItem
              label="Browse Trimble Connect"
              value="in-prompt-connect"
              onItemSelect={() => addSourceInPrompt("connect")}
            >
              <FloatingPromptMenuStartIcon>
                <ModusWcIcon name="cloud_upload" size="sm" decorative />
              </FloatingPromptMenuStartIcon>
            </ModusWcMenuItem>
          </ModusWcMenu>
          {attachedSources.length > 0 ? (
            <div className="divider-wrapper">
              <ModusWcDivider customClass="!m-0" />
            </div>
          ) : null}
          {attachedSources.length === 0 ? (
            <div className="px-3 py-2">
              <ModusWcTypography className="!text-[var(--modus-wc-color-base-content-low-contrast)]" hierarchy="p" size="xs" label="No sources yet. Choose an action below to add one." />
            </div>
          ) : (
            <div
              className="flex min-w-0 flex-col gap-2 px-3 pb-2 pt-2"
              role="list"
              aria-label="Sources in this prompt"
            >
              {attachedSources.map((s) => (
                <div key={s.id} role="listitem">
                  <AiUxSourcesPatternRow
                    embedded
                    title={s.title}
                    meta={s.meta}
                    icon={s.icon}
                    onRemove={() =>
                      setAttachedSources((prev) =>
                        prev.filter((x) => x.id !== s.id),
                      )
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </ModusWcDropdownMenu>

      <ModusWcDropdownMenu
        menuVisible={toolsOpen}
        onMenuVisibilityChange={(e: CustomEvent<{ isVisible: boolean }>) =>
          onToolsOpenChange(e.detail.isVisible)
        }
        menuPlacement="bottom-end"
        menuSize="sm"
        menuOffset={4}
        customClass="ai-ux-floating-prompt-dropdown-host relative shrink-0"
        buttonAriaLabel="AI tools (Trimble context)"
        buttonColor="tertiary"
        buttonVariant="borderless"
        buttonSize="sm"
        buttonShape="square"
      >
        <div
          slot="button"
          className="inline-flex size-8 items-center justify-center"
        >
          <ModusWcIcon name="tune" size="sm" decorative />
        </div>
        <div slot="menu" className={floatingPromptMenuPanelClass}>
          <div className="px-3 py-2">
            <ModusWcTypography
              hierarchy="p"
              size="sm"
              weight="semibold"
              label="Tools"
            />
            <ModusWcTypography
              hierarchy="p"
              size="xs"
              label="Connect Trimble and field workflows. Availability depends on your product and entitlements (placeholder)."
            />
          </div>
          <div className="divider-wrapper">
            <ModusWcDivider customClass="!m-0" />
          </div>
          <ModusWcMenu
            size="sm"
            ariaLabel="Trimble context tools"
          >
            {TRIMBLE_CONTEXT_TOOLS.map((t) => (
              <ModusWcMenuItem
                key={t.value}
                label={t.label}
                value={t.value}
                subLabel={t.subLabel}
                onItemSelect={() => onToolsOpenChange(false)}
              >
                <FloatingPromptMenuStartIcon>
                  {t.value === "connect" ? (
                    <ModusWcLogo
                      name="connect"
                      emblem
                      alt=""
                      customClass="shrink-0"
                    />
                  ) : (
                    <ModusWcIcon
                      name={t.icon!}
                      size="sm"
                      decorative
                    />
                  )}
                </FloatingPromptMenuStartIcon>
              </ModusWcMenuItem>
            ))}
          </ModusWcMenu>
        </div>
      </ModusWcDropdownMenu>
    </>
  );
}

export type FloatingPromptDefaultStateProps = {
  value?: string;
  onValueChange?: (value: string) => void;
  onSend?: () => void;
  /** Hide starter suggestion chips (e.g. overview home embed). */
  hideStarterChips?: boolean;
};

/** Shared pill: Sources + Tools, borderless input, send — used by default, review follow-up, and doc chat drawer. */
function FloatingPromptPromptPillRow({
  value,
  onValueChange,
  placeholder,
  inputAriaLabel,
  groupAriaLabel,
  embedded = false,
  initialAttachedSources = INITIAL_FLOATING_PROMPT_SOURCES,
  onSend,
  sendAriaLabel = "Send",
}: {
  value: string;
  onValueChange: (next: string) => void;
  placeholder: string;
  inputAriaLabel: string;
  groupAriaLabel: string;
  embedded?: boolean;
  initialAttachedSources?: FloatingPromptSource[];
  onSend?: () => void;
  sendAriaLabel?: string;
}) {
  const [inputFocused, setInputFocused] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const hasPromptContent = value.trim().length > 0;

  return (
    <div
      className={`ai-ux-floating-prompt-pill relative flex min-w-0 items-center gap-1 overflow-visible px-2 py-1.5${
        embedded ? " ai-ux-floating-prompt-pill--embedded" : ""
      }${inputFocused ? " ai-ux-floating-prompt-pill--glow" : ""}`}
      role="group"
      aria-label={groupAriaLabel}
    >
      <AiUxFloatingPromptSourcesAndToolsDropdowns
        sourcesOpen={sourcesOpen}
        onSourcesOpenChange={setSourcesOpen}
        toolsOpen={toolsOpen}
        onToolsOpenChange={setToolsOpen}
        initialAttachedSources={initialAttachedSources}
      />
      <div className="min-w-0 min-h-0 flex-1">
        <ModusWcTextInput
          label=""
          aria-label={inputAriaLabel}
          value={value}
          placeholder={placeholder}
          size="md"
          bordered={false}
          onInputChange={(e: CustomEvent) =>
            onValueChange(String(e.detail?.target?.value ?? ""))
          }
          onInputFocus={() => setInputFocused(true)}
          onInputBlur={() => setInputFocused(false)}
          customClass={AI_UX_FLOATING_PROMPT_TEXT_INPUT_CLASS}
        />
      </div>
      <ModusWcButton
        variant="filled"
        color={hasPromptContent ? "primary" : "secondary"}
        size="sm"
        shape="circle"
        customClass="!m-0 shrink-0"
        disabled={!hasPromptContent}
        aria-label={sendAriaLabel}
        {...(onSend ? { onButtonClick: () => onSend() } : {})}
      >
        <ModusWcIcon name="arrow_up" size="xs" decorative />
      </ModusWcButton>
    </div>
  );
}

export function FloatingPromptDefaultState(
  props: FloatingPromptDefaultStateProps = {},
) {
  const {
    value: valueProp,
    onValueChange,
    onSend,
    hideStarterChips = false,
  } = props;
  const [internal, setInternal] = useState("");
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : internal;
  const setValue = (v: string) => {
    onValueChange?.(v);
    if (!isControlled) {
      setInternal(v);
    }
  };

  return (
    <div className="flex w-full min-w-0 flex-col gap-2">
      {hideStarterChips ? null : (
        <AiUxFollowUpChipRow
          primaryChips={AI_UX_FLOATING_PROMPT_PRIMARY_CHIPS}
          overflowChips={AI_UX_FLOATING_PROMPT_OVERFLOW_CHIPS}
        />
      )}
      <FloatingPromptPromptPillRow
        value={value}
        onValueChange={setValue}
        placeholder="Describe any changes you want to make…"
        inputAriaLabel="Ask AI to update the document"
        groupAriaLabel="Document prompt"
        embedded={false}
        initialAttachedSources={[]}
        onSend={onSend}
        sendAriaLabel="Send prompt"
      />
    </div>
  );
}

export function FloatingPromptWorkingState({
  onStop,
}: {
  onStop?: () => void;
} = {}) {
  return (
    <div
      className="ai-ux-floating-prompt-pill ai-ux-floating-prompt-pill--glow relative flex w-full min-w-0 items-center gap-2 overflow-visible px-2 py-1.5"
      role="status"
      aria-live="polite"
      aria-label="AI is working on your request"
    >
      <div
        className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-visible"
        aria-hidden
      >
        <div className="ai-ux-floating-prompt-progress-ring" />
        <ModusWcIcon
          name="ai_stars"
          size={getModusIconSize("h-4 w-4")}
          customClass="modus-ai-mark-gradient-icon relative z-[1] h-4 w-4"
          decorative
        />
      </div>
      <div className="min-w-0 min-h-0 flex-1">
        <div className="flex min-w-0 max-w-full flex-wrap items-center gap-1.5">
          <span className="inline-flex min-w-0 items-baseline gap-0">
            <span className="ai-ux-floating-prompt-thinking-label !m-0 !inline text-sm font-semibold leading-tight">
              Thinking
            </span>
            <span
              className="ai-ux-floating-prompt-thinking-dots"
              aria-hidden
            >
              <span className="ai-ux-floating-prompt-thinking-dots__dot">.</span>
              <span className="ai-ux-floating-prompt-thinking-dots__dot">.</span>
              <span className="ai-ux-floating-prompt-thinking-dots__dot">.</span>
            </span>
          </span>
          <span
            className="inline-flex shrink-0 items-center gap-1"
            aria-hidden
          >
            <ModusWcLogo
              name="connect"
              emblem
              alt=""
              customClass="block h-4 w-4 shrink-0 object-contain pointer-events-none"
            />
            <ModusWcLogo
              name="sketchup"
              emblem
              alt=""
              customClass="block h-4 w-4 shrink-0 object-contain pointer-events-none"
            />
          </span>
        </div>
        <ModusWcTypography className="!text-[var(--modus-wc-color-base-content-low-contrast)]" hierarchy="p" size="sm" label="This might take a minute" />
      </div>
      <ModusWcButton
        variant="outlined"
        color="tertiary"
        size="sm"
        shape="circle"
        customClass="!m-0 shrink-0"
        aria-label="Stop"
        {...(onStop ? { onButtonClick: () => onStop() } : {})}
      >
        <ModusWcIcon name="stop_circle" size="xs" decorative />
      </ModusWcButton>
    </div>
  );
}

/**
 * Trimble Assistant panel at **app root** (`document.body` portal): viewport shell acts like
 * Modus Storybook `main-content-wrapper` (`position: relative` + `overflow: hidden`
 * + full height) so `modus-wc-utility-panel` with `pushContent={false}` overlays the
 * app the same way as Overlay mode docs. Panel chrome stays Modus-only (`:not` in globals).
 */
function FloatingPromptDocChatDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [drawerPrompt, setDrawerPrompt] = useState("");
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => {
      dialogRef.current?.focus();
    });
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="ai-ux-floating-prompt-doc-chat-portal pointer-events-none fixed inset-0 z-[10050]"
      aria-hidden={false}
    >
      <button
        type="button"
        className="ai-ux-floating-prompt-doc-chat-dismiss-layer pointer-events-auto absolute inset-0 cursor-default border-0 p-0"
        onClick={onClose}
        aria-label="Dismiss Trimble Assistant"
      />
      <div className="pointer-events-none absolute inset-0 flex min-h-0 justify-end overflow-hidden">
        <div
          ref={dialogRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="ai-ux-floating-prompt-trimble-assistant-title"
          className="pointer-events-auto flex h-full min-h-0 w-full max-w-md min-w-0 flex-col outline-none"
        >
        <ModusWcUtilityPanel
          expanded={open}
          pushContent={false}
          className="ai-ux-floating-prompt-doc-chat-utility-panel block h-full min-h-0 w-full min-w-0"
        >
            <div
              slot="header"
              className="flex w-full min-w-0 items-center justify-between gap-2"
            >
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <ModusWcTypography id="ai-ux-floating-prompt-trimble-assistant-title" hierarchy="p" size="md" weight="semibold" label="Trimble Assistant" customClass="!m-0 min-w-0 truncate" />
              </div>
              <ModusWcButton
                variant="borderless"
                color="tertiary"
                size="sm"
                shape="square"
                aria-label="Close"
                onButtonClick={onClose}
              >
                <ModusWcIcon name="close" size="sm" decorative />
              </ModusWcButton>
            </div>

            {/*
              Pin composer without scrolling the Modus body: `.modus-wc-utility-panel-body` uses
              `overflow:auto`, so `min-h-full` + `justify-between` on the slot alone can make
              scrollHeight > clientHeight. We cap the body via CSS and scroll only `.ai-ux-
              floating-prompt-doc-chat__messages`. Do not use `overflow-x-hidden` on wrappers
              (it promotes `overflow-y:auto`); clip only the inner text-input label/input in CSS.
            */}
            <div
              slot="body"
              className="ai-ux-floating-prompt-doc-chat__body box-border flex min-h-0 w-full min-w-0 max-w-full flex-1 flex-col overflow-hidden"
            >
              <div
                className="ai-ux-floating-prompt-doc-chat__messages flex min-h-0 min-w-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain pb-3"
                role="log"
                aria-live="polite"
                aria-relevant="additions"
              >
                <div className="flex min-w-0 justify-end">
                  <div className="ai-ux-floating-prompt-doc-chat__user-bubble px-3 py-2">
                    <ModusWcTypography className="!text-[var(--modus-wc-color-base-content)]" hierarchy="p" size="md" label="Update the strategy section for Modus 2.0" customClass="!m-0" />
                  </div>
                </div>
                <div className="flex min-w-0 flex-col gap-2">
                  <div className="flex min-w-0 items-start gap-2">
                    <ModusWcIcon
                      name="ai_stars"
                      size="sm"
                      decorative
                      customClass="modus-ai-mark-gradient-icon mt-0.5 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <ModusWcTypography className="!text-[var(--modus-wc-color-base-content)]" hierarchy="p" size="md" label="I've drafted the strategy document covering the transition from design tools, the Modus 2.0 adoption plan, and key initiatives like mobile theming. The content aligns with recent discussions on training and rollout." customClass="!m-0 break-words" />
                    </div>
                  </div>
                  <div className="flex min-w-0 flex-wrap items-center gap-2 pl-7">
                    <ModusWcChip
                      label="2 sources"
                      size="sm"
                      variant="outline"
                      customClass="!m-0 max-w-full"
                    >
                      <ModusWcIcon name="link" size="xs" decorative />
                    </ModusWcChip>
                    <ModusWcButton
                      variant="borderless"
                      color="tertiary"
                      size="sm"
                      shape="square"
                      aria-label="Helpful"
                    >
                      <ModusWcIcon name="thumbs_up" size="sm" decorative />
                    </ModusWcButton>
                    <ModusWcButton
                      variant="borderless"
                      color="tertiary"
                      size="sm"
                      shape="square"
                      aria-label="Not helpful"
                    >
                      <ModusWcIcon name="thumbs_down" size="sm" decorative />
                    </ModusWcButton>
                    <ModusWcButton
                      variant="borderless"
                      color="tertiary"
                      size="sm"
                      shape="square"
                      aria-label="More options"
                    >
                      <ModusWcIcon name="more_vertical" size="sm" decorative />
                    </ModusWcButton>
                  </div>
                  <div className="flex min-w-0 flex-wrap gap-2 pl-7 pt-1">
                    <ModusWcButton variant="outlined" color="tertiary" size="sm">
                      Reject
                    </ModusWcButton>
                    <ModusWcButton variant="filled" color="primary" size="sm">
                      <span className="inline-flex items-center gap-1">
                        <ModusWcIcon name="check" size="sm" decorative />
                        Accept
                      </span>
                    </ModusWcButton>
                  </div>
                </div>
              </div>

              <div className="ai-ux-floating-prompt-doc-chat__composer flex min-w-0 max-w-full shrink-0 flex-col gap-2 pt-1">
                <ModusWcDivider customClass="!m-0 shrink-0" />

                <div className="ai-ux-floating-prompt-doc-chat__prompt-surface min-w-0 max-w-full">
                  <FloatingPromptPromptPillRow
                    value={drawerPrompt}
                    onValueChange={setDrawerPrompt}
                    placeholder="Ask about this document…"
                    inputAriaLabel="Message to document assistant"
                    groupAriaLabel="Trimble Assistant prompt"
                    embedded
                    sendAriaLabel="Send"
                  />
                </div>
                <ModusWcTypography className="!text-[var(--modus-wc-color-base-content-low-contrast)]" hierarchy="p" size="xs" customClass="!m-0" label="AI can make mistakes. Check important info." />
              </div>
            </div>
        </ModusWcUtilityPanel>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function FloatingPromptReviewState({
  onReset,
  onFollowUpSend,
}: {
  onReset?: () => void;
  /** When set, Send on a non-empty follow-up clears the field and invokes this (e.g. return to working). */
  onFollowUpSend?: () => void;
} = {}) {
  const [followUp, setFollowUp] = useState("");
  const [docChatOpen, setDocChatOpen] = useState(false);

  const handleFollowUpSend = () => {
    if (!followUp.trim()) return;
    setFollowUp("");
    onFollowUpSend?.();
  };

  return (
    <>
    <div
      className="ai-ux-floating-prompt-review w-full min-w-0 overflow-visible pt-3 pr-4 pb-3 pl-4"
      role="region"
      aria-label="AI response and follow-up"
    >
      <div className="ai-ux-floating-prompt-review__stack flex min-w-0 flex-col gap-3">
        <div className="flex min-w-0 items-start justify-between gap-2">
          <ModusWcIcon
            name="ai_stars"
            size="sm"
            customClass="modus-ai-mark-gradient-icon shrink-0"
            decorative
          />
          <div className="flex min-w-0 flex-wrap items-center justify-end gap-0.5">
            <ModusWcButton
              variant="borderless"
              color="tertiary"
              size="sm"
              shape="square"
              aria-label="Helpful"
            >
              <ModusWcIcon name="thumbs_up" size="sm" decorative />
            </ModusWcButton>
            <ModusWcButton
              variant="borderless"
              color="tertiary"
              size="sm"
              shape="square"
              aria-label="Not helpful"
            >
              <ModusWcIcon name="thumbs_down" size="sm" decorative />
            </ModusWcButton>
            <ModusWcButton
              variant="borderless"
              color="tertiary"
              size="sm"
              shape="square"
              aria-label="Open Trimble Assistant"
              onButtonClick={() => setDocChatOpen(true)}
            >
              <ModusWcIcon name="toggle_right_panel" size="sm" decorative />
            </ModusWcButton>
            <ModusWcButton
              variant="borderless"
              color="tertiary"
              size="sm"
              shape="square"
              aria-label="More options"
            >
              <ModusWcIcon name="more_vertical" size="sm" decorative />
            </ModusWcButton>
            <ModusWcButton
              variant="borderless"
              color="tertiary"
              size="sm"
              shape="square"
              aria-label={
                onReset
                  ? "Close and return to the document prompt"
                  : "Close"
              }
              {...(onReset ? { onButtonClick: onReset } : {})}
            >
              <ModusWcIcon name="close" size="sm" decorative />
            </ModusWcButton>
          </div>
        </div>
        <ModusWcTypography hierarchy="p" size="md" label="I've finished writing that document about the Modus design system for you!" customClass="!m-0 !p-0 w-full !max-w-full" />
        <ModusWcDivider />
        <FloatingPromptPromptPillRow
          value={followUp}
          onValueChange={setFollowUp}
          placeholder="Fix errors in this doc…"
          inputAriaLabel="Follow-up to this response"
          groupAriaLabel="Follow-up prompt"
          embedded
          onSend={onFollowUpSend ? handleFollowUpSend : undefined}
          sendAriaLabel="Send follow-up"
        />
      </div>
    </div>
    <FloatingPromptDocChatDrawer
      open={docChatOpen}
      onClose={() => setDocChatOpen(false)}
    />
    </>
  );
}

const FLOATING_PROMPT_WORKING_DEMO_MS = 2400;

type FloatingPromptPhase = "default" | "working" | "review";

/** Single-surface demo: default → working (auto-advances) → review; follow-up send → working again; Stop or Close (X) resets to default. */
function FloatingPromptUnifiedFlow({
  hideStarterChips = false,
}: {
  hideStarterChips?: boolean;
} = {}) {
  const [phase, setPhase] = useState<FloatingPromptPhase>("default");
  const [prompt, setPrompt] = useState("");
  const workTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearWorkTimer = () => {
    if (workTimerRef.current) {
      clearTimeout(workTimerRef.current);
      workTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearWorkTimer();
  }, []);

  const goWorking = () => {
    setPhase("working");
    clearWorkTimer();
    workTimerRef.current = setTimeout(() => {
      workTimerRef.current = null;
      setPhase("review");
    }, FLOATING_PROMPT_WORKING_DEMO_MS);
  };

  const handleStop = () => {
    clearWorkTimer();
    setPhase("default");
  };

  const resetToPrompt = () => {
    clearWorkTimer();
    setPhase("default");
    setPrompt("");
  };

  return (
    <div className="flex w-full min-h-0 min-w-0 flex-1 flex-col">
      {phase === "default" ? (
        <FloatingPromptDefaultState
          value={prompt}
          onValueChange={setPrompt}
          onSend={goWorking}
          hideStarterChips={hideStarterChips}
        />
      ) : null}
      {phase === "working" ? (
        <FloatingPromptWorkingState onStop={handleStop} />
      ) : null}
      {phase === "review" ? (
        <FloatingPromptReviewState
          onReset={resetToPrompt}
          onFollowUpSend={goWorking}
        />
      ) : null}
    </div>
  );
}

/** Inner floating prompt UI (no spec card). */
export function AiUxFloatingPromptPatternSurface({
  hideStarterChips = false,
}: {
  hideStarterChips?: boolean;
} = {}) {
  return (
    <div className="flex w-full max-w-3xl min-w-0 flex-col gap-0">
      <FloatingPromptUnifiedFlow hideStarterChips={hideStarterChips} />
    </div>
  );
}

/**
 * Floating prompt pattern — interactive default → working → review on one surface.
 */
export function AiUxFloatingPromptPattern({
  hideStarterChips = false,
}: {
  hideStarterChips?: boolean;
} = {}) {
  return (
    <AiUxSpecCard>
      <AiUxFloatingPromptPatternSurface hideStarterChips={hideStarterChips} />
    </AiUxSpecCard>
  );
}

export default AiUxFloatingPromptPattern;
