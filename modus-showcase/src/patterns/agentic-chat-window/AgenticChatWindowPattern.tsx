// @ts-nocheck
import "./agentic-chat-window-rail.css";
import "./agentic-basic-chat.css";
import "./agentic-chat-window-floating.css";
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAgenticChatWindowDrag } from "./useAgenticChatWindowDrag";
import {
  ModusWcButton,
  ModusWcDivider,
  ModusWcIcon,
  ModusWcLogo,
  ModusWcMenu,
  ModusWcMenuItem,
  ModusWcTypography,
} from "@trimble-oss/moduswebcomponents-react";
import { InteractiveAgenticBasicChat } from "./InteractiveAgenticBasicChat";

const _ICON_MAP = {
  Menu:'menu',Plus:'add',Search:'search',Settings:'settings',
  Grid:'view_grid',Pin:'pin',Minimize2:'window_minimize',Maximize2:'window_resize',
};
type IconAlias = keyof typeof _ICON_MAP;
function getModusIconName(name: IconAlias | string): string {
  return (_ICON_MAP as Record<string, string>)[name] ?? String(name);
}

type Agent = { id: string; label: string; logo: 'modus' | 'sketchup' | 'trimble' | 'tekla' };

type HistoryGroup = {
  label: string;
  items: { label: string; value: string; selected?: boolean; pinned?: boolean }[];
};

const HISTORY_GROUPS: HistoryGroup[] = [
  {
    label: "Today",
    items: [
      { label: "What is AI?", value: "t1", selected: true, pinned: true },
      { label: "Recreate this image into a…", value: "t2" },
    ],
  },
  {
    label: "Yesterday",
    items: [{ label: "Draft a plan for my upcom…", value: "y1" }],
  },
  {
    label: "This week",
    items: [{ label: "Trimble + New Gen Techn…", value: "w1" }],
  },
];

function useNarrowAgenticShellBreakpoint() {
  const [narrow, setNarrow] = useState(
    () =>
      typeof window !== "undefined"
        ? window.matchMedia("(max-width: 767px)").matches
        : false,
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return narrow;
}

function useMediumAgenticShellTabletBreakpoint() {
  const [mediumTablet, setMediumTablet] = useState(
    () =>
      typeof window !== "undefined"
        ? window.matchMedia("(min-width: 768px) and (max-width: 1023px)")
            .matches
        : false,
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px) and (max-width: 1023px)");
    const update = () => setMediumTablet(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return mediumTablet;
}

/** Matches blueprint lg breakpoint (1024px): persistent rail defaults collapsed when viewport or shell host width is at most 1023px. */
const AGENTIC_SHELL_RAIL_COMPACT_MAX_WIDTH_PX = 1023;

function useAgenticShellHostObservedWidth() {
  const [shellHostEl, setShellHostEl] = useState<HTMLDivElement | null>(null);
  const [shellHostWidth, setShellHostWidth] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (!shellHostEl) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      setShellHostWidth(
        w != null && !Number.isNaN(w) ? Math.round(w) : null,
      );
    });
    ro.observe(shellHostEl);
    setShellHostWidth(Math.round(shellHostEl.getBoundingClientRect().width));
    return () => ro.disconnect();
  }, [shellHostEl]);

  return [setShellHostEl, shellHostWidth] as const;
}

export type AgenticChatWindowShellProps = {
  /** When true, the shell fills its parent (floating panel) without inset padding. */
  floatingPanel?: boolean;
  workspaceMaximized?: boolean;
  onWorkspaceMaximizedChange?: (maximized: boolean) => void;
  onRequestClose?: () => void;
  onDragHandlePointerDown?: (
    e: React.PointerEvent<HTMLElement> | PointerEvent,
  ) => void;
  dragHandleActive?: boolean;
};

