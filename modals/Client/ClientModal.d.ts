export type ClientFieldType =
  | 'login'
  | 'password'
  | 'fullname'
  | 'email'
  | 'phone'
  | 'contract'

export interface ClientModalStateI {
  id?: string
  fullname?: string
  email: string
  phone: string
  contract?: string
}

export interface ClientModalI {
  onClose: () => void
}

export interface AddClientModalStateI extends ClientModalStateI {
  login: string
  password: string
}

export interface EditClientModalI extends ClientModalI {
  initialState: ClientModalStateI
}
