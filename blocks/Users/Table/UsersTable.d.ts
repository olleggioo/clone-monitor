import { UserI } from '@/interfaces'

export interface UsersTableI {
  view: string
  currentViewUsers: UserI[]
  isLoading?: boolean
}
