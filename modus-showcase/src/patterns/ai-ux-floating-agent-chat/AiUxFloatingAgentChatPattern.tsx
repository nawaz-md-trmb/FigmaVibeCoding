// @ts-nocheck
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ModusWcButton,
  ModusWcIcon,
  ModusWcTypography,
} from '@trimble-oss/moduswebcomponents-react';
import { AiUxSpecCard } from './AiUxSpecCard';
import './AiUxGradientFrame.css';
import './ModusAssistant.css';
import './ModusAssistantPatternPreview.css';

const CHAT_UI_URL = 'https://agentic.trimble.com';

/**
 * Documentation-only clone of the Modus Assistant shell + FAB.
 * The chat UI loads in an iframe when the panel opens.
 */
export function AiUxFloatingAgentChatPattern({
  compact = false,
}: {
  compact?: boolean;
} = {}) {
  const [isOpen, setIsOpen] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const iframeSrcApplied = useRef(false);

  useEffect(() => {
    if (compact || !isOpen) return;
    const el = iframeRef.current;
    if (!el || iframeSrcApplied.current) return;
    el.src = CHAT_UI_URL;
    iframeSrcApplied.current = true;
  }, [isOpen, compact]);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const shell = (
    <div
      className={`modus-assistant-pattern-preview ${
        compact ? 'modus-assistant-pattern-preview--compact' : ''
      }`}
    >
      <div
        className={`modus-assistant-overlay ${isOpen ? 'modus-assistant-overlay--open' : ''}`}
        role="dialog"
        aria-label="Modus Assistant (pattern preview)"
        aria-modal={isOpen ? true : undefined}
        inert={!isOpen ? true : undefined}
      >
        <div className="modus-assistant-panel">
          <div className="modus-assistant-header">
            <div className="modus-assistant-header-title">
              <ModusWcIcon
                name="ai_stars"
                decorative
                size="sm"
                customClass="modus-ai-mark-gradient-icon"
              />
              <ModusWcTypography hierarchy="h4" size="sm">
                Modus Assistant
              </ModusWcTypography>
            </div>
            <ModusWcButton
              color="tertiary"
              variant="borderless"
              shape="circle"
              size="sm"
              onButtonClick={handleClose}
              aria-label="Close Modus Assistant"
            >
              <ModusWcIcon name="close" decorative size="sm" />
            </ModusWcButton>
          </div>
          <div className="modus-assistant-iframe-container">
            {compact ? (
              <div
                className="modus-assistant-pattern-preview-chat-placeholder flex flex-1 flex-col gap-2 p-3"
                aria-hidden
              >
                <div className="h-2 w-[85%] max-w-full rounded-sm bg-[var(--modus-wc-color-base-200)]" />
                <div className="h-2 w-[55%] max-w-full rounded-sm bg-[var(--modus-wc-color-base-200)]" />
                <div className="h-2 w-[70%] max-w-full rounded-sm bg-[var(--modus-wc-color-base-200)]" />
              </div>
            ) : (
              <iframe
                ref={iframeRef}
                title="Modus Assistant"
                allow="clipboard-write"
              />
            )}
          </div>
        </div>
      </div>

      <div className="modus-assistant-fab">
        <ModusWcButton
          color="tertiary"
          variant="filled"
          shape="circle"
          size={compact ? 'md' : 'lg'}
          customClass="modus-assistant-fab-rainbow"
          onButtonClick={handleToggle}
          aria-label={isOpen ? 'Close Modus Assistant' : 'Open Modus Assistant'}
          aria-expanded={isOpen}
        >
          <ModusWcIcon
            name={isOpen ? 'close' : 'ai_stars'}
            decorative
            size={compact ? 'sm' : 'md'}
          />
        </ModusWcButton>
      </div>
    </div>
  );

  if (compact) {
    return <div className="inline-flex max-w-full shrink-0">{shell}</div>;
  }

  return <AiUxSpecCard>{shell}</AiUxSpecCard>;
}

export default AiUxFloatingAgentChatPattern;
