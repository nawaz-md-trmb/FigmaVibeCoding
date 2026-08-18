// @ts-nocheck
import './help-center-navigation.css';
import React from 'react';
import {
  ModusWcCard,
  ModusWcTypography,
  ModusWcIcon,
  ModusWcButton,
} from '@trimble-oss/moduswebcomponents-react';

/** Left column menu item - link or expandable button */
export interface HelpCenterNavMegaMenuItem {
  label: string;
  href?: string;
  onClick?: () => void;
  /** When true, shows chevron and expands middle column on click */
  hasSubMenu?: boolean;
  subMenuId?: string;
}

/** Middle column sub-nav item (shown when a left item with hasSubMenu is expanded) */
export interface HelpCenterNavMegaMenuSubItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

/** Featured card in the right column */
export interface HelpCenterNavMegaMenuFeaturedCard {
  imageSrc?: string;
  imageAlt?: string;
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
}

export interface HelpCenterNavMegaMenuContent {
  leftItems: HelpCenterNavMegaMenuItem[];
  /** Middle items when a single expandable is used (e.g. WHY SKETCHUP? What's New) */
  middleItems?: HelpCenterNavMegaMenuSubItem[];
  /** Middle items keyed by subMenuId when multiple expandables (e.g. RESOURCES Learn/Support/Connect) */
  middleItemsBySubMenu?: Record<string, HelpCenterNavMegaMenuSubItem[]>;
  featuredCard?: HelpCenterNavMegaMenuFeaturedCard;
}

export interface HelpCenterNavMegaMenuProps {
  open: boolean;
  onClose: () => void;
  content: HelpCenterNavMegaMenuContent;
  expandedSubMenu: string | null;
  onExpandedSubMenuChange: (subMenuId: string | null) => void;
  /** When true, disables collapse animation (used when switching between nav items) */
  isSwitchingNav?: boolean;
}

