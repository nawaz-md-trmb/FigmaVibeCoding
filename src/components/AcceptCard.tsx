import { ModusWcButton, ModusWcCheckbox } from '@trimble-oss/moduswebcomponents-react'
import checkIcon from '../assets/icons/check.svg'
import { Icon } from './Icon'
import styles from './AcceptCard.module.css'

interface AcceptCardProps {
  agreed: boolean
  onAgreedChange: (agreed: boolean) => void
  onDecline: () => void
  onAccept: () => void
}

export function AcceptCard({ agreed, onAgreedChange, onDecline, onAccept }: AcceptCardProps) {
  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Data & Privacy</h2>
      <div className={styles.agree}>
        <ModusWcCheckbox
          inputId="agree-tos"
          value={agreed}
          onInputChange={() => onAgreedChange(!agreed)}
        />
        <label htmlFor="agree-tos" className={styles.copy}>
          I have read and agree to the Terms of Service, including the data handling, usage
          rights, and billing policies described above.
        </label>
      </div>
      <div className={styles.actions}>
        <ModusWcButton color="primary" variant="outlined" size="sm" onButtonClick={onDecline}>
          Decline & Sign out
        </ModusWcButton>
        <div className={styles.acceptWrap}>
          <ModusWcButton
            color="primary"
            variant="filled"
            size="sm"
            disabled={!agreed}
            onButtonClick={onAccept}
          >
            <Icon src={checkIcon} alt="" size={24} />
            Accept & Continue
          </ModusWcButton>
        </div>
      </div>
    </section>
  )
}
