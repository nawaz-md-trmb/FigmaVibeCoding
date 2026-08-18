import chevronIcon from '../assets/icons/chevron-down.svg'
import libraryIcon from '../assets/icons/library.svg'
import { Icon } from './Icon'
import styles from './TermsAccordion.module.css'

const FULL_TERMS = `These Terms of Service govern your access to and use of Estimation Construct.

1. Data & Privacy. We collect usage data and account information to operate the service. Your data is never sold to third parties. You retain ownership of all project data you create.

2. Usage Rights. You receive a non-exclusive license to use Estimation Construct for your internal business purposes. You may not resell, sublicense, or reverse-engineer the platform.

3. Intellectual Property. All platform features, designs, and software remain property of Estimation Construct. Content you create belongs to you. Feedback you submit may be used to improve the product.

4. Billing & Termination. Subscriptions renew automatically unless cancelled before the renewal date. You may terminate your account at any time. Refunds are available within 14 days of renewal.

5. Liability & Warranties. The service is provided "as is." We are not liable for indirect or consequential damages. Our total liability to you is limited to fees paid in the last 12 months.

6. Updates to Terms. We may update these terms with 30 days notice via email. Continued use after that period constitutes acceptance. Material changes will always be communicated directly.`

interface TermsAccordionProps {
  expanded: boolean
  onToggle: () => void
}

export function TermsAccordion({ expanded, onToggle }: TermsAccordionProps) {
  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={styles.header}
        aria-expanded={expanded}
        onClick={onToggle}
      >
        <span className={styles.label}>
          <Icon src={libraryIcon} alt="" />
          Read the Terms of Service
        </span>
        <span className={`${styles.chevron} ${expanded ? styles.open : ''}`}>
          <Icon src={chevronIcon} alt="" />
        </span>
      </button>
      {expanded ? (
        <div className={styles.panel}>
          {FULL_TERMS.split('\n\n').map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>
      ) : null}
    </div>
  )
}
