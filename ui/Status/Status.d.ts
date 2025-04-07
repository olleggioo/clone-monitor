import { StatusItemI } from '@/interfaces/common'

export interface StatusI extends StatusItemI {
  tagName: 'span' | 'p' | 'li'
  className?: string
  onClick?: (evt: MouseEvent<HTMLDivElement>) => void
}
