// @ts-nocheck
import React from "react";
import "./AiUxGradientFrame.css";

/** Layout shell for pattern previews — inner Figma component only (no spec chrome). */
export function AiUxSpecCard({ children }: { children: React.ReactNode }) {
  return <div className="max-w-3xl min-w-0 w-full">{children}</div>;
}

/** Rainbow gradient stroke frame (AI chrome) with slow rotation; see AiUxGradientFrame.css. */
export function AiUxGradientFrame({
  children,
  className = "",
  innerClassName = "",
  overflowVisible = false,
}: {
  children: React.ReactNode;
  className?: string;
  /** Merged onto `ai-ux-gradient-frame__inner` (e.g. page background instead of default base-100). */
  innerClassName?: string;
  /** Allow dropdowns/menus to paint outside the frame (default clips for the rainbow edge). */
  overflowVisible?: boolean;
}) {
  return (
    <div
      className={`ai-ux-gradient-frame ${overflowVisible ? "ai-ux-gradient-frame--overflow-visible" : ""} ${className}`.trim()}
    >
      <div className="ai-ux-gradient-frame__glow" aria-hidden />
      <div
        className={`ai-ux-gradient-frame__inner ${innerClassName}`.trim()}
      >
        {children}
      </div>
    </div>
  );
}
