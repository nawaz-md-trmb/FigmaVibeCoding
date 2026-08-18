// @ts-nocheck
import './help-center-mega-menu.css';
import { useState } from 'react';
import { ModusWcTypography } from '@trimble-oss/moduswebcomponents-react';
import { HelpCenterNavMegaMenu, type HelpCenterNavMegaMenuContent } from './HelpCenterNavMegaMenu';

export function HelpCenterMegaMenuPreview() {
  const [open, setOpen] = useState(true);
  const [expandedSubMenu, setExpandedSubMenu] = useState<string | null>(null);

  const content: HelpCenterNavMegaMenuContent = {
    leftItems: [
      { label: 'Learn', hasSubMenu: true, subMenuId: 'learn' },
      { label: 'Support', hasSubMenu: true, subMenuId: 'support' },
      { label: 'Connect', hasSubMenu: true, subMenuId: 'connect' },
      { label: 'Training', href: 'https://learn.trimble.com/learn/public/catalog/view/913' },
    ],
    middleItemsBySubMenu: {
      learn: [
        { label: 'Blog', href: 'https://sketchup.trimble.com/blog/en-US' },
        { label: 'Trimble Learn', href: 'https://learn.trimble.com/pages/902/sketchup' },
        { label: 'Quick Learning', href: 'https://learn.trimble.com/learn/public/catalog/view/913' },
        { label: 'Release Notes', href: 'https://help.sketchup.com/en/sketchup-desktop-20261' },
      ],
      support: [
        { label: 'SketchUp Help', href: 'https://sketchup.trimble.com/en/help' },
        { label: 'Contact Us', href: 'https://sketchup.trimble.com/en/help/contact-us' },
      ],
      connect: [
        { label: 'Forum', href: 'https://forums.sketchup.com/' },
        { label: "Pre-built 3D Models", href: 'https://3dwarehouse.sketchup.com/' },
      ],
    },
    featuredCard: {
      imageSrc: '/assets/resources-where-ideas.png',
      imageAlt: 'Where ideas come to life - sustainable urban design',
      title: 'WHERE IDEAS COME TO LIFE',
      description:
        'Explore how designers leverage SketchUp to visualize and inspire.',
      ctaLabel: 'Learn More',
      ctaHref: 'https://sketchup.trimble.com/en/help',
    },
  };

  return (
    <div className="relative min-h-[400px] overflow-visible w-full">
      <div className="help-center-nav help-center-nav-container help-center-mega-menu-pattern-preview min-w-0 w-full bg-[var(--modus-wc-color-base-page)] border border-[var(--modus-wc-color-base-200)] rounded-lg overflow-visible" data-help-center-nav style={{ containerType: 'inline-size', containerName: 'help-center-nav' }}>
        <div className="help-center-nav-mega-menu-root relative">
          <div className="help-center-mega-menu-pattern-preview-trigger flex items-center justify-between p-4 border-b border-[var(--modus-wc-color-base-200)] bg-[var(--modus-wc-color-base-100)] relative">
            <ModusWcTypography hierarchy="p" size="lg" weight="semibold" label="Resources" customClass="!m-0 text-[var(--modus-wc-color-base-content)]" />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-haspopup="true"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-[var(--modus-wc-color-base-200)] bg-transparent text-[var(--modus-wc-color-base-content)] hover:bg-[var(--modus-wc-color-base-200)] transition-colors"
            >
              {open ? 'Close menu' : 'Open mega menu'}
            </button>
          </div>
          {open && (
            <HelpCenterNavMegaMenu
              open={open}
              onClose={() => setOpen(false)}
              content={content}
              expandedSubMenu={expandedSubMenu}
              onExpandedSubMenuChange={setExpandedSubMenu}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default HelpCenterMegaMenuPreview;
