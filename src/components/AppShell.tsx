import { SideNav } from './SideNav'
import { TopNav } from './TopNav'
import styles from './AppShell.module.css'
import type { ReactNode } from 'react'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className={styles.app}>
      <TopNav />
      <div className={styles.body}>
        <SideNav />
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  )
}
