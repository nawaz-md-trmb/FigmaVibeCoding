// @ts-nocheck
import './editable-table.css';
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { ITableColumn } from "@trimble-oss/moduswebcomponents";
import {
  ModusWcAlert,
  ModusWcTable,
  ModusWcToast,
} from "@trimble-oss/moduswebcomponents-react";

// --- Inlined ModusToast ---

interface ModusToastProps {
  title: string;
  description?: string;
  variant?: "error" | "info" | "success" | "warning";
  icon?: string;
  dismissible?: boolean;
  duration?: number;
  onDismiss?: () => void;
  onClick?: () => void;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

function ModusToast({
  title,
  variant = "info",
  icon,
  dismissible = true,
  duration = 16000,
  onDismiss,
  onClick,
  position = "top-right",
}: ModusToastProps) {
  const modusPositionMap: Record<
    string,
    "top-start" | "top-center" | "top-end" | "bottom-start" | "bottom-center" | "bottom-end"
  > = {
    "top-right": "top-end",
    "top-left": "top-start",
    "bottom-right": "bottom-end",
    "bottom-left": "bottom-start",
  };

  const modusPosition = modusPositionMap[position] || "top-end";

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        if (onDismiss) onDismiss();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onDismiss]);

  const handleDismiss = (e: CustomEvent) => {
    if (e) e.stopPropagation();
    if (onDismiss) onDismiss();
  };

  const handleAlertClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest("modus-wc-button") ||
      target.closest('[slot="button"]') ||
      target.closest("button")
    ) {
      return;
    }
    if (onClick) onClick();
  };

  return (
    <div className={`modus-toast-outer-container toast-${position}`}>
      <ModusWcToast position={modusPosition} customClass="modus-toast-container">
        <div
          onClick={handleAlertClick}
          className={`modus-toast-wrapper ${onClick ? "clickable" : ""}`}
        >
          <ModusWcAlert
            alertTitle={title}
            variant={variant}
            icon={icon || "info_outlined"}
            dismissible={dismissible}
            onDismissClick={(e: CustomEvent) => {
              e.stopPropagation();
              handleDismiss(e);
            }}
            customClass="shadow-lg bg-transparent modus-toast-blur"
          />
        </div>
      </ModusWcToast>
    </div>
  );
}

// --- Pattern ---

type ModusTableHost = HTMLElement & {
  columns?: ITableColumn[];
  data?: Record<string, unknown>[];
  selectable?: "none" | "single" | "multi";
  enterEdit?: (rowIndex: number, columnId: string) => void;
  table?: {
    getRowModel: () => { rows: Array<{ original: Record<string, unknown> }> };
  };
};

type BorderableControl = HTMLElement & { bordered?: boolean };

const ROLE_SELECT_OPTIONS = [
  { label: "Editor", value: "Editor" },
  { label: "Viewer", value: "Viewer" },
  { label: "Admin", value: "Admin" },
];

function editableHeaderEditPseudoRules(cols: ITableColumn[], offset: number): string {
  const selectors: string[] = [];
  cols.forEach((column, i) => {
    if (column?.editor) {
      selectors.push(
        `table.modus-wc-table thead tr th:nth-child(${i + 1 + offset})::before`,
      );
    }
  });
  if (selectors.length === 0) {
    return "";
  }
  return (
    `${selectors.join(",")}{` +
    `content:'pencil';` +
    `font-family:'modus-icons','modus-icons-outlined',sans-serif;` +
    `font-style:normal;font-weight:normal;font-size:1rem;line-height:1;` +
    `font-feature-settings:'liga' 1,'calt' 1;` +
    `color:var(--modus-wc-color-primary);` +
    `margin-inline-end:var(--modus-wc-spacing-xs);` +
    `display:inline-block;vertical-align:middle;` +
    `-webkit-font-smoothing:antialiased;` +
    `}`
  );
}

function columnTrackSizing(width: string): string {
  const w = width.trim();
  if (w.endsWith("%")) {
    return `width:${w};min-width:0;max-width:${w};`;
  }
  return `width:${w};min-width:${w};max-width:${w};`;
}

