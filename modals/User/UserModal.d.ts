import { OptionItemI } from '@/ui/CustomSelect/CustomSelect'

export type UserModalFieldType =
  | 'login'
  | 'password'
  | 'fullname'
  | 'email'
  | 'roleId'
  | 'phone'
  | 'role'
  | 'contract'

export interface UserModalStateI {
  id?: string
  fullname?: string
  email: string
  roleId?: string
  phone: string
  contract?: string
}

export interface UserModalI {
  onClose: () => void
}

export interface AddUserModalStateI extends UserModalStateI {
  login: string
  password: string
}

export interface EditUserModalI extends UserModalI {
  initialState: UserModalStateI
}
