// @ts-nocheck
import React, { useRef } from "react";
import {
  ModusWcIcon,
  ModusWcLogo,
  ModusWcTypography,
} from "@trimble-oss/moduswebcomponents-react";
import { DitherWaveBackground } from "../../src/components/DitherWaveBackground/DitherWaveBackground";
import "./section-hero-pattern.css";

export type SectionHeroVariant = "centered" | "split";

export type SectionHeroBackground = "dither" | "plain";

export type SectionHeroEyebrow = {
  label: string;
  /** Modus Icons `name` (outlined set). Defaults to `settings`. Ignored when `logoName` is set. */
  iconName?: string;
  /** When set, renders `modus-wc-logo` with `emblem` instead of `modus-wc-icon`. */
  logoName?: string;
};

export type SectionHeroHeadlineSegment = {
  text: string;
  accent?: boolean;
};

export type SectionHeroHeadlineLine = {
  segments: SectionHeroHeadlineSegment[];
  /** When true, segments render inline on one row (centered variant second line). */
  inline?: boolean;
};

/** Section index row above the band, e.g. `[ 03 / 06 ] · AI TOOLS`. */
export type SectionHeroSectionMarker = {
  index: string;
  total: string;
  label: string;
};

export type SectionHeroProps = {
  variant: SectionHeroVariant;
  eyebrow: SectionHeroEyebrow;
  headlineLines: SectionHeroHeadlineLine[];
  description?: string;
  /** Split variant only — center the eyebrow row and full-width rule across the band. */
  eyebrowAlign?: "start" | "center";
  /** Optional `[ nn / total ] · LABEL` row at the top inside the bordered container. */
  sectionMarker?: SectionHeroSectionMarker;
  /** Id for `aria-labelledby` on the hero `<section>`. */
  titleId?: string;
  /** `dither` uses the blueprint Bayer wave panel; `plain` is portable without WebGL. */
  background?: SectionHeroBackground;
  customClass?: string;
};

const HEADLINE_TYPO =
  "!m-0 text-3xl leading-[1.1] sm:text-4xl md:text-5xl lg:text-6xl";

export function SectionHeroSectionMarkerRow({
  marker,
}: {
  marker: SectionHeroSectionMarker;
}) {
  return (
    <ModusWcTypography
      hierarchy="p"
      size="xs"
      weight="semibold"
      customClass="section-hero__marker !m-0 w-full font-mono uppercase tracking-wide text-[var(--modus-wc-color-base-content-low-contrast)]"
      aria-hidden="true"
    >
      <span className="section-hero__marker-index">[ {marker.index}</span> /{" "}
      {marker.total} ] · {marker.label}
    </ModusWcTypography>
  );
}

export function SectionHeroEyebrowRow({
  eyebrow,
  align = "start",
}: {
  eyebrow: SectionHeroEyebrow;
  align?: "start" | "center";
}) {
  const iconName = eyebrow.iconName ?? "settings";
  return (
    <p
      className={`section-hero__eyebrow m-0 flex w-full flex-wrap items-center gap-2 font-mono text-base tracking-wide text-[var(--modus-wc-color-base-content-low-contrast)] ${
        align === "center" ? "justify-center" : ""
      }`}
    >
      <span
        aria-hidden="true"
        className="section-hero__eyebrow-slash text-[var(--modus-wc-color-base-content-low-contrast)]"
      >
        //
      </span>
      {eyebrow.logoName ? (
        <ModusWcLogo
          name={eyebrow.logoName}
          emblem
          alt=""
          customClass="h-5 w-5 shrink-0"
        />
      ) : (
        <ModusWcIcon
          name={iconName}
          size="sm"
          decorative
          customClass="shrink-0 text-[var(--modus-wc-color-primary)]"
        />
      )}
      <ModusWcTypography
        hierarchy="p"
        size="md"
        customClass="!m-0 font-mono tracking-wide text-[var(--modus-wc-color-base-content-low-contrast)]"
        label={eyebrow.label}
      />
      <span
        aria-hidden="true"
        className="section-hero__eyebrow-slash text-[var(--modus-wc-color-base-content-low-contrast)]"
      >
        \\
      </span>
    </p>
  );
}

function SectionHeroHeadlineBlock({
  lines,
  titleId,
  variant,
}: {
  lines: SectionHeroHeadlineLine[];
  titleId?: string;
  variant: SectionHeroVariant;
}) {
  const isCentered = variant === "centered";

  return (
    <div
      id={titleId}
      className={`section-hero__headline flex min-w-0 flex-col ${
        isCentered ? "items-center gap-2" : "gap-0"
      }`}
    >
      {lines.map((line, lineIndex) => {
        const key = line.segments.map((s) => s.text).join("-");
        if (line.inline) {
          return (
            <div
              key={key}
              className="flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1"
            >
              {line.segments.map((segment) => (
                <ModusWcTypography
                  key={segment.text}
                  hierarchy="h2"
                  size="4xl"
                  weight="semibold"
                  customClass={`section-hero__headline-line max-w-4xl ${HEADLINE_TYPO}${
                    segment.accent ? " section-hero__headline-line--accent" : ""
                  }`}
                  label={segment.text}
                />
              ))}
            </div>
          );
        }

        return (
          <ModusWcTypography
            key={key}
            hierarchy="h2"
            size="4xl"
            weight="semibold"
            customClass={`section-hero__headline-line max-w-3xl ${HEADLINE_TYPO}${
              line.segments[0]?.accent ? " section-hero__headline-line--accent" : ""
            }`}
            label={line.segments.map((s) => s.text).join("")}
          />
        );
      })}
    </div>
  );
}