export function AgenticChatWindowShell({
  floatingPanel = false,
  workspaceMaximized: workspaceMaximizedProp,
  onWorkspaceMaximizedChange,
  onRequestClose,
  onDragHandlePointerDown,
  dragHandleActive = false,
}: AgenticChatWindowShellProps = {}) {
  const narrowLayout = useNarrowAgenticShellBreakpoint();
  const mediumTabletLayout = useMediumAgenticShellTabletBreakpoint();
  const [setShellHostEl, shellHostWidth] = useAgenticShellHostObservedWidth();
  const [railExpanded, setRailExpanded] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.innerWidth > AGENTIC_SHELL_RAIL_COMPACT_MAX_WIDTH_PX;
  });
  const lastSyncedRailCompactRef = useRef<boolean | null>(null);
  const [railMobileOpen, setRailMobileOpen] = useState(false);
  const [workspaceMaximizedInternal, setWorkspaceMaximizedInternal] =
    useState(false);
  const workspaceMaximized =
    workspaceMaximizedProp ?? workspaceMaximizedInternal;
  const toggleWorkspaceMaximized = () => {
    const next = !workspaceMaximized;
    if (onWorkspaceMaximizedChange) onWorkspaceMaximizedChange(next);
    else setWorkspaceMaximizedInternal(next);
  };
  const [agentId, setAgentId] = useState("modus");
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header || !dragHandleActive || !onDragHandlePointerDown) return;
    const onNativePointerDown = (e: PointerEvent) => {
      onDragHandlePointerDown(e);
    };
    header.addEventListener("pointerdown", onNativePointerDown);
    return () => header.removeEventListener("pointerdown", onNativePointerDown);
  }, [dragHandleActive, onDragHandlePointerDown]);

  useEffect(() => {
    if (!narrowLayout) {
      setRailMobileOpen(false);
    }
  }, [narrowLayout]);

  useEffect(() => {
    const compactFromHost =
      shellHostWidth != null &&
      shellHostWidth <= AGENTIC_SHELL_RAIL_COMPACT_MAX_WIDTH_PX;
    const compactFromViewportFallback =
      shellHostWidth == null && mediumTabletLayout;
    const compact = compactFromHost || compactFromViewportFallback;

    if (narrowLayout) {
      lastSyncedRailCompactRef.current = null;
      return;
    }

    if (lastSyncedRailCompactRef.current === compact) return;

    lastSyncedRailCompactRef.current = compact;
    setRailExpanded(!compact);
  }, [narrowLayout, mediumTabletLayout, shellHostWidth]);

  useEffect(() => {
    if (!narrowLayout || !railMobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setRailMobileOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [narrowLayout, railMobileOpen]);

  const agents: Agent[] = useMemo(
    () => [
      { id: "modus", label: "Modus Agent", logo: "modus" },
      { id: "sketchup", label: "SketchUp Agent", logo: "sketchup" },
      { id: "connect", label: "Connect Agent", logo: "trimble" },
      { id: "projectsight", label: "ProjectSight Agent", logo: "tekla" },
    ],
    [],
  );

  const railVisualExpanded = narrowLayout || railExpanded;

  const renderAgenticRail = () => (
      <aside
        className={`agentic-chat-rail flex flex-col bg-[var(--modus-wc-color-base-page)] ${
          narrowLayout
            ? `agentic-chat-rail--expanded agentic-chat-rail--mobile-overlay ${
                railMobileOpen
                  ? "agentic-chat-rail--overlay-open"
                  : "agentic-chat-rail--overlay-closed"
              }`
            : `relative shrink-0 ${
                railExpanded
                  ? "agentic-chat-rail--expanded"
                  : "agentic-chat-rail--collapsed"
              }`
        }`}
        aria-label="Agents and conversations"
        inert={narrowLayout && !railMobileOpen ? true : undefined}
      >
        {!narrowLayout ? (
          <>
            <div className="agentic-chat-rail__header">
              <ModusWcButton
                variant="borderless"
                color="tertiary"
                shape="square"
                size="sm"
                aria-expanded={railExpanded}
                aria-controls="agentic-chat-rail-scroll"
                aria-label={
                  railExpanded ? "Collapse agents rail" : "Expand agents rail"
                }
                onButtonClick={() => setRailExpanded((v) => !v)}
              >
                <ModusWcIcon name={getModusIconName("Menu")} size="sm" decorative />
              </ModusWcButton>
              <ModusWcButton
                variant="borderless"
                color="tertiary"
                size="sm"
                shape={railExpanded ? undefined : "square"}
                customClass={`agentic-chat-rail__new-chat w-full ${railExpanded ? "!justify-start gap-2" : ""}`}
                aria-label={railExpanded ? undefined : "New chat"}
              >
                <ModusWcIcon
                  name={getModusIconName("Plus")}
                  size={railExpanded ? "xs" : "sm"}
                  decorative
                />
                <span className="agentic-chat-rail__btn-label-expanded">New Chat</span>
              </ModusWcButton>
            </div>

            <div className="agentic-chat-rail__divider">
              <ModusWcDivider />
            </div>
          </>
        ) : null}

        <div
          id="agentic-chat-rail-scroll"
          className="agentic-chat-rail__scroll min-h-0 flex-1 overflow-y-auto"
        >
          <div className="agentic-chat-rail__section-stack">
            <div>
              <ModusWcTypography hierarchy="p" label="Agents" customClass="agentic-chat-rail__section-heading" />
              <ModusWcMenu>
                {agents.map((a) => (
                  <ModusWcMenuItem
                    key={a.id}
                    label={a.label}
                    value={a.id}
                    selected={agentId === a.id}
                    onItemSelect={() => {
                      setAgentId(a.id);
                      if (narrowLayout) setRailMobileOpen(false);
                    }}
                  >
                    <span slot="start-icon" className="agentic-chat-rail__agent-emblem">
                      <ModusWcLogo name={a.logo} emblem alt="" customClass="shrink-0" />
                    </span>
                  </ModusWcMenuItem>
                ))}
                <ModusWcMenuItem label="Explore Agents" value="explore">
                  <ModusWcIcon slot="start-icon" name={getModusIconName("Grid")} size="md" decorative />
                </ModusWcMenuItem>
              </ModusWcMenu>
            </div>

            <div hidden={!railVisualExpanded}>
              <div className="agentic-chat-rail__divider">
                <ModusWcDivider />
              </div>

              <div>
                <div className="agentic-chat-rail__conversations-heading-row">
                  <ModusWcTypography hierarchy="p" label="Conversations" customClass="agentic-chat-rail__section-heading flex-1 min-w-0 !pb-0" />
                  <ModusWcButton variant="borderless" color="tertiary" shape="square" size="sm" aria-label="Search conversations">
                    <ModusWcIcon name={getModusIconName("Search")} size="sm" decorative />
                  </ModusWcButton>
                </div>

                {HISTORY_GROUPS.map((group) => (
                  <section key={group.label} className="agentic-chat-rail__history-section" aria-labelledby={`hist-${group.label}`}>
                    <ModusWcTypography
                      id={`hist-${group.label}`}
                      hierarchy="p"
                      label={group.label}
                      customClass="agentic-chat-rail__group-heading"
                    />
                    <ModusWcMenu>
                      {group.items.map((item) => (
                        <ModusWcMenuItem key={item.value} label={item.label} value={item.value} selected={Boolean(item.selected)}>
                          {item.pinned ? (
                            <ModusWcIcon slot="end-icon" name={getModusIconName("Pin")} size="sm" decorative />
                          ) : null}
                        </ModusWcMenuItem>
                      ))}
                    </ModusWcMenu>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="agentic-chat-rail__footer">
          <ModusWcButton
            variant="borderless"
            color="tertiary"
            size="sm"
            shape={narrowLayout || railExpanded ? undefined : "square"}
            customClass={`agentic-chat-rail__settings-btn w-full ${narrowLayout || railExpanded ? "!justify-start gap-2" : ""}`}
            aria-label={narrowLayout || railExpanded ? undefined : "Settings"}
          >
            <ModusWcIcon name={getModusIconName("Settings")} size="sm" decorative />
            <span className="agentic-chat-rail__btn-label-expanded">Settings</span>
          </ModusWcButton>
        </div>
      </aside>
  );

  const workspaceBody = (
    <>
      <div
        ref={setShellHostEl}
        className={
          floatingPanel
            ? "relative z-0 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[var(--modus-wc-color-base-page)]"
            : workspaceMaximized
              ? "flex min-h-0 min-w-0 flex-1 flex-row overflow-hidden border border-[var(--modus-wc-color-base-200)] bg-[var(--modus-wc-color-base-page)] shadow-none"
              : "relative z-0 mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col rounded-xl border border-[var(--modus-wc-color-base-200)] bg-[var(--modus-wc-color-base-page)] shadow-[var(--app-elevation-floating)]"
        }
        role="application"
        aria-label="Agentic chat workspace"
      >
      <div
        className={`agentic-chat-window-workspace-body relative flex min-h-0 min-w-0 flex-1 flex-row overflow-hidden${
          workspaceMaximized || floatingPanel ? "" : " rounded-xl"
        }`}
      >
      {!narrowLayout ? renderAgenticRail() : null}

      <div className="relative z-0 flex min-h-0 min-w-0 flex-1 flex-col bg-[var(--modus-wc-color-base-page)]">
        <header
          ref={headerRef}
          className={[
            "flex shrink-0 items-center gap-3 border-b border-[var(--modus-wc-color-base-200)] px-4 py-3",
            dragHandleActive && onDragHandlePointerDown
              ? "agentic-chat-window-drag-handle"
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-label={narrowLayout ? "Trimble AI conversation" : "Conversation"}
        >
          {narrowLayout ? (
            <ModusWcButton
              variant="borderless"
              color="tertiary"
              shape="square"
              size="sm"
              aria-expanded={railMobileOpen}
              aria-controls="agentic-chat-rail-scroll"
              aria-label={
                railMobileOpen ? "Close agents and conversations" : "Open agents and conversations"
              }
              onButtonClick={() => setRailMobileOpen((open) => !open)}
            >
              <ModusWcIcon name={getModusIconName("Menu")} size="sm" decorative />
            </ModusWcButton>
          ) : null}
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <ModusWcLogo name="trimble" emblem alt="" customClass="h-8 w-8 shrink-0" />
            <ModusWcTypography
              hierarchy="p"
              size="md"
              weight="semibold"
              customClass={
                narrowLayout
                  ? "hidden"
                  : "min-w-0 shrink truncate !m-0 text-[var(--modus-wc-color-base-content)]"
              }
              label="Trimble AI"
            />
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {narrowLayout ? (
              <ModusWcButton variant="borderless" color="tertiary" shape="square" size="sm" aria-label="New chat">
                <ModusWcIcon name={getModusIconName("Plus")} size="xs" decorative />
              </ModusWcButton>
            ) : null}
            <ModusWcButton
              variant="borderless"
              color="tertiary"
              shape="square"
              size="sm"
              aria-pressed={workspaceMaximized}
              aria-label={
                workspaceMaximized
                  ? "Restore floating window"
                  : "Expand to full screen"
              }
              onButtonClick={toggleWorkspaceMaximized}
            >
            <ModusWcIcon
              name={getModusIconName(workspaceMaximized ? "Minimize2" : "Maximize2")}
              size="sm"
              decorative
            />
            </ModusWcButton>
            <ModusWcButton
              variant="borderless"
              color="tertiary"
              shape="square"
              size="sm"
              aria-label="Close"
              onButtonClick={() => onRequestClose?.()}
            >
              <ModusWcIcon name="close" size="sm" decorative />
            </ModusWcButton>
          </div>
        </header>

        {narrowLayout ? (
        <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          {railMobileOpen ? (
            <button
              type="button"
              className="absolute inset-0 z-[90] cursor-default border-0 bg-[color-mix(in_srgb,var(--modus-wc-color-base-content)_32%,transparent)] p-0"
              aria-label="Dismiss agents and conversations panel"
              onClick={() => setRailMobileOpen(false)}
            />
          ) : null}
          {renderAgenticRail()}
          <div className="agentic-chat-window-workspace-chat flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            <InteractiveAgenticBasicChat embedded />
          </div>
        </div>
        ) : (
          <div className="agentic-chat-window-workspace-chat flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            <InteractiveAgenticBasicChat embedded />
          </div>
        )}
      </div>
      </div>
      </div>
    </>
  );

  if (floatingPanel) {
    return (
      <div className="agentic-chat-window-floating-shell flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {workspaceBody}
      </div>
    );
  }

  return (
    <div
      className={
        workspaceMaximized
          ? "flex h-full min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden"
          : "box-border flex h-[min(720px,85vh)] min-h-[420px] w-full min-w-0 flex-col p-5 sm:p-8"
      }
    >
      {workspaceBody}
    </div>
  );
}

export type AgenticChatWindowFloatingPatternProps = {
  /** `host` keeps the window inside a preview column; `viewport` uses fixed positioning for real apps. */
  positioning?: "host" | "viewport";
  defaultOpen?: boolean;
};

export function AgenticChatWindowFloatingPattern({
  positioning = "host",
  defaultOpen = true,
}: AgenticChatWindowFloatingPatternProps = {}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [workspaceMaximized, setWorkspaceMaximized] = useState(false);

  const dragDisabled = !isOpen || workspaceMaximized;
  const { panelStyle, isDragging, onDragHandlePointerDown } =
    useAgenticChatWindowDrag({
      boundaryRef: hostRef,
      panelRef,
      disabled: dragDisabled,
      isOpen,
      persistPosition: positioning === "viewport",
    });

  const hostClassName = [
    "agentic-chat-window-floating-host",
    positioning === "viewport"
      ? "agentic-chat-window-floating-host--viewport-fixed"
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  const panelClassName = [
    "agentic-chat-window-floating-panel",
    workspaceMaximized ? "agentic-chat-window-floating-panel--maximized" : "",
    isDragging ? "agentic-chat-window-floating-panel--dragging" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={hostRef} className={hostClassName}>
      <div
        ref={panelRef}
        className={panelClassName}
        style={!isOpen || workspaceMaximized ? undefined : panelStyle}
        role="dialog"
        aria-label="Trimble AI"
        aria-modal={false}
        hidden={!isOpen}
        aria-hidden={!isOpen}
        inert={!isOpen ? true : undefined}
      >
        <AgenticChatWindowShell
          floatingPanel
          workspaceMaximized={workspaceMaximized}
          onWorkspaceMaximizedChange={setWorkspaceMaximized}
          onRequestClose={() => {
            setIsOpen(false);
            setWorkspaceMaximized(false);
          }}
          dragHandleActive={isOpen && !workspaceMaximized}
          onDragHandlePointerDown={onDragHandlePointerDown}
        />
      </div>

      {!isOpen ? (
        <div className="agentic-chat-window-fab">
          <ModusWcButton
            color="tertiary"
            variant="filled"
            shape="circle"
            size="lg"
            customClass="agentic-chat-window-fab-rainbow"
            onButtonClick={() => setIsOpen(true)}
            aria-label="Open Trimble AI"
          >
            <ModusWcIcon name="ai_stars" decorative size="md" />
          </ModusWcButton>
        </div>
      ) : null}
    </div>
  );
}

export default AgenticChatWindowFloatingPattern;
