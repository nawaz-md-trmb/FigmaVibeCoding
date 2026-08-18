// @ts-nocheck
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  ModusWcButton,
  ModusWcCard,
  ModusWcChip,
  ModusWcIcon,
  ModusWcLogo,
  ModusWcTextarea,
  ModusWcTextInput,
  ModusWcTypography,
} from "@trimble-oss/moduswebcomponents-react";
function getModusIconSize(className?: string): 'sm' | 'md' | 'lg' {
  if (!className) return 'md';
  if (className.includes('h-3') || className.includes('h-4')) return 'sm';
  if (className.includes('h-7') || className.includes('h-8')) return 'lg';
  return 'md';
}
import { AiUxGradientFrame, AiUxSpecCard } from "./AiUxSpecCard";
import {
  AiUxFollowUpChipRow,
  AI_UX_DEFAULT_OVERFLOW_CHIPS,
  AI_UX_DEFAULT_PRIMARY_CHIPS,
} from "./AiUxFollowUpChipRow";
import {
  AiUxSourcesPatternRow,
  AiUxUsedByAiBadge,
} from "./AiUxSourcesPattern";
import {
  AiUxPromptComposerSurface,
  AiUxPromptControlStrip,
} from "./AiUxPromptComposerSurface";

/** Programmatic demo selection for Inline Action interactive preview (CodePreview). */
const AI_UX_INLINE_ACTION_AUTO_SELECT_PHRASE = "submit weekly";

/**
 * Selects `phrase` inside `el` using the DOM Selection API (must match `el.textContent`
 * substring positions across concatenated text nodes).
 */
function selectPhraseInElement(el: HTMLElement, phrase: string): boolean {
  const full = el.textContent ?? "";
  const idx = full.indexOf(phrase);
  if (idx < 0) return false;

  const globalTextOffsetToBoundary = (
    globalOffset: number,
  ): [Text, number] | null => {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let seen = 0;
    let node: Node | null;
    while ((node = walker.nextNode())) {
      const textNode = node as Text;
      const len = textNode.data.length;
      if (globalOffset <= seen + len) {
        return [textNode, globalOffset - seen];
      }
      seen += len;
    }
    return null;
  };

  const start = globalTextOffsetToBoundary(idx);
  const end = globalTextOffsetToBoundary(idx + phrase.length);
  if (!start || !end) return false;

  const range = document.createRange();
  try {
    range.setStart(start[0], start[1]);
    range.setEnd(end[0], end[1]);
  } catch {
    return false;
  }

  const sel = window.getSelection();
  if (!sel) return false;
  sel.removeAllRanges();
  sel.addRange(range);
  return true;
}

const AI_UX_REFERENCE_LIST_ROWS = [
  {
    title: "Uploaded content",
    meta: "File · 7.61 KB · 102 extracted lines",
    icon: "file_text" as const,
  },
  {
    title: "Uploaded content",
    meta: "File · 7.61 KB · 102 extracted lines",
    icon: "file_text" as const,
  },
  {
    title: "Uploaded content",
    meta: "File · 7.61 KB · 102 extracted lines",
    icon: "file_text" as const,
  },
  {
    title: "Specs — structural addendum",
    meta: "File · 1.2 MB · 48 extracted lines",
    icon: "file_text" as const,
  },
  {
    title: "SharePoint — site safety policy",
    meta: "Web · Linked section · Refreshed today",
    icon: "link" as const,
  },
  {
    title: "Trimble Connect · MEP model",
    meta: "Cloud · Latest published · 3 linked views",
    icon: "folder_project" as const,
  },
  {
    title: "Site photos (batch)",
    meta: "File · 4.8 MB · 12 images indexed",
    icon: "image" as const,
  },
] as const;

export function AiUxFollowUpPreview() {
  return (
    <AiUxSpecCard>
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <ModusWcIcon
            name="ai_stars"
            size={getModusIconSize("h-4 w-4")}
            customClass="modus-ai-mark-gradient-icon h-4 w-4"
            decorative
          />
          <ModusWcTypography
            hierarchy="p"
            size="sm"
            weight="semibold"
            label="Recommended follow-up actions"
          />
        </div>
        <AiUxFollowUpChipRow
          primaryChips={AI_UX_DEFAULT_PRIMARY_CHIPS}
          overflowChips={AI_UX_DEFAULT_OVERFLOW_CHIPS}
        />
      </div>
    </AiUxSpecCard>
  );
}

