import { ReactNode } from 'react'

type StatsItemAppearanceType = 'default' | 'purple'

export interface StatCardI {
  title?: string
  icon?: ReactNode
  value?: string
  unit?: string
  appearance?: StatsItemAppearanceType
  isLoading?: boolean
  className?: string
  additionalValue?: string
  additionalUnit?: string
}
