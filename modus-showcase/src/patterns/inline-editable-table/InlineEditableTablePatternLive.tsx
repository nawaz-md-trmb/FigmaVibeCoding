// @ts-nocheck
import React, { useEffect, useMemo, useRef, useState } from "react";
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
  description,
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

  const positionClass = `toast-${position}`;

  return (
    <div className={`modus-toast-outer-container ${positionClass}`}>
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

type BorderableControl = HTMLElement & { bordered?: boolean };

const ROLE_SELECT_OPTIONS = [
  { label: "Admin", value: "Admin" },
  { label: "User", value: "User" },
  { label: "Manager", value: "Manager" },
  { label: "Editor", value: "Editor" },
  { label: "Viewer", value: "Viewer" },
];

const INITIAL_ROWS: Record<string, unknown>[] = [
  { id: "1", name: "Alice Johnson", email: "alice.johnson@example.com", role: "Admin" },
  { id: "2", name: "Bob Smith", email: "bob.smith@example.com", role: "User" },
  { id: "3", name: "Carol Williams", email: "carol.williams@example.com", role: "User" },
  { id: "4", name: "David Brown", email: "david.brown@example.com", role: "Manager" },
  { id: "5", name: "Emma Davis", email: "emma.davis@example.com", role: "User" },
];

const CELL_EDIT_START = "modusBlueprintInlineEditStart";
const CELL_DRAFT = "modusBlueprintInlineDraft";
const CELL_COMMIT = "modusBlueprintInlineEditCommit";

type EditableField = "name" | "email" | "role";

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

function renderIdCell(value: unknown): HTMLElement {
  const s = document.createElement("span");
  s.textContent = String(value ?? "");
  return s;
}

function scheduleTextInputFocus(host: HTMLElement): void {
  const tag = host.tagName.toLowerCase();
  const tryOnce = (): boolean => {
    if (!document.contains(host)) {
      return false;
    }
    const inner =
      host.shadowRoot?.querySelector<HTMLInputElement>("input.modus-wc-grow, input:not([type='hidden'])") ??
      null;
    if (inner && typeof inner.focus === "function") {
      try {
        inner.focus({ preventScroll: true });
        inner.select?.();
      } catch {
        inner.focus();
      }
      return true;
    }
    return false;
  };
  for (const ms of [0, 16, 32, 64, 120]) {
    window.setTimeout(tryOnce, ms);
  }
  void customElements.whenDefined(tag).then(() => {
    requestAnimationFrame(tryOnce);
  });
}

function scheduleSelectFocus(host: HTMLElement): void {
  const tag = host.tagName.toLowerCase();
  const tryOnce = (): boolean => {
    if (!document.contains(host)) {
      return false;
    }
    const inner =
      host.shadowRoot?.querySelector<HTMLElement>("input, button, [role='combobox']") ?? null;
    if (inner && typeof inner.focus === "function") {
      try {
        inner.focus({ preventScroll: true });
      } catch {
        inner.focus();
      }
      return true;
    }
    return false;
  };
  for (const ms of [0, 16, 32, 64, 120]) {
    window.setTimeout(tryOnce, ms);
  }
  void customElements.whenDefined(tag).then(() => {
    requestAnimationFrame(tryOnce);
  });
}

function renderEditableCell(
  field: EditableField,
  ariaLabel: string,
): (value: unknown, row: Record<string, unknown>) => HTMLElement {
  return (value, row) => {
    const rowId = String(row.id ?? "");
    const wrap = document.createElement("div");
    wrap.setAttribute("data-modus-bp-inline-cell", "");

    const editing = row._editField === field;
    if (!editing) {
      const span = document.createElement("span");
      span.textContent = String(value ?? "");
      span.tabIndex = 0;
      span.style.cursor = "default";
      span.className = "modus-bp-inline-cell-view";
      span.addEventListener("dblclick", (e) => {
        e.preventDefault();
        e.stopPropagation();
        wrap.dispatchEvent(
          new CustomEvent(CELL_EDIT_START, {
            bubbles: true,
            composed: true,
            detail: { rowId, field },
          }),
        );
      });
      wrap.appendChild(span);
      return wrap;
    }

    const draft = String(row._cellDraft ?? value ?? "");

    const emitDraft = (v: string) => {
      wrap.dispatchEvent(
        new CustomEvent(CELL_DRAFT, {
          bubbles: true,
          composed: true,
          detail: { rowId, field, value: v },
        }),
      );
    };

    const emitCommit = (v: string) => {
      wrap.dispatchEvent(
        new CustomEvent(CELL_COMMIT, {
          bubbles: true,
          composed: true,
          detail: { rowId, field, value: v },
        }),
      );
    };

    if (field === "role") {
      const select = document.createElement("modus-wc-select") as BorderableControl & {
        options?: typeof ROLE_SELECT_OPTIONS;
        value?: string;
        size?: string;
      };
      select.options = ROLE_SELECT_OPTIONS;
      select.value = draft;
      select.setAttribute("size", "sm");
      select.size = "sm";
      select.bordered = false;
      select.setAttribute("aria-label", ariaLabel);
      const readSelectValue = (): string => String(select.value ?? "");
      select.addEventListener("inputChange", ((e: CustomEvent<{ target?: { value?: string } }>) => {
        const raw = e.detail?.target?.value;
        const v = raw != null ? String(raw) : readSelectValue();
        emitDraft(v);
      }) as EventListener);
      select.addEventListener("inputBlur", () => {
        emitCommit(readSelectValue());
      });
      wrap.appendChild(select);
      applyEditorBorderedFalse(select);
      emitDraft(draft);
      scheduleSelectFocus(select);
      return wrap;
    }

    const input = document.createElement("modus-wc-text-input") as BorderableControl & { value?: string };
    input.value = draft;
    input.setAttribute("size", "sm");
    input.size = "sm";
    input.bordered = false;
    input.setAttribute("aria-label", ariaLabel);

    const readValue = (): string => {
      try {
        return String((input as { value?: string }).value ?? "");
      } catch {
        return "";
      }
    };

    input.addEventListener("inputChange", ((e: CustomEvent<{ target?: { value?: string } }>) => {
      const raw = e.detail?.target?.value;
      const v = raw != null ? String(raw) : readValue();
      emitDraft(v);
    }) as EventListener);

    input.addEventListener("inputBlur", () => {
      emitCommit(readValue());
    });

    wrap.appendChild(input);
    applyEditorBorderedFalse(input);
    emitDraft(draft);
    scheduleTextInputFocus(input);
    return wrap;
  };
}

const INLINE_EDIT_COLUMNS: ITableColumn[] = [
  { id: "id", header: "ID", accessor: "id", width: "5rem", sortable: true, cellRenderer: renderIdCell },
  {
    id: "name",
    header: "Name",
    accessor: "name",
    sortable: true,
    cellRenderer: renderEditableCell("name", "Name"),
  },
  {
    id: "email",
    header: "Email",
    accessor: "email",
    sortable: true,
    cellRenderer: renderEditableCell("email", "Email"),
  },
  {
    id: "role",
    header: "Role",
    accessor: "role",
    sortable: true,
    cellRenderer: renderEditableCell("role", "Role"),
  },
];

type EditingCell = { rowId: string; field: EditableField };

/**
 * Live preview: Data Table–style roster; double-click Name, Email, or Role to edit one cell at a time (text `sm`, role `modus-wc-select`).
 * Commits on blur (or when opening another cell); success toast matches Editable Row Table.
 */
export function InlineEditableTablePatternLive() {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const [rows, setRows] = useState<Record<string, unknown>[]>(() => INITIAL_ROWS.map((r) => ({ ...r })));
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [saveToastKey, setSaveToastKey] = useState(0);
  const [saveToastLabel, setSaveToastLabel] = useState("");

  const editStartValueRef = useRef<string>("");
  const rowsRef = useRef(rows);
  const editingCellRef = useRef<EditingCell | null>(null);
  const draftValueRef = useRef("");

  useEffect(() => {
    rowsRef.current = rows;
  }, [rows]);
  useEffect(() => {
    editingCellRef.current = editingCell;
  }, [editingCell]);

  const rowsForTable = useMemo(() => {
    return rows.map((r) => {
      const rid = String(r.id);
      if (editingCell?.rowId === rid) {
        const field = editingCell.field;
        const committed = String((r[field] as string | undefined) ?? "");
        return { ...r, _editField: field, _cellDraft: committed };
      }
      return { ...r, _editField: undefined, _cellDraft: undefined };
    });
  }, [rows, editingCell]);

  useEffect(() => {
    if (!editingCell) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") {
        return;
      }
      e.preventDefault();
      setEditingCell(null);
      draftValueRef.current = "";
      editingCellRef.current = null;
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [editingCell]);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) {
      return;
    }

    const bump = (label: string) => {
      setSaveToastLabel(label);
      setSaveToastKey((k) => k + 1);
    };

    const onDraft = (ev: Event) => {
      const ce = ev as CustomEvent<{ rowId?: string; field?: EditableField; value?: string }>;
      const v = ce.detail?.value;
      if (v != null) {
        draftValueRef.current = String(v);
      }
    };

    const onCommit = (ev: Event) => {
      const ce = ev as CustomEvent<{ rowId?: string; field?: EditableField; value?: string }>;
      const rowId = ce.detail?.rowId;
      const field = ce.detail?.field;
      const value = ce.detail?.value;
      const cur = editingCellRef.current;
      if (!cur || rowId !== cur.rowId || field !== cur.field) {
        return;
      }
      const final = value != null ? String(value) : String(draftValueRef.current ?? "");
      if (final !== editStartValueRef.current) {
        setRows((prev) =>
          prev.map((r) => (String(r.id) === rowId ? { ...r, [field]: final } : r)),
        );
        bump(`Row ${rowId} updated`);
      }
      setEditingCell(null);
      draftValueRef.current = "";
      editingCellRef.current = null;
    };

    const onStart = (ev: Event) => {
      const ce = ev as CustomEvent<{ rowId?: string; field?: EditableField }>;
      const rowId = ce.detail?.rowId;
      const field = ce.detail?.field;
      if (!rowId || !field) {
        return;
      }
      const prev = editingCellRef.current;
      if (prev && prev.rowId === rowId && prev.field === field) {
        return;
      }

      const draft = draftValueRef.current;
      const merged = rowsRef.current.map((r) => ({ ...r }));

      if (prev && (prev.rowId !== rowId || prev.field !== field)) {
        const idx = merged.findIndex((r) => String(r.id) === prev.rowId);
        if (idx >= 0) {
          merged[idx] = { ...merged[idx], [prev.field]: draft };
        }
        if (draft !== editStartValueRef.current) {
          bump(`Row ${prev.rowId} updated`);
        }
        setRows(merged);
      }

      const row = merged.find((r) => String(r.id) === rowId);
      const start = String((row?.[field] as string | undefined) ?? "");
      editStartValueRef.current = start;
      draftValueRef.current = start;
      editingCellRef.current = { rowId, field };
      setEditingCell({ rowId, field });
    };

    shell.addEventListener(CELL_DRAFT, onDraft);
    shell.addEventListener(CELL_COMMIT, onCommit);
    shell.addEventListener(CELL_EDIT_START, onStart);
    return () => {
      shell.removeEventListener(CELL_DRAFT, onDraft);
      shell.removeEventListener(CELL_COMMIT, onCommit);
      shell.removeEventListener(CELL_EDIT_START, onStart);
    };
  }, []);

  return (
    <div className="relative flex min-w-0 flex-col gap-3">
      {saveToastKey > 0 ? (
        <ModusToast
          key={saveToastKey}
          title={saveToastLabel || "Row updated"}
          variant="success"
          icon="check_simple"
          dismissible
          duration={6000}
          position="top-right"
          onDismiss={() => setSaveToastKey(0)}
        />
      ) : null}
      <style>
        {`
        .inline-cell-table-bg modus-wc-table .modus-wc-table,
        .inline-cell-table-bg modus-wc-table table {
          background-color: var(--modus-wc-color-base-page) !important;
        }
      `}
      </style>
      <div ref={shellRef} className="inline-cell-table-bg min-w-0 overflow-x-auto">
        <ModusWcTable
          columns={INLINE_EDIT_COLUMNS}
          data={rowsForTable}
          editable={false}
          zebra={true}
          hover={true}
          sortable={true}
          selectable="none"
          paginated={false}
          caption="Double-click a cell to edit Name, Email, or Role"
          customClass="w-full min-w-0 max-w-full !bg-[var(--modus-wc-color-base-page)]"
        />
      </div>
    </div>
  );
}

export default InlineEditableTablePatternLive;
