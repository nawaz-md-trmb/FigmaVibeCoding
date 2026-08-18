// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import {
  ModusWcButton,
  ModusWcIcon,
  ModusWcTypography,
  ModusWcUtilityPanel,
} from "@trimble-oss/moduswebcomponents-react";
import { InteractiveAgenticBasicChat } from "./InteractiveAgenticBasicChat";

export function AgenticChatDrawerPattern() {
  const [open, setOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLElement & { targetElement?: HTMLElement | null } | null>(null);

  useEffect(() => {
    const host = panelRef.current;
    const main = mainRef.current;
    if (host && main) host.targetElement = main;
  }, []);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        <main ref={mainRef} id="main-content" className="flex min-h-0 flex-1 flex-col overflow-auto p-6">
          <ModusWcButton size="sm" variant="outlined" color="tertiary" onButtonClick={() => setOpen(true)}>
            <ModusWcIcon name="chat" size="xs" decorative />
            Assistant
          </ModusWcButton>
          {/* page content */}
        </main>

        <ModusWcUtilityPanel
          ref={panelRef}
          expanded={open}
          pushContent
          onPanelClosed={() => setOpen(false)}
          className={
            "agentic-chat-drawer-panel absolute inset-y-0 right-0 z-10 h-full max-h-full " +
            (open ? "pointer-events-auto" : "agentic-chat-drawer-panel--collapsed")
          }
        >
          <div slot="header" className="flex w-full min-w-0 items-center justify-between gap-2 px-4">
            <ModusWcTypography hierarchy="p" size="md" weight="semibold" label="Assistant" customClass="!m-0" />
            <ModusWcButton
              variant="borderless"
              color="tertiary"
              shape="square"
              size="sm"
              aria-label="Close assistant"
              onButtonClick={() => setOpen(false)}
            >
              <ModusWcIcon name="close" size="sm" decorative />
            </ModusWcButton>
          </div>
          <div
            slot="body"
            className="agentic-chat-drawer-body-slot box-border flex h-full min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden p-0"
          >
            <InteractiveAgenticBasicChat embedded embeddedDensity="compact" />
          </div>
        </ModusWcUtilityPanel>
      </div>
    </div>
  );
}

export default AgenticChatDrawerPattern;
