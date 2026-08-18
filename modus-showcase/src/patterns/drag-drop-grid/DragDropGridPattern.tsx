// @ts-nocheck
import './drag-drop-grid.css';
import React, { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import {
  ModusWcButton,
  ModusWcCard,
  ModusWcIcon,
  ModusWcProgress,
  ModusWcTypography,
} from "@trimble-oss/moduswebcomponents-react";

type GridItem = {
  id: string;
  title: string;
  subtitle: string;
  progress: number;
};

const INITIAL_ITEMS: GridItem[] = [
  {
    id: "a",
    title: "Throughput",
    subtitle: "Drag from the upper-left handle to reorder in the grid.",
    progress: 58,
  },
  {
    id: "b",
    title: "Utilization",
    subtitle: "Drop targets highlight while you drag over a cell.",
    progress: 72,
  },
  {
    id: "c",
    title: "Backlog",
    subtitle: "Card content stays interactive; only the grip starts a drag.",
    progress: 34,
  },
];

type DragDropGridCardProps = {
  item: GridItem;
  index: number;
  isDropTarget: boolean;
  onDragStart: (index: number) => (event: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (index: number) => (event: React.DragEvent) => void;
  onDragLeave: (event: React.DragEvent) => void;
  onDrop: (index: number) => (event: React.DragEvent) => void;
  onDragEndClear: () => void;
};

function DragDropGridCard({
  item,
  index,
  isDropTarget,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEndClear,
}: DragDropGridCardProps) {
  const [dragEnabled, setDragEnabled] = useState(false);
  const dragArmRef = useRef(false);

  useEffect(() => {
    if (!dragEnabled) return;
    const cancelArm = () => {
      if (!dragArmRef.current) return;
      dragArmRef.current = false;
      setDragEnabled(false);
    };
    window.addEventListener("pointerup", cancelArm);
    window.addEventListener("pointercancel", cancelArm);
    return () => {
      window.removeEventListener("pointerup", cancelArm);
      window.removeEventListener("pointercancel", cancelArm);
    };
  }, [dragEnabled]);

  const handleMoveHandlePointerDown = useCallback(
    (event: React.PointerEvent) => {
      event.stopPropagation();
      dragArmRef.current = true;
      flushSync(() => {
        setDragEnabled(true);
      });
    },
    [],
  );

  const handleGridDragStart = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      if (!dragEnabled) {
        event.preventDefault();
        return;
      }
      onDragStart(index)(event);
    },
    [dragEnabled, index, onDragStart],
  );

  const handleGridDragEnd = useCallback(
    (_event: React.DragEvent<HTMLDivElement>) => {
      dragArmRef.current = false;
      setDragEnabled(false);
      onDragEndClear();
    },
    [onDragEndClear],
  );

  return (
    <div
      className={[
        "min-h-0 min-w-0 flex flex-col rounded-lg transition-[outline-color] duration-150",
        isDropTarget
          ? "outline-2 outline-offset-2 outline-[var(--modus-wc-color-primary)]"
          : "",
      ].join(" ")}
      onDragOver={onDragOver(index)}
      onDragLeave={onDragLeave}
      onDrop={onDrop(index)}
    >
      <div
        className="relative flex h-full min-h-[220px] w-full min-w-0 flex-1 flex-col"
        draggable={dragEnabled}
        onDragStart={handleGridDragStart}
        onDragEnd={handleGridDragEnd}
      >
        <ModusWcCard
          bordered={false}
          customClass="flex h-full min-h-0 w-full flex-1 flex-col"
        >
          <ModusWcTypography
            slot="title"
            hierarchy="h4"
            size="md"
            weight="semibold"
            label={item.title}
          />
          <ModusWcTypography className="text-[var(--modus-wc-color-base-content-low-contrast)]" slot="subtitle" hierarchy="p" size="sm" label={item.subtitle} />
          <div className="mt-1 flex min-h-0 min-w-0 flex-1 flex-col gap-3">
            <ModusWcProgress
              value={item.progress}
              max={100}
              customClass="w-full shrink-0"
            />
            <div className="min-h-0 min-w-0 flex-1 overflow-auto pr-1">
              <ModusWcTypography className="text-[var(--modus-wc-color-base-content)]" hierarchy="p" size="sm" label="Standard Modus cards fill the grid cell; use a dedicated grip so clicks and inputs inside the card are unaffected." />
            </div>
          </div>
        </ModusWcCard>

        <div className="pointer-events-none absolute inset-0 z-10">
          <ModusWcButton
            variant="borderless"
            color="tertiary"
            shape="square"
            size="xs"
            type="button"
            customClass="!pointer-events-auto !absolute !left-1 !top-1 z-20 cursor-grab touch-none active:cursor-grabbing"
            aria-label="Move card"
            onPointerDown={handleMoveHandlePointerDown}
          >
            <ModusWcIcon name="drag_indicator" size="xs" decorative />
          </ModusWcButton>
        </div>
      </div>
    </div>
  );
}

/**
 * Dashboard-style grid of Modus cards with HTML5 reorder: pointer-down on the
 * top-left grip enables dragging the card into another cell.
 */
export function DragDropGridPattern() {
  const [items, setItems] = useState<GridItem[]>(INITIAL_ITEMS);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = useCallback((index: number) => {
    return (event: React.DragEvent<HTMLDivElement>) => {
      event.dataTransfer.setData("text/plain", String(index));
      event.dataTransfer.effectAllowed = "move";
    };
  }, []);

  const handleDragOver = useCallback((index: number) => {
    return (event: React.DragEvent) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      setDragOverIndex(index);
    };
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    const related = event.relatedTarget as Node | null;
    if (related && event.currentTarget.contains(related)) return;
    setDragOverIndex(null);
  }, []);

  const handleDrop = useCallback((toIndex: number) => {
    return (event: React.DragEvent) => {
      event.preventDefault();
      setDragOverIndex(null);
      const fromIndex = Number.parseInt(
        event.dataTransfer.getData("text/plain"),
        10,
      );
      if (Number.isNaN(fromIndex) || fromIndex === toIndex) return;
      setItems((prev) => {
        const next = [...prev];
        const [removed] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, removed);
        return next;
      });
    };
  }, []);

  const clearDropHighlight = useCallback(() => {
    setDragOverIndex(null);
  }, []);

  return (
    <div
      className="w-full min-w-0 p-[var(--modus-wc-spacing-sm)]"
      data-drag-drop-grid
    >
      <ModusWcTypography className="text-[var(--modus-wc-color-base-content-low-contrast)]" hierarchy="p" size="sm" customClass="mb-3" label="Use the grip in the top-left of a card to drag it into another grid cell. Cards are standard Modus cards (not resizable)." />
      <div className="grid min-h-[280px] grid-cols-1 items-stretch gap-3 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <DragDropGridCard
            key={item.id}
            item={item}
            index={index}
            isDropTarget={dragOverIndex === index}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDragEndClear={clearDropHighlight}
          />
        ))}
      </div>
    </div>
  );
}

export default DragDropGridPattern;
