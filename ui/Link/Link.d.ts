type LinkAppearanceType = 'default' | 'underline' | 'gray'
export interface LinkI {
  title: string
  href?: string
  appearance?: LinkAppearanceType
  className?: string
  onClick?: () => void
}
