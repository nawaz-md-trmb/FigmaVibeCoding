import costIcon from '../assets/icons/nav-cost.svg'
import drawingsIcon from '../assets/icons/nav-drawings.svg'
import estimatesIcon from '../assets/icons/nav-estimates.svg'
import projectsIcon from '../assets/icons/nav-projects.svg'
import settingsIcon from '../assets/icons/nav-settings.svg'
import { Icon } from './Icon'
import styles from './SideNav.module.css'

const ITEMS = [
  { id: 'cost', icon: costIcon, label: 'Cost Libraries' },
  { id: 'estimates', icon: estimatesIcon, label: 'Estimates' },
  { id: 'drawings', icon: drawingsIcon, label: 'Drawings' },
  { id: 'projects', icon: projectsIcon, label: 'Projects' },
] as const

export function SideNav() {
  return (
    <nav className={styles.rail} aria-label="Primary" aria-disabled="true">
      <div className={styles.top}>
        {ITEMS.map((item) => (
          <div key={item.id} className={styles.item}>
            <Icon src={item.icon} alt="" />
            <span className={styles.label}>{item.label}</span>
          </div>
        ))}
      </div>
      <div className={styles.item}>
        <Icon src={settingsIcon} alt="" />
        <span className={styles.label}>Settings</span>
      </div>
    </nav>
  )
}