function installEditableTableColumnSizingStyles(tableHost: HTMLElement) {
  const sr = tableHost.shadowRoot;
  if (!sr) {
    return;
  }
  let styleEl = sr.querySelector("style[data-editable-col-fit]");
  if (!(styleEl instanceof HTMLStyleElement)) {
    styleEl = document.createElement("style");
    styleEl.setAttribute("data-editable-col-fit", "true");
    sr.appendChild(styleEl);
  }
  const host = tableHost as ModusTableHost;
  const cols = host.columns || [];
  const selectable = host.selectable != null ? host.selectable : "none";
  const offset = selectable !== "none" ? 1 : 0;
  const widthRules: string[] = [];
  cols.forEach((column, i) => {
    if (!column?.width) {
      return;
    }
    const n = i + 1 + offset;
    widthRules.push(
      `table.modus-wc-table thead tr th:nth-child(${n}),table.modus-wc-table tbody tr td:nth-child(${n}){${columnTrackSizing(column.width)}}`,
    );
  });
  const headerEdit = editableHeaderEditPseudoRules(cols, offset);
  const css = [
    ".table-container,.modus-wc-overflow-x-auto{min-width:0;max-width:100%;width:100%;box-sizing:border-box;}",
    "table.modus-wc-table{table-layout:fixed;width:100%;max-width:100%;}",
    widthRules.join(""),
    "table.modus-wc-table thead th{overflow:visible;vertical-align:middle;min-width:0;}",
    "table.modus-wc-table tbody td{overflow:hidden;vertical-align:middle;min-width:0;}",
    "table.modus-wc-table tbody td[data-col='actions']{overflow:visible;}",
    headerEdit,
    "table.modus-wc-table tbody tr.modus-bp-row-edit-active>td{background-color:var(--modus-wc-color-primary-pale)!important;}",
    "table.modus-wc-table td.editing [data-modus-bp-cell-editor],",
    "table.modus-wc-table td[data-col='name'] [data-modus-bp-cell-editor],",
    "table.modus-wc-table td[data-col='notes'] [data-modus-bp-cell-editor],",
    "table.modus-wc-table td[data-col='role'] [data-modus-bp-cell-editor]{",
    "display:block;width:100%;max-width:100%;min-width:0;box-sizing:border-box;",
    "}",
    "table.modus-wc-table tbody tr.modus-bp-row-edit-active td[data-col='name'],",
    "table.modus-wc-table tbody tr.modus-bp-row-edit-active td[data-col='notes'],",
    "table.modus-wc-table tbody tr.modus-bp-row-edit-active td[data-col='role']{overflow:visible;}",
    "table.modus-wc-table td[data-col='name'] modus-wc-text-input,",
    "table.modus-wc-table td[data-col='notes'] modus-wc-text-input{",
    "--modus-wc-font-size-md:var(--modus-wc-font-size-sm);",
    "}",
  ].join("");
  styleEl.textContent = css;
}

function applyEditorBorderedFalse(control: BorderableControl | null) {
  if (!control) {
    return;
  }
  const tag = control.tagName?.toLowerCase() ?? "";
  const run = () => {
    try {
      control.bordered = false;
    } catch {
      /* pre-upgrade */
    }
  };
  run();
  requestAnimationFrame(run);
  requestAnimationFrame(() => {
    requestAnimationFrame(run);
  });
  if (tag) {
    void customElements.whenDefined(tag).then(run);
  }
}

function scheduleEditorInnerFocus(
  host: HTMLElement,
  pick: (shadow: ShadowRoot | null) => HTMLElement | null,
): void {
  const tag = host.tagName.toLowerCase();
  const tryOnce = (): boolean => {
    if (!document.contains(host)) {
      return false;
    }
    const inner = pick(host.shadowRoot ?? null);
    if (inner && typeof inner.focus === "function") {
      try {
        inner.focus({ preventScroll: true });
        if (inner instanceof HTMLInputElement || inner instanceof HTMLTextAreaElement) {
          inner.select?.();
        }
      } catch {
        inner.focus();
      }
      return true;
    }
    return false;
  };

  const delaysMs = [0, 16, 32, 48, 64, 100, 160, 240, 360, 500];
  for (const ms of delaysMs) {
    window.setTimeout(() => {
      tryOnce();
    }, ms);
  }
  void customElements.whenDefined(tag).then(() => {
    requestAnimationFrame(() => {
      tryOnce();
    });
  });
}

