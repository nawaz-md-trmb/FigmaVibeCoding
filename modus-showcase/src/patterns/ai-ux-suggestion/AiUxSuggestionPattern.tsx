// @ts-nocheck
import { ModusWcButton, ModusWcIcon, ModusWcTypography } from '@trimble-oss/moduswebcomponents-react';

const STARTER_PROMPTS = [
  'How do I use button inside a card?',
  'Show me how to use the accordion component in React',
  'What props does modus-wc-navbar expose for visibility?',
  'How do I wire inputChange on modus-wc-text-input in React?',
  'Where should I import modus-wc-styles.css in a Vite app?',
] as const;

export function AiUxSuggestionPattern() {
  return (
    <div className="overflow-visible rounded-lg border border-[var(--modus-wc-color-base-200)] bg-[var(--modus-wc-color-base-page)] p-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0" aria-hidden>
            <ModusWcIcon name="ai_stars" size="sm" decorative customClass="text-[var(--modus-wc-color-base-100)]" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <ModusWcTypography
              hierarchy="p"
              size="lg"
              weight="semibold"
              label="Modus Agent"
              customClass="m-0 text-[var(--modus-wc-color-base-content)]"
            />
            <ModusWcTypography
              hierarchy="p"
              size="sm"
              customClass="m-0 text-[var(--modus-wc-color-base-content-low-contrast)]"
              label="AI assistant for Modus Web Components"
            />
          </div>
        </div>
        <ul className="m-0 flex list-none flex-col gap-2 p-0" aria-label="Starter prompts">
          {STARTER_PROMPTS.map((text) => (
            <li key={text} className="min-w-0">
              <ModusWcButton
                variant="filled"
                color="tertiary"
                size="sm"
                customClass="w-full !h-auto min-h-0 justify-start whitespace-normal text-left"
                aria-label={`Start with: ${text}`}
              >
                <span className="block w-full text-left text-sm font-normal leading-snug">{text}</span>
              </ModusWcButton>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AiUxSuggestionPattern;
