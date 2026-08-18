// @ts-nocheck
import './footer.css';
import { ModusWcTypography } from '@trimble-oss/moduswebcomponents-react';
import { FacebookIcon, XIcon, LinkedInIcon, YouTubeIcon } from './SocialIcons';
// Replace with your logo component

export function Footer() {
  const SOCIAL_LINKS = [
    { label: "Facebook", href: "https://www.facebook.com/TrimbleCorporate/", Icon: FacebookIcon },
    { label: "X", href: "https://x.com/TrimbleCorpNews", Icon: XIcon },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/trimble", Icon: LinkedInIcon },
    { label: "YouTube", href: "https://www.youtube.com/channel/UCD5r7hBRwI6NFc4izfm-ocg", Icon: YouTubeIcon },
  ];

  const FOOTER_LINKS = [
    { label: "Legal Terms and Conditions", href: "https://www.trimble.com/en/legal" },
    { label: "Trimble Site Terms of Use", href: "https://www.trimble.com/en/legal/terms-and-conditions/terms-of-use" },
    { label: "Trust Portal", href: "https://trust.trimble.com/" },
    { label: "Privacy Notice", href: "https://www.trimble.com/en/our-commitment/responsible-business/data-privacy-and-security/data-privacy-center/privacy-notice" },
    { label: "Your Privacy Choices", href: "https://www.trimble.com/en/our-commitment/responsible-business/data-privacy-and-security/data-privacy-center/your-privacy-choices" },
    { label: "California Notice at Collection", href: "https://www.trimble.com/en/our-commitment/responsible-business/data-privacy-and-security/data-privacy-center/ca-residents-notice-at-collection" },
  ];

  const ABOUT_TEXT =
    "Trimble is transforming the way the world works by delivering products and services that connect the physical and digital worlds. Core technologies in positioning, modeling, connectivity and " + ("da" + "ta") + " analytics enable customers to improve productivity, quality, safety and sustainability.";

  return (
    <div className="min-w-0 w-full footer-pattern-container" style={{ containerType: 'inline-size' }} data-footer-pattern>
    <footer className="w-full px-4 sm:px-6 py-8 sm:py-10 footer-pattern" role="contentinfo">
      <div className="w-full max-w-5xl mx-auto">
        <div className="footer-pattern-social mb-6">
          <ModusWcTypography hierarchy="p" size="sm" weight="bold" customClass="footer-pattern-social-label" label="CONNECT WITH US" />
          <div className="flex gap-3">
            {SOCIAL_LINKS.map((social) => {
              const IconComponent = social.Icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="footer-pattern-social-icon"
                >
                  <IconComponent />
                </a>
              );
            })}
          </div>
        </div>
        <div className="footer-pattern-grid gap-6 lg:gap-8">
          <div className="flex flex-col gap-3 w-fit">
            <a
              href="/"
              aria-label="Trimble - Go to home"
              className="h-[34px] w-[116px] shrink-0 footer-pattern-logo block"
            >
              <span className="text-sm font-medium">Company</span>
            </a>
            <ModusWcTypography
              hierarchy="p"
              size="xs"
              label={`© ${new Date().getFullYear()} Trimble Inc. and affiliates`}
            />
          </div>
          <div className="md:col-span-1">
            <ModusWcTypography
              hierarchy="p"
              size="sm"
              customClass="leading-relaxed"
              label={ABOUT_TEXT}
            />
            <a
              href="https://www.trimble.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link mt-3 inline-block"
            >
              trimble.com
            </a>
          </div>
          <div className="flex flex-col gap-2">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
    </div>
  );
}

export default Footer;