function focusActiveEditorControls(tableHost: HTMLElement): void {
  const sr = tableHost.shadowRoot;
  if (!sr) {
    return;
  }
  const textHost =
    sr.querySelector("td.editing modus-wc-text-input") ??
    sr.querySelector("td[data-col='name'] modus-wc-text-input");
  if (textHost instanceof HTMLElement) {
    scheduleEditorInnerFocus(textHost, (shadow) =>
      shadow?.querySelector<HTMLInputElement>("input.modus-wc-grow, input:not([type='hidden'])") ??
      null,
    );
  }
  const selectHost =
    sr.querySelector("td.editing modus-wc-select") ?? sr.querySelector("td[data-col='role'] modus-wc-select");
  if (selectHost instanceof HTMLElement) {
    scheduleEditorInnerFocus(selectHost, (shadow) =>
      shadow?.querySelector<HTMLElement>("input, button, [role='combobox']") ?? null,
    );
  }
}

function patchEditorsInTableShadow(tableHost: HTMLElement) {
  const sr = tableHost.shadowRoot;
  if (!sr) {
    return;
  }
  installEditableTableColumnSizingStyles(tableHost);
  sr.querySelectorAll<BorderableControl>(
    [
      "td.editing modus-wc-text-input",
      "td.editing modus-wc-select",
      "td[data-col='name'] modus-wc-text-input",
      "td[data-col='notes'] modus-wc-text-input",
      "td[data-col='role'] modus-wc-select",
    ].join(", "),
  ).forEach((node) => {
    applyEditorBorderedFalse(node);
  });
  focusActiveEditorControls(tableHost);
  requestAnimationFrame(() => {
    installEditableTableColumnSizingStyles(tableHost);
  });
}

type BlueprintRowDraft = { name: string; role: string; notes: string };
const blueprintRowDrafts: Record<string, BlueprintRowDraft> = {};

function ensureBlueprintRowDraft(row: Record<string, unknown>): BlueprintRowDraft {
  const rid = String(row.id ?? "");
  if (!blueprintRowDrafts[rid]) {
    blueprintRowDrafts[rid] = {
      name: String(row.name ?? ""),
      role: String(row.role ?? ""),
      notes: String(row.notes ?? ""),
    };
  }
  return blueprintRowDrafts[rid];
}

function renderTextCellDraftOrView(
  field: "name" | "notes",
  ariaLabel: string,
): (value: unknown, row: Record<string, unknown>) => HTMLElement {
  return (value, row) => {
    const active = Boolean((row as { _editActive?: boolean })._editActive);
    if (!active) {
      const s = document.createElement("span");
      s.textContent = String(value ?? "");
      return s;
    }
    const draft = ensureBlueprintRowDraft(row);
    const wrap = document.createElement("div");
    wrap.setAttribute("data-modus-bp-cell-editor", "");
    const input = document.createElement("modus-wc-text-input") as BorderableControl;
    input.value = draft[field];
    input.setAttribute("size", "md");
    input.size = "md";
    input.bordered = false;
    input.setAttribute("aria-label", ariaLabel);
    const onInputChange = (e: Event) => {
      const d = (e as CustomEvent<{ target?: { value?: string } }>).detail;
      const raw = d?.target?.value;
      draft[field] = raw != null ? String(raw) : String((input as { value?: string }).value ?? "");
    };
    input.addEventListener("inputChange", onInputChange as EventListener);
    wrap.appendChild(input);
    applyEditorBorderedFalse(input);
    scheduleEditorInnerFocus(input, (shadow) =>
      shadow?.querySelector<HTMLInputElement>("input.modus-wc-grow, input:not([type='hidden'])") ??
      null,
    );
    return wrap;
  };
}

function renderRoleCellDraftOrView(value: unknown, row: Record<string, unknown>): HTMLElement {
  const active = Boolean((row as { _editActive?: boolean })._editActive);
  if (!active) {
    const s = document.createElement("span");
    s.textContent = String(value ?? "");
    return s;
  }
  const draft = ensureBlueprintRowDraft(row);
  const container = document.createElement("div");
  container.setAttribute("data-modus-bp-cell-editor", "");
  const select = document.createElement("modus-wc-select") as BorderableControl & {
    options?: typeof ROLE_SELECT_OPTIONS;
    value?: string;
    size?: string;
  };
  select.options = ROLE_SELECT_OPTIONS;
  select.value = draft.role;
  select.setAttribute("size", "md");
  select.size = "md";
  select.bordered = false;
  select.setAttribute("aria-label", "Role");
  const handleInputChange = (e: CustomEvent) => {
    const raw = e.detail && (e.detail as { target?: { value?: string } }).target?.value;
    draft.role = raw != null ? String(raw) : String(select.value ?? "");
  };
  select.addEventListener("inputChange", handleInputChange as EventListener);
  container.appendChild(select);
  applyEditorBorderedFalse(select);
  scheduleEditorInnerFocus(select, (shadow) =>
    shadow?.querySelector<HTMLElement>("input, button, [role='combobox']") ?? null,
  );
  return container;
}

