import { ModusWcButton } from '@trimble-oss/moduswebcomponents-react'
import accountIcon from '../assets/icons/account.svg'
import helpIcon from '../assets/icons/help.svg'
import logo from '../assets/icons/logo.svg'
import menuIcon from '../assets/icons/menu.svg'
import { Icon } from './Icon'
import styles from './TopNav.module.css'

export function TopNav() {
  return (
    <header className={styles.nav}>
      <div className={styles.left}>
        <ModusWcButton
          color="neutral"
          variant="borderless"
          size="sm"
          shape="square"
          aria-label="Menu"
        >
          <Icon src={menuIcon} alt="" />
        </ModusWcButton>
        <img className={styles.logo} src={logo} alt="Estimation Construct" width={229} height={24} />
      </div>
      <div className={styles.right}>
        <ModusWcButton
          color="neutral"
          variant="borderless"
          size="sm"
          shape="square"
          aria-label="Help"
        >
          <Icon src={helpIcon} alt="" />
        </ModusWcButton>
        <button type="button" className={styles.avatar} aria-label="Account">
          <Icon src={accountIcon} alt="" size={20} />
        </button>
      </div>
    </header>
  )
}
