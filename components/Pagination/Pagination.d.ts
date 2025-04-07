import { PaginationI } from '@/interfaces/api'

export interface PaginationProps extends PaginationI {
  className?: string
  onPageChange: (page: number) => void
  isLoading?: boolean
}
