// @ts-nocheck
import { useState, useRef, useLayoutEffect } from 'react';
import {
  ModusWcTextInput,
  ModusWcTypography,
  ModusWcButton,
  ModusWcIcon,
  ModusWcDropdownMenu,
  ModusWcButtonGroup,
  ModusWcToolbar,
  ModusWcCard,
} from '@trimble-oss/moduswebcomponents-react';
import { HelpCenterTrimbleLogo } from './HelpCenterTrimbleLogo';
import {
  HelpCenterNavMegaMenu,
  type HelpCenterNavMegaMenuContent,
} from './HelpCenterNavMegaMenu';

export function HelpCenterNavigation() {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [overlaySearchValue, setOverlaySearchValue] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [selectedLang, setSelectedLang] = useState('English');
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [expandedSubMenu, setExpandedSubMenu] = useState(null);
  const commonSearches = [
    { label: 'Developer', href: 'https://developer.trimble.com/' },
    { label: 'SketchUp', href: 'https://sketchup.trimble.com/' },
    { label: 'Trimble', href: 'https://www.trimble.com/' },
  ];
  const languages = [
    'English', 'English (United Kingdom)', 'Dansk (Danmark)', 'Deutsch (Deutschland)',
    'Español (México)', 'Français (France)', 'Italiano (Italia)', 'Nederlands (Nederland)',
    'Norsk bokmål (Norge)', 'Português (Brasil)', 'Suomi (Suomi)', 'Svenska (Sverige)',
    'Русский (Россия)', '日本語 (日本) / Japanese (Japan)', '简体中文 (中国) / Chinese (Simplified, China)',
    '繁體中文 (臺灣) / Chinese (Traditional, Taiwan)', '한국어 (대한민국) / Korean (South Korea)'
  ];
  const handleLangSelect = (lang) => {
    setSelectedLang(lang);
    setLangMenuOpen(false);
  };

  const headerRowRef = useRef(null);
  const navRef = useRef(null);
  useLayoutEffect(() => {
    const el = headerRowRef.current;
    const nav = navRef.current;
    if (!el || !nav) return;
    const updateHeight = () => {
      const rect = el.getBoundingClientRect();
      const navRect = nav.getBoundingClientRect();
      nav.style.setProperty('--help-center-nav-header-height', `${rect.bottom - navRect.top}px`);
    };
    updateHeight();
    const ro = new ResizeObserver(updateHeight);
    ro.observe(el);
    return () => ro.disconnect();
  }, [searchOverlayOpen]);

  const megaMenuContent: Record<string, HelpCenterNavMegaMenuContent> = {
    'why-sketchup': {
      leftItems: [
        { label: 'Benefits of SketchUp', href: '#' },
        { label: 'Our Story', href: '#' },
        { label: "AI in SketchUp", href: '#' },
        { label: "What's New", hasSubMenu: true, subMenuId: 'whats-new' },
        { label: 'Your Vision Realized', href: '#' },
      ],
      middleItems: [
        { label: 'Latest Updates', href: '#' },
        { label: 'Previous Updates', href: '#' },
      ],
      featuredCard: {
        imageSrc: '/assets/whats-new-sketchup.png',
        imageAlt: "What's new in SketchUp - 3D collaboration space",
        title: "WHAT'S NEW IN SKETCHUP",
        description: 'Turn feedback into final designs—seamlessly in SketchUp',
        ctaLabel: 'Learn More',
      },
    },
    plans: {
      leftItems: [
        { label: 'Plans and Pricing', href: '#' },
        { label: 'Go', href: '#' },
        { label: 'Pro', href: '#' },
        { label: 'Studio', href: '#' },
        { label: 'Education', hasSubMenu: true, subMenuId: 'education' },
        { label: 'Sefaira', href: '#' },
      ],
      middleItems: [
        { label: 'For K-12', href: '#' },
        { label: 'For Universities', href: '#' },
        { label: 'For Students & Professors', href: '#' },
      ],
      featuredCard: {
        imageSrc: '/assets/plans-get-started.png',
        imageAlt: 'Get started with SketchUp - collaboration and design tools',
        title: 'GET STARTED FOR FREE TODAY',
        description: 'Explore our most robust design tools with a free 7-day trial.',
        ctaLabel: 'Try Now',
      },
    },
    industries: {
      leftItems: [
        { label: 'Architecture', href: '#' },
        { label: 'Interior Design', href: '#' },
        { label: 'Landscape Architecture', href: '#' },
        { label: 'Urban Planning', href: '#' },
        { label: 'Woodworking', href: '#' },
        { label: 'Construction', href: '#' },
      ],
      featuredCard: {
        imageSrc: '/assets/industries-revolutionize.png',
        imageAlt: 'Revolutionize the way you create - Inspire',
        title: 'REVOLUTIONIZE THE WAY YOU CREATE',
        description: 'Deep dive into the minds and creative processes of expert SketchUp users worldwide.',
        ctaLabel: 'Learn More',
      },
    },
    resources: {
      leftItems: [
        { label: 'Learn', hasSubMenu: true, subMenuId: 'learn' },
        { label: 'Support', hasSubMenu: true, subMenuId: 'support' },
        { label: 'Connect', hasSubMenu: true, subMenuId: 'connect' },
        { label: 'Training', href: '#' },
      ],
      middleItemsBySubMenu: {
        learn: [
          { label: 'Blog', href: '#' },
          { label: 'Trimble Learn', href: 'https://learn.trimble.com/pages/902/sketchup' },
          { label: 'Quick Learning', href: '#' },
          { label: 'Release Notes', href: 'https://help.sketchup.com/en/sketchup-desktop-20261' },
        ],
        support: [
          { label: 'SketchUp Help', href: '#' },
          { label: 'Contact Us', href: '#' },
        ],
        connect: [
          { label: 'Forum', href: '#' },
          { label: "Pre-built 3D Models", href: '#' },
        ],
      },
      featuredCard: {
        imageSrc: '/assets/resources-where-ideas.png',
        imageAlt: 'Where ideas come to life - sustainable urban design',
        title: 'WHERE IDEAS COME TO LIFE',
        description: 'Explore how designers leverage SketchUp to visualize and inspire.',
        ctaLabel: 'Learn More',
      },
    },
    pricing: {
      leftItems: [
        { label: 'Plans and Pricing', href: '#' },
        { label: 'Enterprise', href: '#' },
        { label: 'Find a Reseller', href: '#' },
      ],
      featuredCard: {
        imageSrc: '/assets/pricing-compare-plans.png',
        imageAlt: 'Compare plans and features - large-scale architectural visualization',
        title: 'COMPARE PLANS AND FEATURES',
        description: 'Explore all the features SketchUp has to offer and find the right plan for you.',
        ctaLabel: 'Compare Plans',
      },
    },
  };

  return (
    <header ref={navRef} className={"help-center-nav min-w-0 w-full help-center-nav-container bg-[var(--modus-wc-color-base-page)] border-b border-[var(--modus-wc-color-base-200)] pt-6 " + (mobileMenuOpen ? "help-center-nav-mobile-expanded" : "") + (searchOverlayOpen ? " help-center-nav-search-open" : "")} data-help-center-nav>
      <div ref={headerRowRef} className="help-center-nav-header-row flex items-center justify-between w-full pl-0 pr-0 gap-4 mb-6 md:mb-0">
        <div className="flex items-center gap-0 min-w-0 flex-1">
          <a href="https://help.sketchup.com" target="_blank" rel="noopener noreferrer" className="help-center-nav-brand flex items-center justify-center px-4 py-2 mr-2 shrink-0 self-stretch bg-[var(--modus-wc-color-primary)] text-white no-underline hover:opacity-90 transition-opacity">
            <div className="help-center-nav-brand-logo h-8 w-auto shrink-0 flex items-center justify-center py-1 ml-2 lg:ml-[80px] [&_svg_path]:!fill-white">
              <HelpCenterTrimbleLogo />
            </div>
          </a>
          <ModusWcTypography hierarchy="p" size="3xl" weight="light" label="Help" customClass="text-[var(--modus-wc-color-primary)] ml-6 !m-0 !font-extralight" />
        </div>
        <div className="help-center-nav-desktop-right flex items-center gap-2 shrink-0">
          <ModusWcButton variant="borderless" color="tertiary" size="sm" shape="square" customClass="help-center-nav-search-btn" onButtonClick={() => setSearchOverlayOpen(true)} aria-label="Open search">
            <ModusWcIcon name="search" size="sm" decorative />
          </ModusWcButton>
          {langMenuOpen && (
            <ModusWcButton
              variant="borderless"
              color="tertiary"
              size="xs"
              shape="square"
              customClass="help-center-nav-lang-close"
              onButtonClick={() => setLangMenuOpen(false)}
              aria-label="Close language menu"
            >
              <ModusWcIcon name="close" size="xs" decorative={false} aria-label="Close language menu" />
            </ModusWcButton>
          )}
          <ModusWcDropdownMenu
            menuVisible={langMenuOpen}
            onMenuVisibilityChange={(e) => setLangMenuOpen(e.detail.isVisible)}
            buttonVariant="borderless"
            buttonColor="tertiary"
            buttonSize="sm"
            menuPlacement="bottom"
            menuSize="lg"
            customClass="help-center-nav-lang-dropdown"
          >
            <div slot="button" className="flex items-center gap-2 help-center-nav-lang help-center-nav-lang-trigger">
              <ModusWcIcon name="web" size="sm" decorative />
              <ModusWcTypography hierarchy="p" size="sm" label={selectedLang} customClass="help-center-nav-lang-text !m-0 text-[var(--modus-wc-color-base-content)]" />
            </div>
            <div slot="menu" className="help-center-nav-lang-menu">
              <div className="help-center-nav-lang-menu-header">LANGUAGE</div>
              <div className="help-center-nav-lang-menu-grid">
                {languages.map((lang) => (
                  <div
                    key={lang}
                    className="help-center-nav-lang-option"
                    onClick={() => handleLangSelect(lang)}
                  >
                    <span className="help-center-nav-lang-check">
                      {selectedLang === lang && <ModusWcIcon name="check" size="sm" decorative />}
                    </span>
                    <span>{lang}</span>
                  </div>
                ))}
              </div>
            </div>
          </ModusWcDropdownMenu>
          <div
            role="button"
            tabIndex={0}
            className="help-center-nav-split-buttons-wrapper"
            onClick={() => setDrawerOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setDrawerOpen(true);
              }
            }}
            aria-label="Open menu"
          >
            <div className="help-center-nav-split-buttons">
              <ModusWcButtonGroup variant="filled" color="primary">
                <ModusWcButton variant="filled" size="sm" shape="square" customClass="help-center-nav-chevron-btn" aria-hidden="true">
                  <ModusWcIcon name="chevron_left" size="xs" decorative />
                </ModusWcButton>
                <ModusWcButton variant="filled" color="primary" size="sm" shape="square" customClass="help-center-nav-logo-btn" aria-hidden="true">
                  <span className="help-center-nav-trimble-logo" style={{ display: 'inline-flex', width: 24, height: 24, flexShrink: 0 }}>
                    <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.9833 11.7667C11.9 11.0417 11.7333 10.325 11.4667 9.65005C10.8847 9.87937 10.2502 9.94158 9.63476 9.82968C9.01931 9.71778 8.44735 9.43622 7.98333 9.01672C7.29166 9.73338 6.675 10.525 6.13333 11.3584C7.725 12.6584 10.3417 13 11.9833 11.7667ZM8 7.92505C8.49166 7.46672 9.025 7.04172 9.58333 6.66672C9.07648 6.20068 8.48145 5.84083 7.83333 5.60838C7.36666 6.33338 7.43333 7.28338 8 7.93338M10.1667 6.25005C10.55 5.96672 10.95 5.74172 11.3917 5.56672C11.0065 5.19176 10.5157 4.94367 9.98541 4.85577C9.45509 4.76788 8.91056 4.8444 8.425 5.07505C9.06666 5.35838 9.65833 5.75838 10.1667 6.25005ZM4.95 5.44172C3.83333 7.02505 4.35833 9.33338 5.65 10.7834C6.20415 9.93861 6.83456 9.1464 7.53333 8.41672C6.81666 7.58338 6.675 6.40005 7.2 5.42505C6.45833 5.24172 5.68333 5.25005 4.95 5.44172ZM7.66666 4.70838C8.15833 4.35838 8.74166 4.16672 9.34166 4.15005C8.10833 3.94172 6.84166 4.08338 5.68333 4.56672C6.35 4.49172 7.025 4.54172 7.66666 4.70838ZM11.225 8.95005C10.925 8.31672 10.5417 7.73338 10.0917 7.20838C9.525 7.58338 8.99166 8.00838 8.49166 8.46672C9.24166 9.12505 10.3 9.31672 11.225 8.95005ZM12.85 7.19172C12.9583 7.95838 12.6583 8.72505 12.0667 9.23338C12.3083 9.85005 12.4917 10.4834 12.6 11.1334C12.9879 10.5578 13.2156 9.88921 13.2595 9.19645C13.3035 8.50369 13.1621 7.81174 12.85 7.19172ZM12.7083 12.1167C12.725 12.5917 12.7083 13.075 12.6417 13.55C13.5185 12.4257 13.9408 11.0129 13.825 9.59172C13.7417 10.5334 13.35 11.4167 12.7083 12.1167ZM17.5 10L14.1917 8.08338C14.5833 9.33338 14.575 10.6667 14.175 11.9167L17.5 10ZM5.8 12.075C5.31666 12.8667 4.95833 13.7334 4.75 14.6417C5.76089 15.4035 6.99763 15.805 8.2632 15.7823C9.52876 15.7597 10.7503 15.3142 11.7333 14.5167C11.9583 13.9334 12.0667 13.3084 12.05 12.6834C11.0603 13.1946 9.94397 13.4091 8.83526 13.3012C7.72654 13.1933 6.67257 12.7675 5.8 12.075ZM5.28333 11.475C4.62811 10.8079 4.15232 9.98589 3.90026 9.08543C3.64819 8.18498 3.62803 7.23539 3.84166 6.32505C2.92075 7.41134 2.44354 8.80505 2.50533 10.2278C2.56712 11.6506 3.16338 12.9977 4.175 14C4.43333 13.1084 4.80833 12.2584 5.29166 11.475M6.8 3.56672L3.50833 1.67505V5.46672C4.38504 4.51282 5.53442 3.85229 6.8 3.57505V3.56672ZM3.50833 18.325L6.825 16.4084C5.55009 16.1319 4.39172 15.4683 3.50833 14.5084V18.325Z" fill="#ffffff"/>
                      <path d="M11.8 6.12505C12.3333 6.83338 12.325 7.81671 11.775 8.51671C11.475 7.90005 11.0916 7.32505 10.65 6.80005C11 6.52505 11.3833 6.29171 11.8 6.12505Z" fill="#ffffff"/>
                    </svg>
                  </span>
                </ModusWcButton>
              </ModusWcButtonGroup>
            </div>
          </div>
        </div>
        <div className="help-center-nav-mobile-hamburger-wrapper mr-4">
          <ModusWcButton
            variant="borderless"
            color="tertiary"
            size="sm"
            shape="square"
            customClass="help-center-nav-mobile-hamburger"
            onButtonClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <ModusWcIcon name="menu" size="md" decorative />
          </ModusWcButton>
        </div>
        <div className="help-center-nav-mobile-header-right flex items-center gap-2 shrink-0">
          <ModusWcButton variant="borderless" color="tertiary" size="sm" shape="square" customClass="help-center-nav-search-btn" onButtonClick={() => { setMobileMenuOpen(false); setSearchOverlayOpen(true); }} aria-label="Open search">
            <ModusWcIcon name="search" size="sm" decorative />
          </ModusWcButton>
          <ModusWcButton variant="filled" color="secondary" size="sm" customClass="help-center-nav-toolbar-cta" onButtonClick={() => { setMobileMenuOpen(false); window.open('https://help.sketchup.com/contact-support/technical-question/form', '_blank'); }}>
            Contact Support
          </ModusWcButton>
          <div className="help-center-nav-mobile-close-wrapper mr-4">
            <ModusWcButton variant="borderless" color="tertiary" size="sm" shape="square" onButtonClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
              <ModusWcIcon name="close" size="md" decorative={false} aria-label="Close" />
            </ModusWcButton>
          </div>
        </div>
      </div>
      <div className="help-center-nav-inner max-w-7xl mx-auto w-full">
      <div className="help-center-nav-expandable">
      <div className="help-center-nav-mobile-search w-full p-4 pt-6 bg-[var(--modus-wc-color-base-200)]">
        <form onSubmit={(e) => { e.preventDefault(); setOverlaySearchValue(searchValue); setSearchOverlayOpen(true); setMobileMenuOpen(false); }} className="w-full">
          <ModusWcTextInput type="search" includeSearch placeholder="SEARCH" size="sm" value={searchValue} onInputChange={(e) => setSearchValue(e.detail?.target?.value || '')} customClass="w-full" />
        </form>
      </div>
      <div className={"help-center-nav-toolbar-wrapper w-full max-w-[1280px] mx-auto px-4 help-center-nav-mega-menu-root " + (activeMegaMenu ? "help-center-nav-mega-menu-active" : "")}>
      <div className="help-center-nav-toolbar-bar relative z-[101]">
      <ModusWcToolbar customClass="help-center-nav-toolbar pt-4 border-t border-[var(--modus-wc-color-base-200)]" aria-label="Page navigation">
        <div slot="start" className="help-center-nav-toolbar-start">
          <div className="flex items-center gap-6 help-center-nav-toolbar-links">
            <div className="help-center-nav-toolbar-link help-center-nav-toolbar-link-fill help-center-nav-mega-menu-trigger">
              <button
                type="button"
                className={"help-center-nav-toolbar-link-btn " + (activeMegaMenu === 'why-sketchup' ? "help-center-nav-toolbar-link-active" : "")}
                onClick={() => { setActiveMegaMenu((v) => (v === 'why-sketchup' ? null : 'why-sketchup')); setExpandedSubMenu(null); }}
                aria-expanded={activeMegaMenu === 'why-sketchup'}
                aria-haspopup="true"
              >
                <ModusWcTypography hierarchy="p" size="sm" weight="semibold" label="WHY SKETCHUP?" customClass="!m-0 text-[var(--modus-wc-color-base-content)] transition-colors" />
              </button>
            </div>
            <div className="help-center-nav-toolbar-link help-center-nav-toolbar-link-fill help-center-nav-mega-menu-trigger">
              <button
                type="button"
                className={"help-center-nav-toolbar-link-btn " + (activeMegaMenu === 'plans' ? "help-center-nav-toolbar-link-active" : "")}
                onClick={() => { setActiveMegaMenu((v) => (v === 'plans' ? null : 'plans')); setExpandedSubMenu(null); }}
                aria-expanded={activeMegaMenu === 'plans'}
                aria-haspopup="true"
              >
                <ModusWcTypography hierarchy="p" size="sm" weight="semibold" label="PLANS" customClass="!m-0 text-[var(--modus-wc-color-base-content)] transition-colors" />
              </button>
            </div>
            <div className="help-center-nav-toolbar-link help-center-nav-toolbar-link-fill help-center-nav-mega-menu-trigger">
              <button
                type="button"
                className={"help-center-nav-toolbar-link-btn " + (activeMegaMenu === 'resources' ? "help-center-nav-toolbar-link-active" : "")}
                onClick={() => { setActiveMegaMenu((v) => (v === 'resources' ? null : 'resources')); setExpandedSubMenu(null); }}
                aria-expanded={activeMegaMenu === 'resources'}
                aria-haspopup="true"
              >
                <ModusWcTypography hierarchy="p" size="sm" weight="semibold" label="RESOURCES" customClass="!m-0 text-[var(--modus-wc-color-base-content)] transition-colors" />
              </button>
            </div>
            <a
              href="http://accounts.trimble.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="help-center-nav-toolbar-link help-center-nav-toolbar-link-fill"
            >
              <ModusWcTypography hierarchy="p" size="sm" weight="semibold" label="ADMIN CONSOLE" customClass="!m-0 text-[var(--modus-wc-color-base-content)] transition-colors hover:text-[var(--modus-wc-color-primary)]" />
            </a>
          </div>
        </div>
        <div slot="end" className="help-center-nav-toolbar-end shrink-0">
          <div className="my-4">
            <ModusWcButton variant="filled" color="secondary" size="sm" customClass="help-center-nav-toolbar-cta" onButtonClick={() => window.open('https://help.sketchup.com/contact-support/technical-question/form', '_blank')}>
              Contact Support
            </ModusWcButton>
          </div>
        </div>
      </ModusWcToolbar>
      </div>
      {activeMegaMenu && megaMenuContent[activeMegaMenu] && (
        <HelpCenterNavMegaMenu
          open={!!activeMegaMenu}
          onClose={() => { setActiveMegaMenu(null); setExpandedSubMenu(null); }}
          content={megaMenuContent[activeMegaMenu]}
          expandedSubMenu={expandedSubMenu}
          onExpandedSubMenuChange={setExpandedSubMenu}
        />
      )}
      </div>
      <div className="help-center-nav-mobile-lang-trimble">
        <ModusWcButton variant="borderless" color="tertiary" size="sm" shape="square" customClass="help-center-nav-search-btn" onButtonClick={() => { setMobileMenuOpen(false); setSearchOverlayOpen(true); }} aria-label="Open search">
          <ModusWcIcon name="search" size="sm" decorative />
        </ModusWcButton>
        <ModusWcDropdownMenu
          menuVisible={langMenuOpen}
          onMenuVisibilityChange={(e) => setLangMenuOpen(e.detail.isVisible)}
          buttonVariant="borderless"
          buttonColor="tertiary"
          buttonSize="sm"
          menuPlacement="bottom"
          menuSize="lg"
          customClass="help-center-nav-lang-dropdown"
        >
          <div slot="button" className="flex items-center gap-2 help-center-nav-lang help-center-nav-lang-trigger">
            <ModusWcIcon name="web" size="sm" decorative />
            <ModusWcTypography hierarchy="p" size="sm" label={selectedLang} customClass="help-center-nav-lang-text !m-0 text-[var(--modus-wc-color-base-content)]" />
          </div>
          <div slot="menu" className="help-center-nav-lang-menu">
            <div className="help-center-nav-lang-menu-header">LANGUAGE</div>
            <div className="help-center-nav-lang-menu-grid">
              {languages.map((lang) => (
                <div
                  key={lang}
                  className="help-center-nav-lang-option"
                  onClick={() => handleLangSelect(lang)}
                >
                  <span className="help-center-nav-lang-check">
                    {selectedLang === lang && <ModusWcIcon name="check" size="sm" decorative />}
                  </span>
                  <span>{lang}</span>
                </div>
              ))}
            </div>
          </div>
        </ModusWcDropdownMenu>
        <div
          role="button"
          tabIndex={0}
          className="help-center-nav-split-buttons-wrapper"
          onClick={() => { setMobileMenuOpen(false); setDrawerOpen(true); }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setMobileMenuOpen(false);
              setDrawerOpen(true);
            }
          }}
          aria-label="Open Trimble menu"
        >
          <div className="help-center-nav-split-buttons">
            <ModusWcButtonGroup variant="filled" color="primary">
              <ModusWcButton variant="filled" size="sm" shape="square" customClass="help-center-nav-chevron-btn" aria-hidden="true">
                <ModusWcIcon name="chevron_left" size="xs" decorative />
              </ModusWcButton>
              <ModusWcButton variant="filled" color="primary" size="sm" shape="square" customClass="help-center-nav-logo-btn" aria-hidden="true">
                <span className="help-center-nav-trimble-logo" style={{ display: 'inline-flex', width: 24, height: 24, flexShrink: 0 }}>
                  <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.9833 11.7667C11.9 11.0417 11.7333 10.325 11.4667 9.65005C10.8847 9.87937 10.2502 9.94158 9.63476 9.82968C9.01931 9.71778 8.44735 9.43622 7.98333 9.01672C7.29166 9.73338 6.675 10.525 6.13333 11.3584C7.725 12.6584 10.3417 13 11.9833 11.7667ZM8 7.92505C8.49166 7.46672 9.025 7.04172 9.58333 6.66672C9.07648 6.20068 8.48145 5.84083 7.83333 5.60838C7.36666 6.33338 7.43333 7.28338 8 7.93338M10.1667 6.25005C10.55 5.96672 10.95 5.74172 11.3917 5.56672C11.0065 5.19176 10.5157 4.94367 9.98541 4.85577C9.45509 4.76788 8.91056 4.8444 8.425 5.07505C9.06666 5.35838 9.65833 5.75838 10.1667 6.25005ZM4.95 5.44172C3.83333 7.02505 4.35833 9.33338 5.65 10.7834C6.20415 9.93861 6.83456 9.1464 7.53333 8.41672C6.81666 7.58338 6.675 6.40005 7.2 5.42505C6.45833 5.24172 5.68333 5.25005 4.95 5.44172ZM7.66666 4.70838C8.15833 4.35838 8.74166 4.16672 9.34166 4.15005C8.10833 3.94172 6.84166 4.08338 5.68333 4.56672C6.35 4.49172 7.025 4.54172 7.66666 4.70838ZM11.225 8.95005C10.925 8.31672 10.5417 7.73338 10.0917 7.20838C9.525 7.58338 8.99166 8.00838 8.49166 8.46672C9.24166 9.12505 10.3 9.31672 11.225 8.95005ZM12.85 7.19172C12.9583 7.95838 12.6583 8.72505 12.0667 9.23338C12.3083 9.85005 12.4917 10.4834 12.6 11.1334C12.9879 10.5578 13.2156 9.88921 13.2595 9.19645C13.3035 8.50369 13.1621 7.81174 12.85 7.19172ZM12.7083 12.1167C12.725 12.5917 12.7083 13.075 12.6417 13.55C13.5185 12.4257 13.9408 11.0129 13.825 9.59172C13.7417 10.5334 13.35 11.4167 12.7083 12.1167ZM17.5 10L14.1917 8.08338C14.5833 9.33338 14.575 10.6667 14.175 11.9167L17.5 10ZM5.8 12.075C5.31666 12.8667 4.95833 13.7334 4.75 14.6417C5.76089 15.4035 6.99763 15.805 8.2632 15.7823C9.52876 15.7597 10.7503 15.3142 11.7333 14.5167C11.9583 13.9334 12.0667 13.3084 12.05 12.6834C11.0603 13.1946 9.94397 13.4091 8.83526 13.3012C7.72654 13.1933 6.67257 12.7675 5.8 12.075ZM5.28333 11.475C4.62811 10.8079 4.15232 9.98589 3.90026 9.08543C3.64819 8.18498 3.62803 7.23539 3.84166 6.32505C2.92075 7.41134 2.44354 8.80505 2.50533 10.2278C2.56712 11.6506 3.16338 12.9977 4.175 14C4.43333 13.1084 4.80833 12.2584 5.29166 11.475M6.8 3.56672L3.50833 1.67505V5.46672C4.38504 4.51282 5.53442 3.85229 6.8 3.57505V3.56672ZM3.50833 18.325L6.825 16.4084C5.55009 16.1319 4.39172 15.4683 3.50833 14.5084V18.325Z" fill="#ffffff"/>
                    <path d="M11.8 6.12505C12.3333 6.83338 12.325 7.81671 11.775 8.51671C11.475 7.90005 11.0916 7.32505 10.65 6.80005C11 6.52505 11.3833 6.29171 11.8 6.12505Z" fill="#ffffff"/>
                  </svg>
                </span>
              </ModusWcButton>
            </ModusWcButtonGroup>
          </div>
        </div>
      </div>
      </div>
      </div>
      {searchOverlayOpen && (
        <>
          <div className="help-center-nav-search-overlay-backdrop" onClick={() => setSearchOverlayOpen(false)} aria-hidden="true" />
          <div className="help-center-nav-search-overlay" role="dialog" aria-label="Search" aria-modal="true">
            <div className="help-center-nav-search-overlay-inner">
              <div className="help-center-nav-search-overlay-content">
                <div className="help-center-nav-search-overlay-top-row">
                  <div className="help-center-nav-search-overlay-main">
                    <div className="help-center-nav-search-overlay-container">
                      <form className="help-center-nav-search-overlay-input-row" onSubmit={(e) => { e.preventDefault(); const q = overlaySearchValue.trim(); if (q && !recentSearches.includes(q)) setRecentSearches((prev) => [q, ...prev].slice(0, 5)); setSearchValue(q); setSearchOverlayOpen(false); }}>
                        <div className="help-center-nav-search-overlay-input-wrapper">
                          <ModusWcTextInput type="search" includeSearch={false} includeClear={false} bordered={false} placeholder="Products, industries, support, news and more..." size="lg" value={overlaySearchValue} onInputChange={(e) => setOverlaySearchValue(e.detail?.target?.value || '')} customClass="help-center-nav-search-overlay-input" />
                        </div>
                      </form>
                    </div>
                    <div className="help-center-nav-search-overlay-body">
                      <div className="help-center-nav-search-overlay-columns">
                        <div className="help-center-nav-search-overlay-column">
                          <ModusWcTypography hierarchy="p" size="xl" weight="semibold" label="Your Recent Searches" customClass="help-center-nav-search-overlay-heading !m-0" />
                          {recentSearches.length === 0 ? (
                            <ModusWcTypography hierarchy="p" size="sm" label="No recent searches" customClass="text-[var(--modus-wc-color-base-content-low-contrast)] !m-0" />
                          ) : (
                            <ul className="help-center-nav-search-overlay-list list-none p-0 m-0">
                              {recentSearches.map((term, i) => (
                                <li key={i}>
                                  <button type="button" className="help-center-nav-search-overlay-link" onClick={() => { setOverlaySearchValue(term); const q = term; if (q && !recentSearches.includes(q)) setRecentSearches((prev) => [q, ...prev].slice(0, 5)); setSearchValue(q); setSearchOverlayOpen(false); }}>{term}</button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <div className="help-center-nav-search-overlay-column">
                          <ModusWcTypography hierarchy="p" size="xl" weight="semibold" label="Common Searches" customClass="help-center-nav-search-overlay-heading !m-0" />
                          <ul className="help-center-nav-search-overlay-list list-none p-0 m-0">
                            {commonSearches.map((item, i) => (
                              <li key={i}>
                                <a href={item.href} target="_blank" rel="noopener noreferrer" className="help-center-nav-search-overlay-link" onClick={() => setSearchOverlayOpen(false)}>{item.label}</a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <ModusWcButton type="button" variant="borderless" color="tertiary" size="sm" shape="square" customClass="help-center-nav-search-overlay-close" onButtonClick={() => setSearchOverlayOpen(false)} aria-label="Close search">
                    <ModusWcIcon name="close" size="lg" decorative={false} aria-label="Close" />
                  </ModusWcButton>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {drawerOpen && (
        <>
          <div className="help-center-nav-drawer-backdrop" onClick={() => setDrawerOpen(false)} aria-hidden="true" />
          <aside className="help-center-nav-drawer" role="dialog" aria-label="Trimble account menu">
            <div className="help-center-nav-drawer-header">
              <div className="help-center-nav-drawer-logo py-1">
                <HelpCenterTrimbleLogo />
              </div>
              <ModusWcButton variant="borderless" color="tertiary" size="sm" shape="square" customClass="help-center-nav-drawer-close" onButtonClick={() => setDrawerOpen(false)} aria-label="Close menu">
                <ModusWcIcon name="close" size="md" decorative={false} aria-label="Close" />
              </ModusWcButton>
            </div>
            <div className="help-center-nav-drawer-body">
              <ModusWcButton variant="outlined" size="md" customClass="help-center-nav-drawer-btn" onButtonClick={() => setDrawerOpen(false)}>
                SIGN IN
              </ModusWcButton>
              <ModusWcButton variant="outlined" size="md" customClass="help-center-nav-drawer-btn" onButtonClick={() => setDrawerOpen(false)}>
                CREATE ACCOUNT
              </ModusWcButton>
              <div className="help-center-nav-drawer-section">
                <ModusWcTypography hierarchy="p" size="sm" weight="semibold" label="EXPLORE TRIMBLE" customClass="help-center-nav-drawer-heading" />
                <nav className="help-center-nav-drawer-links">
                  <a href="https://www.trimble.com/en/support" target="_blank" rel="noopener noreferrer" className="help-center-nav-drawer-link" onClick={() => setDrawerOpen(false)}>Support<ModusWcIcon name="launch" size="sm" decorative={false} aria-label="External" /></a>
                  <a href="https://networkcommunity.trimble.com/private/login" target="_blank" rel="noopener noreferrer" className="help-center-nav-drawer-link" onClick={() => setDrawerOpen(false)}>The Network<ModusWcIcon name="launch" size="sm" decorative={false} aria-label="External" /></a>
                  <a href="https://www.trimble.com/en/contact-sales" target="_blank" rel="noopener noreferrer" className="help-center-nav-drawer-link" onClick={() => setDrawerOpen(false)}>Contact sales<ModusWcIcon name="launch" size="sm" decorative={false} aria-label="External" /></a>
                  <a href="https://www.trimble.com" target="_blank" rel="noopener noreferrer" className="help-center-nav-drawer-link" onClick={() => setDrawerOpen(false)}>Trimble.com<ModusWcIcon name="launch" size="sm" decorative={false} aria-label="External" /></a>
                </nav>
              </div>
            </div>
          </aside>
        </>
      )}
    </header>
  );
}

export default HelpCenterNavigation;