export function HelpCenterNavMegaMenu({
  open,
  onClose,
  content,
  expandedSubMenu,
  onExpandedSubMenuChange,
  isSwitchingNav = false,
}: HelpCenterNavMegaMenuProps) {
  if (!open) return null;

  const { leftItems, middleItems = [], middleItemsBySubMenu = {}, featuredCard } = content;
  const hasExpandedSubMenu = expandedSubMenu != null;
  const resolvedMiddleItems =
    expandedSubMenu && middleItemsBySubMenu[expandedSubMenu]
      ? middleItemsBySubMenu[expandedSubMenu]
      : middleItems;
  const hasMiddleContent = resolvedMiddleItems.length > 0;

  return (
    <>
      <div
        className="help-center-nav-mega-menu-backdrop"
        onClick={() => {
          onClose();
          onExpandedSubMenuChange(null);
        }}
        aria-hidden="true"
      />
      <div className={'help-center-nav-mega-menu-dropdown' + (isSwitchingNav ? ' help-center-nav-mega-menu-switching' : '')}>
        <ModusWcCard
          bordered={true}
          customClass={
            'help-center-nav-mega-menu-card help-center-nav-mega-menu-card-page-bg ' +
            (hasExpandedSubMenu && hasMiddleContent ? 'help-center-nav-mega-menu-card-expanded' : '')
          }
        >
          <div className="help-center-nav-mega-menu-grid">
            <div className="help-center-nav-mega-menu-left">
              {leftItems.map((item, idx) => {
                if (item.hasSubMenu) {
                  const isActive = expandedSubMenu === item.subMenuId;
                  return (
                    <button
                      key={idx}
                      type="button"
                      className={
                        'help-center-nav-mega-menu-item help-center-nav-mega-menu-item-with-sub ' +
                        (isActive ? 'help-center-nav-mega-menu-item-active' : '')
                      }
                      onClick={() =>
                        onExpandedSubMenuChange(isActive ? null : (item.subMenuId ?? null))
                      }
                    >
                      <ModusWcTypography
                        hierarchy="p"
                        size="md"
                        weight={isActive ? 'bold' : 'regular'}
                        label={item.label}
                        customClass="help-center-nav-mega-menu-item-label !m-0 text-[var(--modus-wc-color-base-content)]"
                      />
                      <ModusWcIcon
                        name="chevron_right"
                        size="sm"
                        decorative
                        customClass="help-center-nav-mega-menu-item-chevron"
                      />
                    </button>
                  );
                }
                if (item.href) {
                  const isExternal = item.href.startsWith('http');
                  return (
                    <a
                      key={idx}
                      href={item.href}
                      className="help-center-nav-mega-menu-item"
                      {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
                      onClick={() => {
                        onClose();
                        onExpandedSubMenuChange(null);
                      }}
                    >
                      <ModusWcTypography
                        hierarchy="p"
                        size="md"
                        label={item.label}
                        customClass="help-center-nav-mega-menu-item-label !m-0 text-[var(--modus-wc-color-base-content)]"
                      />
                    </a>
                  );
                }
                return (
                  <button
                    key={idx}
                    type="button"
                    className="help-center-nav-mega-menu-item"
                    onClick={() => {
                      item.onClick?.();
                      onClose();
                      onExpandedSubMenuChange(null);
                    }}
                  >
                    <ModusWcTypography
                      hierarchy="p"
                      size="md"
                      label={item.label}
                      customClass="help-center-nav-mega-menu-item-label !m-0 text-[var(--modus-wc-color-base-content)]"
                    />
                  </button>
                );
              })}
            </div>
            <div
              className={
                'help-center-nav-mega-menu-middle ' +
                (hasExpandedSubMenu && hasMiddleContent ? 'help-center-nav-mega-menu-middle-expanded' : '')
              }
            >
              {resolvedMiddleItems.map((subItem, idx) => {
                const href = subItem.href ?? '#';
                const isExternal = href.startsWith('http');
                return (
                <a
                  key={idx}
                  href={href}
                  className="help-center-nav-mega-menu-sub-nav-item"
                  {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
                  onClick={() => {
                    subItem.onClick?.();
                    onClose();
                    onExpandedSubMenuChange(null);
                  }}
                >
                  <ModusWcTypography
                    hierarchy="p"
                    size="md"
                    label={subItem.label}
                    customClass="help-center-nav-mega-menu-sub-nav-label !m-0 text-[var(--modus-wc-color-base-content)]"
                  />
                  <ModusWcIcon
                    name="chevron_right"
                    size="sm"
                    decorative
                    customClass="help-center-nav-mega-menu-sub-nav-chevron"
                  />
                </a>
              );
              })}
            </div>
            <div className="help-center-nav-mega-menu-right">
              {featuredCard && (
                <ModusWcCard bordered={false} customClass="help-center-nav-mega-menu-featured-card">
                  {featuredCard.imageSrc && (
                    <div slot="header" className="help-center-nav-mega-menu-featured-image">
                      <img
                        src={featuredCard.imageSrc}
                        alt={featuredCard.imageAlt ?? featuredCard.title}
                        className="help-center-nav-mega-menu-featured-img"
                      />
                    </div>
                  )}
                  <ModusWcTypography
                    slot="title"
                    hierarchy="h4"
                    size="md"
                    weight="semibold"
                    label={featuredCard.title}
                    customClass="help-center-nav-mega-menu-featured-title !m-0 uppercase text-[var(--modus-wc-color-base-content)]"
                  />
                  <div className="help-center-nav-mega-menu-featured-content">
                    {featuredCard.description && (
                      <ModusWcTypography
                        hierarchy="p"
                        size="sm"
                        label={featuredCard.description}
                        customClass="help-center-nav-mega-menu-featured-desc !m-0 mt-2 text-[var(--modus-wc-color-base-content)]"
                      />
                    )}
                    {(featuredCard.ctaLabel || featuredCard.onCtaClick || featuredCard.ctaHref) && (
                      <div className="help-center-nav-mega-menu-featured-cta">
                        {featuredCard.ctaLabel && (
                          <ModusWcTypography
                            hierarchy="p"
                            size="sm"
                            label={featuredCard.ctaLabel}
                            customClass="help-center-nav-mega-menu-featured-link !m-0 text-[var(--modus-wc-color-base-content)]"
                          />
                        )}
                        <ModusWcButton
                          variant="filled"
                          color="secondary"
                          size="sm"
                          shape="square"
                          customClass="help-center-nav-mega-menu-featured-btn"
                          onButtonClick={() => {
                            featuredCard.onCtaClick?.();
                            if (featuredCard.ctaHref) {
                              const isExternal = featuredCard.ctaHref.startsWith('http');
                              if (isExternal) {
                                window.open(featuredCard.ctaHref, '_blank', 'noopener,noreferrer');
                              } else {
                                window.location.href = featuredCard.ctaHref;
                              }
                            }
                          }}
                        >
                          <ModusWcIcon name="chevron_right" decorative />
                        </ModusWcButton>
                      </div>
                    )}
                  </div>
                </ModusWcCard>
              )}
            </div>
          </div>
        </ModusWcCard>
      </div>
    </>
  );
}