const ROW_EDIT_TOGGLE_EVENT = "modusBlueprintRowEdit";
const ROW_SAVE_EVENT = "modusBlueprintRowSave";

function syncRowEditHighlight(tableHost: HTMLElement, activeRowId: string | null) {
  const sr = tableHost.shadowRoot;
  if (!sr) {
    return;
  }
  sr.querySelectorAll("tbody tr").forEach((tr) => {
    const idCell = tr.querySelector('td[data-col="id"]');
    const rid = idCell?.textContent?.trim() ?? "";
    tr.classList.toggle("modus-bp-row-edit-active", Boolean(activeRowId && rid === activeRowId));
  });
}

function actionsCellRenderer(_value: unknown, row: Record<string, unknown>) {
  const wrap = document.createElement("div");
  wrap.style.display = "flex";
  wrap.style.alignItems = "center";
  wrap.style.gap = "var(--modus-wc-spacing-xs)";
  wrap.style.justifyContent = "flex-end";
  wrap.style.minWidth = "0";

  const moreBtn = document.createElement("modus-wc-button") as HTMLElement & {
    size?: string;
    variant?: string;
    color?: string;
    shape?: string;
  };
  moreBtn.size = "sm";
  moreBtn.variant = "borderless";
  moreBtn.color = "tertiary";
  moreBtn.shape = "square";
  moreBtn.setAttribute("aria-label", "More actions");
  moreBtn.type = "button";
  const moreIcon = document.createElement("modus-wc-icon");
  moreIcon.setAttribute("name", "more_vertical");
  moreIcon.name = "more_vertical";
  moreIcon.size = "xs";
  moreIcon.decorative = true;
  moreIcon.style.color = "var(--modus-wc-color-base-content-low-contrast)";
  moreBtn.appendChild(moreIcon);
  moreBtn.addEventListener("buttonClick", (e) => {
    e.stopPropagation();
  });

  const rowId = row.id != null ? String(row.id) : "";
  const inRowEdit = Boolean((row as { _editActive?: boolean })._editActive);

  if (inRowEdit) {
    const saveBtn = document.createElement("modus-wc-button") as HTMLElement & {
      size?: string;
      variant?: string;
      color?: string;
    };
    saveBtn.size = "sm";
    saveBtn.variant = "filled";
    saveBtn.color = "primary";
    saveBtn.type = "button";
    saveBtn.setAttribute("aria-label", "Save row");
    saveBtn.textContent = "Save";
    saveBtn.addEventListener("buttonClick", (e) => {
      e.stopPropagation();
      wrap.dispatchEvent(
        new CustomEvent(ROW_SAVE_EVENT, {
          bubbles: true,
          composed: true,
          detail: { rowId },
        }),
      );
    });
    const cancelBtn = document.createElement("modus-wc-button") as HTMLElement & {
      size?: string;
      variant?: string;
      color?: string;
    };
    cancelBtn.size = "sm";
    cancelBtn.variant = "borderless";
    cancelBtn.color = "tertiary";
    cancelBtn.type = "button";
    cancelBtn.setAttribute("aria-label", "Cancel row edit");
    cancelBtn.textContent = "Cancel";
    cancelBtn.addEventListener("buttonClick", (e) => {
      e.stopPropagation();
      wrap.dispatchEvent(
        new CustomEvent(ROW_EDIT_TOGGLE_EVENT, {
          bubbles: true,
          composed: true,
          detail: { rowId },
        }),
      );
    });
    wrap.appendChild(saveBtn);
    wrap.appendChild(cancelBtn);
    wrap.appendChild(moreBtn);
  } else {
    const editBtn = document.createElement("modus-wc-button") as HTMLElement & {
      size?: string;
      variant?: string;
      color?: string;
      shape?: string;
    };
    editBtn.size = "sm";
    editBtn.variant = "borderless";
    editBtn.color = "primary";
    editBtn.shape = "square";
    editBtn.setAttribute("aria-label", "Edit row");
    editBtn.type = "button";
    const editIcon = document.createElement("modus-wc-icon");
    editIcon.setAttribute("name", "pencil");
    editIcon.name = "pencil";
    editIcon.size = "xs";
    editIcon.decorative = true;
    editIcon.style.color = "var(--modus-wc-color-primary)";
    editBtn.appendChild(editIcon);
    editBtn.addEventListener("buttonClick", (e) => {
      e.stopPropagation();
      wrap.dispatchEvent(
        new CustomEvent(ROW_EDIT_TOGGLE_EVENT, {
          bubbles: true,
          composed: true,
          detail: { rowId },
        }),
      );
    });
    wrap.appendChild(editBtn);
    wrap.appendChild(moreBtn);
    void customElements.whenDefined("modus-wc-icon").then(() => {
      editIcon.setAttribute("name", "pencil");
      editIcon.name = "pencil";
    });
  }

  void customElements.whenDefined("modus-wc-icon").then(() => {
    moreIcon.setAttribute("name", "more_vertical");
    moreIcon.name = "more_vertical";
  });

  return wrap;
}

