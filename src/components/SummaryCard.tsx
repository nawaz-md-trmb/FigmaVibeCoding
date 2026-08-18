import styles from './SummaryCard.module.css'

interface SummaryCardProps {
  title: string
  description: string
}

export function SummaryCard({ title, description }: SummaryCardProps) {
  return (
    <article className={styles.card}>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  )
}
