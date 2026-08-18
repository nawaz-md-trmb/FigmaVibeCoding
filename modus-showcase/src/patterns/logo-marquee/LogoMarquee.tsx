// @ts-nocheck
import {
  ModusWcLogo,
  ModusWcTypography,
} from "@trimble-oss/moduswebcomponents-react";
import "./logo-marquee-pattern.css";

/** Trimble product logos for the trusted-by marquee (`modus-wc-logo` `name` keys). */
export const TRUSTED_BY_PRODUCT_LOGOS = [
  { name: "connect", label: "Trimble Connect" },
  { name: "unity", label: "Unity" },
  { name: "projectsight", label: "ProjectSight" },
  { name: "financials", label: "Trimble Financials" },
  { name: "sketchup", label: "SketchUp" },
  { name: "siteworks", label: "Siteworks" },
  { name: "analytics", label: "Analytics" },
  { name: "atlas", label: "Atlas" },
  { name: "app_xchange", label: "App Xchange" },
  { name: "b2w", label: "B2W" },
  { name: "pay", label: "Pay" },
  { name: "traqspera", label: "Traqspera" },
  { name: "worksmanager", label: "WorksManager" },
] as const;

export type TrustedByProductLogo = (typeof TRUSTED_BY_PRODUCT_LOGOS)[number];

function LogoMarqueeCell({
  name,
  label,
  duplicate = false,
}: {
  name: TrustedByProductLogo["name"];
  label: string;
  duplicate?: boolean;
}) {
  return (
    <li className="logo-marquee__logo-item flex shrink-0 items-center justify-center">
      <ModusWcLogo
        name={name}
        alt={duplicate ? "" : label}
        customClass="logo-marquee__logo h-7 w-auto max-w-[10.5rem] shrink-0 sm:h-8 sm:max-w-[11.5rem]"
        aria-hidden={duplicate ? true : undefined}
      />
    </li>
  );
}

export type LogoMarqueeProps = {
  /** Uppercase eyebrow above the headline (default: Trusted by). */
  eyebrowLabel?: string;
  /** Primary headline in the intro column (default: Trimble Teams). */
  headlineLabel?: string;
  /** Product logos in scroll order; defaults to TRUSTED_BY_PRODUCT_LOGOS. */
  logos?: readonly TrustedByProductLogo[];
  /** Optional class on the root `<section>` (layout only). */
  customClass?: string;
};

/**
 * Horizontal logo marquee with a fixed intro column and infinitely scrolling product logos.
 * Used on the blueprint home page and the Logo Marquee pattern docs.
 */
export function LogoMarquee({
  eyebrowLabel = "Trusted by",
  headlineLabel = "Trimble Teams",
  logos = TRUSTED_BY_PRODUCT_LOGOS,
  customClass,
}: LogoMarqueeProps) {
  return (
    <section
      className={["logo-marquee min-w-0 w-full", customClass].filter(Boolean).join(" ")}
      aria-label="Trusted by teams using Trimble products"
    >
      <div className="logo-marquee__shell flex min-h-[5rem] w-full min-w-0 items-center overflow-hidden rounded-lg border border-[color-mix(in_srgb,var(--modus-wc-color-base-content)_10%,transparent)] bg-[var(--modus-wc-color-base-page)]">
        <div className="logo-marquee__intro flex shrink-0 items-center border-r border-[color-mix(in_srgb,var(--modus-wc-color-base-content)_12%,transparent)] px-[var(--logo-marquee-inset-x,1rem)] py-3 sm:py-4">
          <div className="logo-marquee__intro-text m-0 flex max-w-[14rem] flex-col gap-0 leading-none sm:max-w-none">
            <ModusWcTypography
              hierarchy="p"
              size="xs"
              customClass="logo-marquee__eyebrow !m-0 font-mono font-medium uppercase tracking-wider text-(--modus-wc-color-base-content-low-contrast)"
              label={eyebrowLabel}
            />
            <ModusWcTypography
              hierarchy="p"
              size="xl"
              weight="light"
              customClass="logo-marquee__headline !m-0 text-(--modus-wc-color-primary) sm:text-2xl"
              label={headlineLabel}
            />
          </div>
        </div>

        <div className="logo-marquee__viewport relative min-h-0 min-w-0 flex-1 overflow-hidden">
          <div className="logo-marquee__track">
            <ul className="logo-marquee__logo-list m-0 flex w-max flex-nowrap list-none items-center p-0">
              {logos.map(({ name, label }) => (
                <LogoMarqueeCell key={name} name={name} label={label} />
              ))}
              {logos.map(({ name, label }) => (
                <LogoMarqueeCell
                  key={`dup-${name}`}
                  name={name}
                  label={label}
                  duplicate
                />
              ))}
            </ul>
          </div>
        </div>
        <div className="logo-marquee__gutter shrink-0" aria-hidden="true" />
      </div>
    </section>
  );
}