/** Demo copy for the Suggestion pattern — vertical starter prompts (agentic style). */
export const AI_UX_SUGGESTION_STARTER_PROMPTS = [
  "How do I use button inside a card?",
  "Show me how to use the accordion component in React",
  "What props does modus-wc-navbar expose for visibility?",
  "How do I wire inputChange on modus-wc-text-input in React?",
  "Where should I import modus-wc-styles.css in a Vite app?",
] as const;

export function AiUxSuggestionPreview() {
  return (
    <AiUxSpecCard>
      <div className="overflow-visible rounded-lg border border-[var(--modus-wc-color-base-200)] bg-[var(--modus-wc-color-base-page)]">
        <ModusWcCard
          bordered={false}
          padding="compact"
          customClass="!m-0 w-full !bg-[var(--modus-wc-color-base-page)] !shadow-none"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="ai-ux-agent-mark-static shrink-0" aria-hidden>
                <ModusWcIcon
                  name="ai_stars"
                  size="sm"
                  decorative
                  customClass="text-[var(--modus-wc-color-base-100)]"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <ModusWcTypography className="text-[var(--modus-wc-color-base-content)]" hierarchy="p" size="lg" weight="semibold" label="Modus Agent" customClass="m-0" />
                <ModusWcTypography className="text-[var(--modus-wc-color-base-content-low-contrast)]" hierarchy="p" size="sm" customClass="m-0" label="AI assistant for Modus Web Components" />
              </div>
            </div>
            <ul
              className="m-0 flex list-none flex-col gap-2 p-0"
              aria-label="Starter prompts"
            >
              {AI_UX_SUGGESTION_STARTER_PROMPTS.map((text) => (
                <li key={text} className="min-w-0">
                  <ModusWcButton
                    variant="filled"
                    color="tertiary"
                    size="sm"
                    customClass="w-full !h-auto min-h-0 justify-start whitespace-normal text-left"
                    aria-label={`Start with: ${text}`}
                  >
                    <span className="block w-full text-left text-sm font-normal leading-snug">
                      {text}
                    </span>
                  </ModusWcButton>
                </li>
              ))}
            </ul>
          </div>
        </ModusWcCard>
      </div>
    </AiUxSpecCard>
  );
}

export function AiUxNudgePreview() {
  const [cardDismissed, setCardDismissed] = useState(false);

  if (cardDismissed) {
    return (
      <AiUxSpecCard>
        <ModusWcTypography className="text-[var(--modus-wc-color-base-content-low-contrast)]" hierarchy="p" size="sm" label="Nudge dismissed." />
        <ModusWcButton
          size="sm"
          variant="outlined"
          color="tertiary"
          onButtonClick={() => {
            setCardDismissed(false);
          }}
        >
          Show again
        </ModusWcButton>
      </AiUxSpecCard>
    );
  }

  return (
    <AiUxSpecCard>
      <AiUxGradientFrame>
        <div className="flex flex-col gap-4 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <ModusWcIcon
                name="ai_stars"
                size="md"
                decorative
                customClass="modus-ai-mark-gradient-icon shrink-0"
              />
              <div className="min-w-0 flex flex-col gap-1">
                <ModusWcTypography className="text-[var(--modus-wc-color-base-content)]" hierarchy="p" size="md" weight="semibold" customClass="m-0" label="Nudge title" />
                <ModusWcTypography className="text-[var(--modus-wc-color-base-content-low-contrast)]" hierarchy="p" size="sm" customClass="m-0" label="Generate results with an AI action tailored to this page." />
              </div>
            </div>
            <ModusWcButton
              variant="borderless"
              color="tertiary"
              size="sm"
              shape="square"
              aria-label="Dismiss card nudge"
              onButtonClick={() => setCardDismissed(true)}
            >
              <ModusWcIcon name="close" size="sm" decorative />
            </ModusWcButton>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <ModusWcButton size="sm" variant="outlined" color="tertiary">
              Not now
            </ModusWcButton>
            <ModusWcButton size="sm" variant="filled" color="primary">
              Try it
            </ModusWcButton>
          </div>
        </div>
      </AiUxGradientFrame>
    </AiUxSpecCard>
  );
}

