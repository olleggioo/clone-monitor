import { StatusType } from '@/interfaces/common'
import { DropdownItemI } from '@/ui/Dropdown/Dropdown'
import { IconType } from '@/helpers/renderIcon'

export type CellAlignType = 'left' | 'center' | 'right'

export interface TableCellI {
  onClick?: (evt: MouseEvent<HTMLDivElement>) => void,
  onLink?: (url: string, ip: string) => void,
  url?: string,
  title: string
  accessor?: string
  description?: string
  additionalDescription?: string
  place?: string
  status?: StatusType
  icon?: IconType
  width?: number
  align?: CellAlignType
  bold?: boolean
  isLoading?: boolean
  state?: any
  userId?: string
  gap?: number
}

export interface TableHeadCellI {
  title?: string
  accessor: string
  width?: number
  align?: CellAlignType
  onClick?: () => void
  gap?: number
  flagCopy?: boolean
}

interface TableRowI {
  id: string
  userId?: string
  isReserved?: boolean
  columns: TableCellI[]
  isLoading?: boolean
  dropdownItems?: DropdownItemI[]
  onClick?: () => void,
  selectedAll?: boolean,
  required?: boolean,
  requiredAction?: boolean
  devicesId?: any
  changePoolStatusVerbose?: any
  lastSeenNormal?: any
}

export interface TableI {
  columns: TableHeadCellI[]
  rows: TableRowI[]
  isLoading?: boolean
  dropdownItems?: DropdownItemI[]
  required?: boolean
  reqSort?: boolean
  className?: any
  requiredAction?: boolean
}
