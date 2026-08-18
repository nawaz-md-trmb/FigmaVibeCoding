import { useState } from 'react'
import permissionsIcon from '../assets/icons/permissions.svg'
import { AcceptCard } from './AcceptCard'
import { SummaryCard } from './SummaryCard'
import { TermsAccordion } from './TermsAccordion'
import styles from './TermsPage.module.css'

const CARDS = [
  {
    title: 'Data & Privacy',
    description:
      'We collect usage data and account information to operate the service. Your data is never sold to third parties. You retain ownership of all project data you create.',
  },
  {
    title: 'Usage Rights',
    description:
      'You receive a non-exclusive license to use Estimation Construct for your internal business purposes. You may not resell, sublicense, or reverse-engineer the platform.',
  },
  {
    title: 'Intellectual Property',
    description:
      'All platform features, designs, and software remain property of Estimation Construct. Content you create belongs to you. Feedback you submit may be used to improve the product.',
  },
  {
    title: 'Billing & Termination',
    description:
      'Subscriptions renew automatically unless cancelled before the renewal date. You may terminate your account at any time. Refunds are available within 14 days of renewal.',
  },
  {
    title: 'Liability & Warranties',
    description: `The service is provided "as is." We are not liable for indirect or consequential damages. Our total liability to you is limited to fees paid in the last 12 months.`,
  },
  {
    title: 'Updates to Terms',
    description:
      'We may update these terms with 30 days notice via email. Continued use after that period constitutes acceptance. Material changes will always be communicated directly.',
  },
]

export function TermsPage() {
  const [agreed, setAgreed] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [accepted, setAccepted] = useState(false)

  const handleDecline = () => {
    setAgreed(false)
    setAccepted(false)
    setExpanded(false)
  }

  return (
    <div className={styles.page}>
      <div className={styles.chip}>
        <span className={styles.chipIcon}>
          <img src={permissionsIcon} alt="" width={16} height={16} />
        </span>
        <span className={styles.chipLabel}>Step 1 of 1 — Required before continuing</span>
      </div>
      <h1 className={styles.title}>Terms of Service</h1>
      <p className={styles.intro}>
        Before you begin, please review the key points below. These summarize what you're agreeing
        to — tap any card to learn more, or read the full document at the bottom.
      </p>
      <div className={styles.grid}>
        {CARDS.map((card) => (
          <SummaryCard key={card.title} title={card.title} description={card.description} />
        ))}
      </div>
      <div className={styles.accordion}>
        <TermsAccordion expanded={expanded} onToggle={() => setExpanded((value) => !value)} />
      </div>
      <div className={styles.accept}>
        {accepted ? (
          <div className={styles.accepted}>
            <h2>You have accepted the Terms of Service</h2>
            <p>You can continue using Estimation Construct.</p>
          </div>
        ) : (
          <AcceptCard
            agreed={agreed}
            onAgreedChange={setAgreed}
            onDecline={handleDecline}
            onAccept={() => setAccepted(true)}
          />
        )}
      </div>
      <p className={styles.footer}>
        Questions? Contact{' '}
        <a href="mailto:legal@estimationconstruct.com">legal@estimationconstruct.com</a>
      </p>
    </div>
  )
}