export function AiUxPromptPreview() {
  const [prompt, setPrompt] = useState("");
  return (
    <AiUxSpecCard>
      <AiUxPromptComposerSurface value={prompt} onChange={setPrompt} />
    </AiUxSpecCard>
  );
}

function AiUxInlineActionToolbarChrome() {
  return (
    <>
      <div
        className="z-[1] h-0 w-0 shrink-0 border-x-[9px] border-x-transparent border-b-[10px] border-b-[var(--modus-wc-color-base-page)]"
        aria-hidden
      />
      <AiUxGradientFrame
        className="-mt-px w-full max-w-[min(100%,20rem)]"
        innerClassName="!bg-[var(--modus-wc-color-base-page)]"
      >
        <div className="flex items-center justify-between gap-3 px-3 py-2.5">
          <ModusWcButton
            variant="borderless"
            color="tertiary"
            size="sm"
            aria-label="Rewrite selection"
          >
            <span className="inline-flex items-center gap-1.5">
              <ModusWcIcon
                name="magic_wand"
                size="sm"
                decorative
                customClass="text-[var(--modus-wc-color-base-content)]"
              />
              Rewrite
            </span>
          </ModusWcButton>
          <AiUxGradientFrame
            className="shrink-0 rounded-md"
            innerClassName="flex items-center justify-center !bg-[var(--modus-wc-color-base-page)] px-2 py-1"
          >
            <ModusWcTypography className="text-[var(--modus-wc-color-base-content)]" hierarchy="p" size="xs" weight="bold" label="AI" customClass="m-0 tracking-wide" />
          </AiUxGradientFrame>
        </div>
      </AiUxGradientFrame>
    </>
  );
}

/**
 * @param staticToolbar List-card previews wrap with `pointer-events-none` — selection
 *   cannot run; show a fixed snapshot. Interactive preview auto-selects a demo phrase on mount.
 */
export function AiUxInlineActionPreview({
  staticToolbar = false,
}: {
  staticToolbar?: boolean;
} = {}) {
  if (staticToolbar) {
    return (
      <AiUxSpecCard>
        <div className="relative max-w-xl">
          <ModusWcTypography className="text-[var(--modus-wc-color-base-content-low-contrast)]" hierarchy="p" size="xs" customClass="mb-2" label="Rewrite toolbar (list card preview)." />
          <p className="rounded-md border border-dashed border-[var(--modus-wc-color-base-200)] bg-[var(--modus-wc-color-base-100)] p-3 text-sm leading-relaxed text-[var(--modus-wc-color-base-content)]">
            The contractor shall{" "}
            <strong className="font-semibold">submit weekly</strong> progress
            reports including schedule variance, open risks, and photos of critical
            path work. This sentence could be tightened before sharing with the
            owner.
          </p>
          <div
            className="ai-ux-inline-action-toolbar-animate pointer-events-auto mt-2 flex min-w-0 flex-col items-center"
            role="toolbar"
            aria-label="Rewrite selection"
          >
            <AiUxInlineActionToolbarChrome />
          </div>
        </div>
      </AiUxSpecCard>
    );
  }

  return <AiUxInlineActionPreviewInteractive />;
}