/** Centered marketing hero: eyebrow, display headline with optional accent span, supporting line. */
export const SECTION_HERO_CENTERED_PRESET: Omit<
  SectionHeroProps,
  "background" | "customClass"
> = {
  variant: "centered",
  eyebrow: { label: "Atomic system", iconName: "cube" },
  sectionMarker: { index: "01", total: "06", label: "BLUEPRINT" },
  headlineLines: [
    {
      segments: [{ text: "Fast, accessible, and easy to integrate." }],
    },
    {
      segments: [{ text: "Oh and we're" }, { text: "open source.", accent: true }],
      inline: true,
    },
  ],
  description:
    "Design tokens, components, and patterns—from foundations to production UI.",
  titleId: "section-hero-centered-title",
};

/** Split editorial hero: status column + headline and description (ModusAI-style band). */
export const SECTION_HERO_SPLIT_PRESET: Omit<
  SectionHeroProps,
  "background" | "customClass"
> = {
  variant: "split",
  eyebrow: { label: "Tools ready", iconName: "settings" },
  headlineLines: [
    { segments: [{ text: "Easily connect with your" }] },
    { segments: [{ text: "AI Tools.", accent: true }] },
  ],
  description:
    "Connect Modus to any AI assistant or MCP client in minutes—CLI install, Docs MCP, rules, and skills from one blueprint.",
  sectionMarker: { index: "03", total: "06", label: "AI TOOLS" },
  titleId: "section-hero-split-title",
};

export function SectionHero({
  variant,
  eyebrow,
  headlineLines,
  description,
  eyebrowAlign = "start",
  sectionMarker,
  titleId,
  background = "dither",
  customClass = "",
}: SectionHeroProps) {
  const hostRef = useRef<HTMLElement>(null);
  const showDither = background === "dither";
  const hostClass = [
    "section-hero",
    `section-hero--${variant}`,
    "section-hero-dither-band",
    "section-hero-pattern-container",
    "relative min-w-0 overflow-hidden rounded-2xl",
    sectionMarker ? "section-hero--has-marker" : "",
    customClass,
  ]
    .filter(Boolean)
    .join(" ");

  const markerMaxWidth =
    variant === "centered" ? "max-w-5xl" : "max-w-6xl";

  const markerWrap = sectionMarker ? (
    <div
      className={`section-hero__marker-wrap relative z-[1] mx-auto w-full min-w-0 ${markerMaxWidth}`}
    >
      <SectionHeroSectionMarkerRow marker={sectionMarker} />
    </div>
  ) : null;

  const ditherLayer = showDither ? (
    <DitherWaveBackground
      className="section-hero__dither"
      eventTargetRef={hostRef}
    />
  ) : null;

  if (variant === "centered") {
    return (
      <section
        ref={hostRef}
        data-section-hero
        className={hostClass}
        aria-labelledby={titleId}
      >
        {ditherLayer}
        {markerWrap}
        <div className="section-hero__content pointer-events-none relative z-[1] mx-auto flex w-full max-w-5xl min-w-0 flex-col">
          <div className="section-hero__body flex w-full min-w-0 flex-col items-center gap-6 text-center md:gap-8">
            <SectionHeroEyebrowRow eyebrow={eyebrow} align="center" />
            <SectionHeroHeadlineBlock
              lines={headlineLines}
              titleId={titleId}
              variant={variant}
            />
            {description ? (
              <ModusWcTypography
                hierarchy="p"
                size="lg"
                customClass="section-hero__description !m-0 max-w-2xl text-[var(--modus-wc-color-base-content-low-contrast)] text-lg sm:text-xl md:text-2xl"
                label={description}
              />
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={hostRef}
      data-section-hero
      className={hostClass}
      aria-labelledby={titleId}
    >
      {ditherLayer}
      {markerWrap}
      <div className="section-hero__content relative z-[1] mx-auto flex w-full max-w-6xl min-w-0 flex-col">
        <div
          className={`section-hero__body grid min-w-0 grid-cols-1 items-start gap-8 ${
            eyebrowAlign === "center"
              ? ""
              : "md:grid-cols-[minmax(0,13rem)_1fr] md:gap-10 lg:grid-cols-[minmax(0,15rem)_1fr] lg:gap-12"
          }`}
        >
          <div className="section-hero__aside min-w-0 w-full">
            <SectionHeroEyebrowRow
              eyebrow={eyebrow}
              align={eyebrowAlign === "center" ? "center" : "start"}
            />
            <div
              className="section-hero__rule mt-4 h-px w-full bg-[var(--modus-wc-color-base-200)]"
              aria-hidden="true"
            />
          </div>
          <div className="section-hero__copy flex min-w-0 flex-col gap-6 md:gap-8">
            <SectionHeroHeadlineBlock
              lines={headlineLines}
              titleId={titleId}
              variant={variant}
            />
            {description ? (
              <ModusWcTypography
                hierarchy="p"
                size="lg"
                customClass="section-hero__description !m-0 max-w-2xl text-[var(--modus-wc-color-base-content-low-contrast)] text-lg sm:text-xl md:text-2xl"
                label={description}
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SectionHero;