const EDITABLE_TABLE_COLUMNS: ITableColumn[] = [
  { id: "id", header: "ID", accessor: "id", width: "5rem" },
  {
    id: "name",
    header: "Name",
    accessor: "name",
    width: "20%",
    sortable: true,
    cellRenderer: renderTextCellDraftOrView("name", "Name"),
  },
  {
    id: "role",
    header: "Role",
    accessor: "role",
    width: "13rem",
    sortable: true,
    cellRenderer: renderRoleCellDraftOrView,
  },
  {
    id: "notes",
    header: "Notes",
    accessor: "notes",
    width: "28%",
    sortable: false,
    cellRenderer: renderTextCellDraftOrView("notes", "Notes"),
  },
  {
    id: "actions",
    header: "Actions",
    accessor: "id",
    width: "11rem",
    sortable: false,
    cellRenderer: actionsCellRenderer,
  },
];

/**
 * Live pattern preview for Editable Row Table — not run through react-live (which breaks CE refs
 * and stable `columns` identity).
 */
export function EditableTablePatternLive() {
  const tableRef = useRef<ModusTableHost | null>(null);
  const tableShellRef = useRef<HTMLDivElement | null>(null);
  const editingRowIdRef = useRef<string | null>(null);
  const [saveToastKey, setSaveToastKey] = useState(0);
  const [saveToastLabel, setSaveToastLabel] = useState("");

  const [tableRows, setTableRows] = useState([
    {
      id: "1",
      name: "Rivera, Ana",
      role: "Editor",
      notes: "Confirm access quarterly",
    },
    {
      id: "2",
      name: "Patel, Dev",
      role: "Viewer",
      notes: "Read-only project link",
    },
    {
      id: "3",
      name: "Nguyen, Linh",
      role: "Admin",
      notes: "Owner approves publishes",
    },
  ]);

  const rowsForTable = useMemo(
    () => tableRows.map((r) => ({ ...r })),
    [tableRows],
  );

  const editingRowId = useMemo(() => {
    for (const r of tableRows) {
      if ((r as { _editActive?: boolean })._editActive) {
        return String(r.id);
      }
    }
    return null;
  }, [tableRows]);

  useEffect(() => {
    editingRowIdRef.current = editingRowId;
  }, [editingRowId]);

  const listenersHostRef = useRef<ModusTableHost | null>(null);
  const lastPushedRowsRef = useRef<typeof rowsForTable | null>(null);

  useLayoutEffect(() => {
    const el = tableRef.current;
    if (!el) {
      return;
    }
    const rowsChanged = lastPushedRowsRef.current !== rowsForTable;
    if (rowsChanged) {
      lastPushedRowsRef.current = rowsForTable;
      el.columns = EDITABLE_TABLE_COLUMNS;
      el.data = rowsForTable;
    }
    requestAnimationFrame(() => {
      if (rowsChanged) {
        installEditableTableColumnSizingStyles(el);
      }
      syncRowEditHighlight(el, editingRowId);
      if (rowsChanged && editingRowId) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            patchEditorsInTableShadow(el);
          });
        });
      }
    });
  }, [rowsForTable, editingRowId]);

  useEffect(() => {
    const shell = tableShellRef.current;
    if (!shell) {
      return;
    }
    const onRowEditToggle = (ev: Event) => {
      const rowId = (ev as CustomEvent<{ rowId: string }>).detail?.rowId;
      if (!rowId) {
        return;
      }
      setTableRows((prev) => {
        const target = prev.find((r) => String(r.id) === rowId);
        if (!target) {
          return prev;
        }
        if ((target as { _editActive?: boolean })._editActive) {
          delete blueprintRowDrafts[rowId];
          return prev.map((r) => {
            if (String(r.id) !== rowId) {
              return r;
            }
            const { _editActive: _a, ...rest } = r as {
              id: string;
              name: string;
              role: string;
              notes: string;
              _editActive?: boolean;
            };
            return rest;
          });
        }
        prev.forEach((r) => {
          const id = String(r.id);
          if (id !== rowId && (r as { _editActive?: boolean })._editActive) {
            delete blueprintRowDrafts[id];
          }
        });
        blueprintRowDrafts[rowId] = {
          name: String(target.name),
          role: String(target.role),
          notes: String(target.notes),
        };
        return prev.map((r) => {
          const id = String(r.id);
          if (id === rowId) {
            return { ...r, _editActive: true };
          }
          if ((r as { _editActive?: boolean })._editActive) {
            const { _editActive: _a, ...rest } = r as {
              id: string;
              name: string;
              role: string;
              notes: string;
              _editActive?: boolean;
            };
            return rest;
          }
          return r;
        });
      });
    };

    const onRowSave = (ev: Event) => {
      const rowId = (ev as CustomEvent<{ rowId: string }>).detail?.rowId;
      if (!rowId) {
        return;
      }
      const d = blueprintRowDrafts[rowId];
      if (!d) {
        return;
      }
      setTableRows((prev) =>
        prev.map((r) => {
          if (String(r.id) !== rowId) {
            return r;
          }
          if (!(r as { _editActive?: boolean })._editActive) {
            return r;
          }
          return {
            id: String(r.id),
            name: d.name,
            role: d.role,
            notes: d.notes,
          };
        }),
      );
      delete blueprintRowDrafts[rowId];
      setSaveToastLabel(`Row ${rowId} saved`);
      setSaveToastKey((k) => k + 1);
    };

    shell.addEventListener(ROW_EDIT_TOGGLE_EVENT, onRowEditToggle);
    shell.addEventListener(ROW_SAVE_EVENT, onRowSave);
    return () => {
      shell.removeEventListener(ROW_EDIT_TOGGLE_EVENT, onRowEditToggle);
      shell.removeEventListener(ROW_SAVE_EVENT, onRowSave);
    };
  }, []);

  useEffect(() => {
    let rafOuter = 0;
    let rafRetry = 0;

    const onSortChange = () => {
      const host = tableRef.current;
      if (host) {
        requestAnimationFrame(() => {
          syncRowEditHighlight(host, editingRowIdRef.current);
        });
      }
    };

    const detachListeners = () => {
      const host = listenersHostRef.current;
      if (host) {
        host.removeEventListener("sortChange", onSortChange);
        listenersHostRef.current = null;
      }
    };

    const attach = () => {
      const host = tableRef.current;
      if (!host) {
        rafRetry = requestAnimationFrame(attach);
        return;
      }
      detachListeners();
      host.addEventListener("sortChange", onSortChange);
      listenersHostRef.current = host;
    };

    rafOuter = requestAnimationFrame(() => {
      requestAnimationFrame(attach);
    });

    return () => {
      cancelAnimationFrame(rafOuter);
      cancelAnimationFrame(rafRetry);
      detachListeners();
    };
  }, []);

  return (
    <div className="relative flex min-w-0 flex-col gap-3">
      {saveToastKey > 0 ? (
        <ModusToast
          key={saveToastKey}
          title={saveToastLabel || "Row saved"}
          variant="success"
          icon="check_simple"
          dismissible
          duration={6000}
          position="top-right"
          onDismiss={() => setSaveToastKey(0)}
        />
      ) : null}
      <div ref={tableShellRef} className="editable-table-bg min-w-0 overflow-x-auto">
        <ModusWcTable
          ref={tableRef}
          editable={false}
          zebra={false}
          hover={true}
          sortable={true}
          selectable="none"
          paginated={false}
          caption="Example roster with editable cells"
          customClass="w-full min-w-0 max-w-full !bg-[var(--modus-wc-color-base-page)]"
        />
      </div>
    </div>
  );
}

export default EditableTablePatternLive;
