// @ts-nocheck
import './help-center-hero.css';
import {
  ModusWcTypography,
  ModusWcTextInput,
  ModusWcCard,
  ModusWcIcon,
  ModusWcDivider,
} from '@trimble-oss/moduswebcomponents-react';

export function HelpCenterHero() {
  return (
    <div className="min-w-0 rounded-lg overflow-hidden w-full help-center-hero-container" style={{ backgroundColor: '#252A2E', containerType: 'inline-size' }} data-help-center-hero>
      <div className="p-8 flex flex-col items-stretch w-full min-w-0">
        <div className="help-center-hero-top-grid grid grid-cols-1 md:grid-cols-3 gap-3 w-full min-w-0 md:max-w-5xl mb-4">
          <div className="md:col-span-2 flex flex-col w-full min-w-0">
            <header className="flex items-center gap-1.5 mb-1 w-full">
              <img src="/assets/logos/emblems/sketchup-emblem.svg" alt="SketchUp" className="h-[44px] w-[44px] shrink-0 object-contain" />
              <ModusWcTypography hierarchy="h1" size="3xl" weight="light" label="SketchUp Help Center" customClass="text-white leading-tight" />
            </header>
            <div className="flex flex-wrap items-baseline gap-x-1 gap-y-1 w-full">
              <ModusWcTypography hierarchy="p" size="md" weight="normal" label="Search for answers, browse categories, or " customClass="text-white/90 m-0 leading-normal inline-block font-normal" />
              <a href="#" className="help-center-hero-ask-ai-link underline font-semibold text-[length:1em] text-white hover:underline focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-white">
                Ask AI
              </a>
            </div>
          </div>
          <div className="help-center-hero-search-col w-full min-w-0 overflow-hidden">
            <ModusWcTextInput type="search" includeSearch placeholder="Search" size="sm" customClass="w-full min-w-0 max-w-full" />
          </div>
        </div>
        <div className="help-center-hero-cards-grid grid grid-cols-1 md:grid-cols-3 gap-3 w-full min-w-0 md:max-w-5xl">
          <ModusWcCard bordered={false} customClass="!bg-[var(--modus-wc-color-base-page)] shadow-md w-full min-w-0 flex flex-col overflow-visible max-w-full">
            <ModusWcTypography slot="title" hierarchy="h2" size="xl" weight="light" label="Start your journey" customClass="text-[var(--modus-wc-color-base-content)] m-0 leading-tight" />
            <div className="flex flex-col flex-1 min-h-[140px]">
              <ModusWcTypography hierarchy="p" size="sm" weight="normal" customClass="text-[var(--modus-wc-color-base-content-low-contrast)] mt-3 mb-0 leading-relaxed font-normal" label="New to your software? Get up to speed fast with these learning resources." />
              <a href="#" className="flex items-center justify-between w-full font-semibold text-sm text-[var(--modus-wc-color-primary)] hover:underline py-1 mt-3">
                Get started
                <ModusWcIcon name="arrow_next" decorative size="sm" customClass="text-[var(--modus-wc-color-primary)] shrink-0" />
              </a>
            </div>
          </ModusWcCard>
          <ModusWcCard bordered={false} customClass="!bg-[var(--modus-wc-color-base-page)] shadow-md w-full min-w-0 max-w-full flex flex-col overflow-visible">
            <ModusWcTypography slot="title" hierarchy="h2" size="xl" weight="light" label="Enhance your experience" customClass="text-[var(--modus-wc-color-base-content)] m-0 leading-tight" />
            <div className="flex flex-col flex-1 min-h-[140px]">
              <ModusWcTypography hierarchy="p" size="sm" weight="normal" customClass="text-[var(--modus-wc-color-base-content-low-contrast)] mt-3 mb-0 leading-relaxed font-normal" label="Unlock the full potential of your product with our easy-to-follow instructions, expert tips, and helpful resources." />
              <a href="#" className="flex items-center justify-between w-full font-semibold text-sm text-[var(--modus-wc-color-primary)] hover:underline py-1 mt-3">
                Welcome to Trimble Account Services
                <ModusWcIcon name="arrow_next" decorative size="sm" customClass="text-[var(--modus-wc-color-primary)] shrink-0" />
              </a>
            </div>
          </ModusWcCard>
          <ModusWcCard bordered={false} customClass="!bg-[var(--modus-wc-color-base-page)] shadow-md w-full min-w-0 max-w-full flex flex-col overflow-visible">
            <ModusWcTypography slot="title" hierarchy="h2" size="xl" weight="light" label="Featured articles" customClass="text-[var(--modus-wc-color-base-content)] m-0 leading-tight" />
            <div className="flex flex-col flex-1 min-h-[140px]">
              <ModusWcTypography hierarchy="p" size="sm" weight="normal" customClass="text-[var(--modus-wc-color-base-content-low-contrast)] mt-3 mb-0 leading-relaxed font-normal" label="Explore these articles for in-depth insights." />
              <a href="#" className="flex items-center justify-between w-full font-semibold text-sm text-[var(--modus-wc-color-primary)] hover:underline py-1 mt-3">
                Account management
                <ModusWcIcon name="arrow_next" decorative size="sm" customClass="text-[var(--modus-wc-color-primary)] shrink-0" />
              </a>
              <ModusWcDivider customClass="my-3" />
              <a href="#" className="flex items-center justify-between w-full font-semibold text-sm text-[var(--modus-wc-color-primary)] hover:underline py-1">
                License management
                <ModusWcIcon name="arrow_next" decorative size="sm" customClass="text-[var(--modus-wc-color-primary)] shrink-0" />
              </a>
              <ModusWcDivider customClass="my-3" />
              <a href="#" className="flex items-center justify-between w-full font-semibold text-sm text-[var(--modus-wc-color-primary)] hover:underline py-1">
                User management
                <ModusWcIcon name="arrow_next" decorative size="sm" customClass="text-[var(--modus-wc-color-primary)] shrink-0" />
              </a>
            </div>
          </ModusWcCard>
        </div>
      </div>
    </div>
  );
}

export default HelpCenterHero;
