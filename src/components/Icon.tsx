import styles from './Icon.module.css'

interface IconProps {
  src: string
  alt?: string
  size?: number
}

export function Icon({ src, alt = '', size = 24 }: IconProps) {
  return (
    <span className={styles.icon} style={{ width: size, height: size }}>
      <img src={src} alt={alt} width={size} height={size} />
    </span>
  )
}
