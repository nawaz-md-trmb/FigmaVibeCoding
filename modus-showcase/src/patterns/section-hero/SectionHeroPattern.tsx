// @ts-nocheck
import { useState } from "react";
import { ModusWcButton } from "@trimble-oss/moduswebcomponents-react";
import {
  SectionHero,
  SECTION_HERO_CENTERED_PRESET,
  SECTION_HERO_SPLIT_PRESET,
  type SectionHeroVariant,
} from "./SectionHero";

const VARIANT_PRESETS = {
  centered: SECTION_HERO_CENTERED_PRESET,
  split: SECTION_HERO_SPLIT_PRESET,
} as const;

/** Pattern docs preview with variant switcher (centered vs split). */
export function SectionHeroPatternDemo() {
  const [variant, setVariant] = useState<SectionHeroVariant>("centered");
  const preset = VARIANT_PRESETS[variant];

  return (
    <div className="flex w-full min-w-0 max-w-6xl flex-col gap-4 px-2">
      <div
        className="flex flex-wrap items-center gap-2"
        role="group"
        aria-label="Section Hero layout variant"
      >
        <ModusWcButton
          variant={variant === "centered" ? "filled" : "outlined"}
          color={variant === "centered" ? "primary" : "tertiary"}
          size="sm"
          onButtonClick={() => setVariant("centered")}
        >
          Centered
        </ModusWcButton>
        <ModusWcButton
          variant={variant === "split" ? "filled" : "outlined"}
          color={variant === "split" ? "primary" : "tertiary"}
          size="sm"
          onButtonClick={() => setVariant("split")}
        >
          Split
        </ModusWcButton>
      </div>
      <SectionHero {...preset} background="dither" />
    </div>
  );
}

export function SectionHeroPattern() {
  return <SectionHero {...SECTION_HERO_CENTERED_PRESET} background="dither" />;
}

export default SectionHeroPattern;