function AiUxInlineActionPreviewInteractive() {
  const rootRef = useRef<HTMLDivElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  /** Primary-button drag-select from the paragraph: defer toolbar until pointerup. */
  const pointerGestureSelectingRef = useRef(false);
  const [inlineOpen, setInlineOpen] = useState(false);
  const [anchor, setAnchor] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  const syncFromSelection = useCallback(() => {
    const root = rootRef.current;
    const paragraph = paragraphRef.current;
    if (!root || !paragraph) return;

    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
      setInlineOpen(false);
      return;
    }

    const range = sel.getRangeAt(0);
    if (!paragraph.contains(range.commonAncestorContainer)) {
      setInlineOpen(false);
      return;
    }

    const rect = range.getBoundingClientRect();
    if (rect.width <= 0 && rect.height <= 0) {
      setInlineOpen(false);
      return;
    }

    const rootRect = root.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const bottomY = rect.bottom;

    setAnchor({
      top: bottomY - rootRect.top + 4,
      left: centerX - rootRect.left,
    });
    setInlineOpen(true);
  }, []);

  const scheduleSyncFromSelection = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      syncFromSelection();
    });
  }, [syncFromSelection]);

  useEffect(() => {
    const onSelectionChange = () => {
      if (pointerGestureSelectingRef.current) {
        const paragraph = paragraphRef.current;
        const sel = window.getSelection();
        if (!paragraph || !sel || sel.isCollapsed || sel.rangeCount === 0) {
          setInlineOpen(false);
          return;
        }
        const range = sel.getRangeAt(0);
        if (!paragraph.contains(range.commonAncestorContainer)) {
          setInlineOpen(false);
        }
        return;
      }
      scheduleSyncFromSelection();
    };
    document.addEventListener("selectionchange", onSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", onSelectionChange);
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [scheduleSyncFromSelection]);

  useEffect(() => {
    const p = paragraphRef.current;
    if (!p) return;

    const onParagraphPointerDown = (ev: PointerEvent) => {
      if (ev.button !== 0) return;
      pointerGestureSelectingRef.current = true;
      setInlineOpen(false);
    };

    const endParagraphPointerGesture = () => {
      if (!pointerGestureSelectingRef.current) return;
      pointerGestureSelectingRef.current = false;
      scheduleSyncFromSelection();
    };

    p.addEventListener("pointerdown", onParagraphPointerDown);
    document.addEventListener("pointerup", endParagraphPointerGesture);
    document.addEventListener("pointercancel", endParagraphPointerGesture);
    return () => {
      p.removeEventListener("pointerdown", onParagraphPointerDown);
      document.removeEventListener("pointerup", endParagraphPointerGesture);
      document.removeEventListener("pointercancel", endParagraphPointerGesture);
    };
  }, [scheduleSyncFromSelection]);

  useLayoutEffect(() => {
    const p = paragraphRef.current;
    if (p) {
      selectPhraseInElement(p, AI_UX_INLINE_ACTION_AUTO_SELECT_PHRASE);
      syncFromSelection();
    }

    return () => {
      const p2 = paragraphRef.current;
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0 || !p2) return;
      const anchorNode = sel.anchorNode;
      if (anchorNode && p2.contains(anchorNode)) sel.removeAllRanges();
    };
  }, [syncFromSelection]);

  useEffect(() => {
    if (!inlineOpen) return;

    const onPointerDown = (ev: PointerEvent) => {
      if (ev.button !== 0) return;
      const t = ev.target as Node | null;
      if (!t) return;
      if (panelRef.current?.contains(t)) return;
      if (paragraphRef.current?.contains(t)) return;
      setInlineOpen(false);
    };

    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") setInlineOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [inlineOpen]);

  return (
    <AiUxSpecCard>
      <div ref={rootRef} className="relative max-w-xl">
        <ModusWcTypography className="text-[var(--modus-wc-color-base-content-low-contrast)]" hierarchy="p" size="xs" customClass="mb-2" label="A demo phrase is selected; drag to reselect—release the pointer to show the rewrite bar." />
        <p
          ref={paragraphRef}
          className="cursor-text select-text rounded-md border border-dashed border-[var(--modus-wc-color-base-200)] bg-[var(--modus-wc-color-base-100)] p-3 text-sm leading-relaxed text-[var(--modus-wc-color-base-content)]"
        >
          The contractor shall submit weekly progress reports including schedule
          variance, open risks, and photos of critical path work. This sentence
          could be tightened before sharing with the owner.
        </p>

        {inlineOpen ? (
          <div
            ref={panelRef}
            className="pointer-events-auto absolute z-10 -translate-x-1/2"
            style={{ top: anchor.top, left: anchor.left }}
            role="presentation"
          >
            <div
              className="ai-ux-inline-action-toolbar-animate flex min-w-[min(100%,20rem)] max-w-[min(100%,20rem)] flex-col items-center"
              role="toolbar"
              aria-label="Rewrite selection"
            >
              <AiUxInlineActionToolbarChrome />
            </div>
          </div>
        ) : null}
      </div>
    </AiUxSpecCard>
  );
}

const AI_UX_AUTOFILL_DEMO_VALUES = {
  projectName: "Harbor East — Phase 2",
  reportCadence: "Weekly (Fridays 4 PM)",
  ownerReviewDue: "2026-04-18",
  openRisks:
    "Steel delivery slip on Level 3 deck; weather window closing for roof pour. Escalate to GC before next concrete placement.",
  photoRequirement:
    "Attach dated photos of critical-path work referenced in the schedule with each submission.",
} as const;

type AiUxAutofillFormState = {
  projectName: string;
  reportCadence: string;
  ownerReviewDue: string;
  openRisks: string;
  photoRequirement: string;
};

const emptyAutofillForm: AiUxAutofillFormState = {
  projectName: "",
  reportCadence: "",
  ownerReviewDue: "",
  openRisks: "",
  photoRequirement: "",
};

export function AiUxAutofillPreview() {
  const [dismissed, setDismissed] = useState(false);
  const [form, setForm] = useState<AiUxAutofillFormState>(emptyAutofillForm);
  const [reviewOpen, setReviewOpen] = useState(false);

  const patchField =
    <K extends keyof AiUxAutofillFormState>(key: K) => (e: CustomEvent) => {
      const v =
        (e.detail?.target as HTMLInputElement | HTMLTextAreaElement | undefined)
          ?.value ?? "";
      setForm((prev) => ({ ...prev, [key]: v }));
    };

  return (
    <AiUxSpecCard>
      <div className="flex w-full max-w-xl flex-col gap-4">
        {dismissed ? (
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[var(--modus-wc-color-base-200)] bg-[var(--modus-wc-color-base-page)] px-3 py-2">
            <ModusWcTypography className="text-[var(--modus-wc-color-base-content)]" hierarchy="p" size="sm" customClass="m-0" label="Autofill bar dismissed." />
            <ModusWcButton
              size="sm"
              variant="outlined"
              color="tertiary"
              onButtonClick={() => setDismissed(false)}
            >
              Undo
            </ModusWcButton>
          </div>
        ) : (
          <AiUxGradientFrame
            className="w-full"
            innerClassName="!bg-[var(--modus-wc-color-base-page)]"
          >
            <div className="flex w-full min-w-0 flex-wrap items-center justify-between gap-3 px-3 py-2.5">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <ModusWcIcon
                  name="ai_stars"
                  size="sm"
                  decorative
                  customClass="modus-ai-mark-gradient-icon shrink-0"
                />
                <ModusWcTypography className="text-[var(--modus-wc-color-base-content)]" hierarchy="p" size="sm" customClass="m-0" label="Autofill 5 fields from this prompt" />
              </div>
              <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
                <ModusWcButton
                  size="sm"
                  variant="outlined"
                  color="tertiary"
                  onButtonClick={() => setReviewOpen((o) => !o)}
                >
                  Review
                </ModusWcButton>
                <ModusWcButton
                  size="sm"
                  variant="filled"
                  color="primary"
                  onButtonClick={() => {
                    setForm({ ...AI_UX_AUTOFILL_DEMO_VALUES });
                    setReviewOpen(false);
                  }}
                >
                  Apply
                </ModusWcButton>
                <ModusWcButton
                  variant="borderless"
                  color="tertiary"
                  size="sm"
                  shape="square"
                  aria-label="Dismiss autofill"
                  onButtonClick={() => {
                    setDismissed(true);
                    setReviewOpen(false);
                  }}
                >
                  <ModusWcIcon name="close" size="sm" decorative />
                </ModusWcButton>
              </div>
            </div>
          </AiUxGradientFrame>
        )}

        {reviewOpen ? (
          <ModusWcCard
            bordered={false}
            padding="compact"
            customClass="w-full"
            role="region"
            aria-label="Proposed autofill values"
          >
            <span slot="title">
              <ModusWcTypography className="text-[var(--modus-wc-color-base-content)]" hierarchy="p" size="sm" weight="semibold" customClass="m-0" label="Proposed values" />
            </span>
            <ul className="m-0 list-none space-y-1.5 p-0">
              <li>
                <ModusWcTypography className="text-[var(--modus-wc-color-base-content-low-contrast)]" hierarchy="p" size="xs" customClass="m-0" label={`Project: ${AI_UX_AUTOFILL_DEMO_VALUES.projectName}`} />
              </li>
              <li>
                <ModusWcTypography className="text-[var(--modus-wc-color-base-content-low-contrast)]" hierarchy="p" size="xs" customClass="m-0" label={`Cadence: ${AI_UX_AUTOFILL_DEMO_VALUES.reportCadence}`} />
              </li>
              <li>
                <ModusWcTypography className="text-[var(--modus-wc-color-base-content-low-contrast)]" hierarchy="p" size="xs" customClass="m-0" label={`Owner review due: ${AI_UX_AUTOFILL_DEMO_VALUES.ownerReviewDue}`} />
              </li>
              <li>
                <ModusWcTypography className="text-[var(--modus-wc-color-base-content-low-contrast)]" hierarchy="p" size="xs" customClass="m-0" label={`Risks: ${AI_UX_AUTOFILL_DEMO_VALUES.openRisks}`} />
              </li>
              <li>
                <ModusWcTypography className="text-[var(--modus-wc-color-base-content-low-contrast)]" hierarchy="p" size="xs" customClass="m-0" label={`Photos: ${AI_UX_AUTOFILL_DEMO_VALUES.photoRequirement}`} />
              </li>
            </ul>
          </ModusWcCard>
        ) : null}

        <div className="flex flex-col gap-3">
          <ModusWcTypography className="text-[var(--modus-wc-color-base-content-low-contrast)]" hierarchy="p" size="xs" customClass="m-0" label="Form below receives values when you choose Apply." />
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <ModusWcTypography className="text-[var(--modus-wc-color-base-content)]" hierarchy="p" size="xs" weight="semibold" customClass="m-0" label="Project name" />
              <ModusWcTextInput
                size="sm"
                value={form.projectName}
                placeholder="—"
                onInputChange={patchField("projectName")}
                inputId="ai-ux-autofill-project"
              />
            </div>
            <div className="flex flex-col gap-1">
              <ModusWcTypography className="text-[var(--modus-wc-color-base-content)]" hierarchy="p" size="xs" weight="semibold" customClass="m-0" label="Report cadence" />
              <ModusWcTextInput
                size="sm"
                value={form.reportCadence}
                placeholder="—"
                onInputChange={patchField("reportCadence")}
                inputId="ai-ux-autofill-cadence"
              />
            </div>
            <div className="flex flex-col gap-1">
              <ModusWcTypography className="text-[var(--modus-wc-color-base-content)]" hierarchy="p" size="xs" weight="semibold" customClass="m-0" label="Owner review due" />
              <ModusWcTextInput
                size="sm"
                value={form.ownerReviewDue}
                placeholder="YYYY-MM-DD"
                onInputChange={patchField("ownerReviewDue")}
                inputId="ai-ux-autofill-due"
              />
            </div>
            <div className="flex flex-col gap-1">
              <ModusWcTypography className="text-[var(--modus-wc-color-base-content)]" hierarchy="p" size="xs" weight="semibold" customClass="m-0" label="Open risks" />
              <ModusWcTextarea
                label=""
                rows={3}
                value={form.openRisks}
                placeholder="—"
                bordered
                size="sm"
                onInputChange={patchField("openRisks")}
              />
            </div>
            <div className="flex flex-col gap-1">
              <ModusWcTypography className="text-[var(--modus-wc-color-base-content)]" hierarchy="p" size="xs" weight="semibold" customClass="m-0" label="Photo requirement" />
              <ModusWcTextInput
                size="sm"
                value={form.photoRequirement}
                placeholder="—"
                onInputChange={patchField("photoRequirement")}
                inputId="ai-ux-autofill-photos"
              />
            </div>
          </div>
        </div>
      </div>
    </AiUxSpecCard>
  );
}

export function AiUxSummaryPreview() {
  return (
    <AiUxSpecCard>
      <AiUxGradientFrame>
        <div className="flex flex-col gap-3 p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ModusWcIcon
                name="ai_stars"
                size="sm"
                decorative
                customClass="modus-ai-mark-gradient-icon"
              />
              <ModusWcTypography
                hierarchy="p"
                size="md"
                weight="semibold"
                label="AI summary"
              />
            </div>
            <ModusWcButton variant="borderless" color="tertiary" size="sm">
              <ModusWcIcon name="close" size="sm" decorative />
            </ModusWcButton>
          </div>
          <div className="rounded-md bg-[var(--modus-wc-color-base-200)]/50 p-3">
            <ModusWcTypography className="text-[var(--modus-wc-color-base-content)]" hierarchy="p" size="sm" label="Key points: scope covers weekly reporting, risk tracking, and photo evidence on the critical path. Owner review is due within five business days." />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <ModusWcButton variant="borderless" color="tertiary" size="sm">
              Summarized by Trimble Intelligence
            </ModusWcButton>
            <ModusWcButton size="sm" variant="filled" color="primary">
              Insert
            </ModusWcButton>
          </div>
        </div>
      </AiUxGradientFrame>
    </AiUxSpecCard>
  );
}

/** Strip embedded under a prompt editor: templates, options, source, attach, send (see Prompt pattern for full editor). */
export function AiUxParametersPreview() {
  return (
    <AiUxSpecCard>
      <div className="overflow-visible rounded-lg border border-[var(--modus-wc-color-base-200)] bg-[var(--modus-wc-color-base-page)] p-3">
        <AiUxPromptControlStrip />
      </div>
    </AiUxSpecCard>
  );
}

function AiUxReferenceListRow({
  title,
  meta,
  icon,
}: {
  title: string;
  meta: string;
  icon: "file_text" | "link" | "folder_project" | "image";
}) {
  return (
    <div className="flex items-start gap-2 rounded-md border border-[var(--modus-wc-color-base-200)] bg-[var(--modus-wc-color-base-page)] px-3 py-2">
      <ModusWcIcon
        name={icon}
        size="sm"
        decorative
        customClass="mt-0.5 shrink-0"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-2 md:flex-row md:items-center md:gap-2">
        <div className="min-w-0 flex-1">
          <ModusWcTypography
            hierarchy="p"
            size="sm"
            weight="semibold"
            label={title}
          />
          <ModusWcTypography className="text-[var(--modus-wc-color-base-content-low-contrast)]" hierarchy="p" size="xs" label={meta} />
        </div>
        <AiUxUsedByAiBadge />
      </div>
      <div className="flex shrink-0 items-center gap-0 self-start">
        <ModusWcButton variant="borderless" color="tertiary" size="sm">
          <ModusWcIcon
            name="more_vertical"
            size="sm"
            decorative={false}
            aria-label={`More options for ${title}`}
          />
        </ModusWcButton>
        <ModusWcButton
          variant="borderless"
          color="tertiary"
          size="sm"
          aria-label={`Remove ${title}`}
        >
          <ModusWcIcon name="close" size="sm" decorative />
        </ModusWcButton>
      </div>
    </div>
  );
}

export function AiUxReferencesPreview() {
  return (
    <AiUxSpecCard>
      <div className="flex max-h-[min(26rem,55vh)] min-h-0 flex-col gap-2">
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[var(--modus-wc-color-base-200)] pb-2">
          <div className="flex items-center gap-2">
            <ModusWcIcon
              name="ai_stars"
              size="sm"
              decorative
              customClass="modus-ai-mark-gradient-icon"
            />
            <ModusWcTypography
              hierarchy="p"
              size="md"
              weight="semibold"
              label="References"
            />
          </div>
          <ModusWcButton variant="borderless" color="tertiary" size="sm">
            <ModusWcIcon name="close" size="sm" decorative />
          </ModusWcButton>
        </div>
        <div
          className="flex min-h-0 flex-col gap-2 overflow-y-auto pr-0.5"
          role="list"
          aria-label="Reference sources"
        >
          {AI_UX_REFERENCE_LIST_ROWS.map((row, index) => (
            <div key={`${row.title}-${index}`} role="listitem">
              <AiUxReferenceListRow
                title={row.title}
                meta={row.meta}
                icon={row.icon}
              />
            </div>
          ))}
        </div>
      </div>
    </AiUxSpecCard>
  );
}

export function AiUxSourcesPreview() {
  return (
    <AiUxSpecCard>
      <AiUxSourcesPatternRow
        title="Uploaded content"
        meta="File · 7.61 KB · 102 extracted lines"
        icon="file_text"
        onRemove={() => {}}
      />
    </AiUxSpecCard>
  );
}

export function AiUxDisclaimerPreview() {
  return (
    <AiUxSpecCard>
      <div className="flex flex-wrap items-center gap-1 text-[var(--modus-wc-color-base-content)]">
        <ModusWcTypography
          hierarchy="p"
          size="sm"
          label="AI can make mistakes."
        />
        <ModusWcButton variant="borderless" color="tertiary" size="xs">
          Acceptable use
        </ModusWcButton>
        <ModusWcIcon name="info" size="xs" decorative />
      </div>
    </AiUxSpecCard>
  );
}

export function AiUxDisclosurePreview() {
  return (
    <AiUxSpecCard>
      <AiUxGradientFrame className="ai-ux-gradient-frame--disclosure inline-block max-w-full">
        <ModusWcChip
          label="Summarized by Trimble Intelligence"
          size="sm"
          variant="outline"
          customClass="m-0.5 border-0 bg-[var(--modus-wc-color-base-100)]"
        >
          <ModusWcIcon
            name="ai_stars"
            size="xs"
            decorative
          />
        </ModusWcChip>
      </AiUxGradientFrame>
    </AiUxSpecCard>
  );
}

export function AiUxInitialCtaPreview() {
  const [prompt, setPrompt] = useState("");
  return (
    <AiUxSpecCard>
      <div className="flex w-full max-w-xl flex-col items-center gap-4">
        <ModusWcLogo
          name="trimble"
          emblem={false}
          alt="Trimble"
          customClass="max-h-9 w-auto max-w-[min(100%,13rem)] shrink-0"
        />
        <div className="w-full">
          <AiUxPromptComposerSurface hero value={prompt} onChange={setPrompt} />
        </div>
      </div>
    </AiUxSpecCard>
  );
}

export type RenderAiUxPatternPreviewOptions = {
  /** Smaller shell for AI Patterns list cards (floating agent only). */
  compact?: boolean;
  /** Inline Action list cards use `pointer-events-none` — show a static toolbar snapshot. */
  inlineActionStaticToolbar?: boolean;
  /** Floating Prompt list cards: hide “Preview mode” / Breakdown·Interactive (not part of the pattern). */
  listCard?: boolean;
};

export function renderAiUxPatternPreview(
  patternId: string,
  options?: RenderAiUxPatternPreviewOptions,
): React.ReactNode | null {
  switch (patternId) {
    case "ai-ux-follow-up":
      return <AiUxFollowUpPreview />;
    case "ai-ux-suggestion":
      return <AiUxSuggestionPreview />;
    case "ai-ux-nudge":
      return <AiUxNudgePreview />;
    case "ai-ux-prompt":
      return <AiUxPromptPreview />;
    case "ai-ux-inline-action":
      return (
        <AiUxInlineActionPreview
          staticToolbar={options?.inlineActionStaticToolbar}
        />
      );
    case "ai-ux-autofill":
      return <AiUxAutofillPreview />;
    case "ai-ux-summary":
      return <AiUxSummaryPreview />;
    case "ai-ux-parameters":
      return <AiUxParametersPreview />;
    case "ai-ux-references":
      return <AiUxReferencesPreview />;
    case "ai-ux-sources":
      return <AiUxSourcesPreview />;
    case "ai-ux-disclaimer":
      return <AiUxDisclaimerPreview />;
    case "ai-ux-disclosure":
      return <AiUxDisclosurePreview />;
    case "ai-ux-initial-cta":
      return <AiUxInitialCtaPreview />;
    case "ai-ux-floating-agent-chat":
    case "ai-ux-floating-prompt":
      return null;
    default:
      return null;
  }
}
