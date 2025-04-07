export interface UserI {
  id: string
  login: string
  email: string
  phone: string
  fullname?: string
  contract?: string
  roleId: string
  role: {
    id: string
    name: string
  }
  createdAt?: Date
  userDevices: UserDevicesI[] | []
}

export interface UserDevicesI {
  algorithmId: string
  areaId: string
  deviceId: string
  id: string
  ipaddr: string
  macaddr: string
  modelId: string
  sn: string
  snbp: string
  statusId: string
  userId: string
}



export interface UsersResI {
  rows: UserI[]
  total: number
}

export interface UserRoleI {
  id?: string
  name: string
}

export interface RegisterUserReqParamsI {
  login: string
  password: string
  repeatedPassword: string
  email?: string
  phone?: string
  fullname?: string
  contract?: string
}

export interface LoginUserReqParamsI {
  login: string
  password: string
}

export interface LoginUserResI {
  accessToken: string
  refreshToken: string
  id: string
  login: string
  email: string
  phone: string
  fullname?: string
  contract?: string
  roleId: string
  role: {
    id: string
    name: string
  }
  createdAt?: Date
  userDevices: UserDevicesI[] | []
}

export interface RefreshUserReqParamsI {
  accessToken: string
  refreshToken: string
}

export interface CreateUserReqParamsI {
  login: string
  password: string
  fullname: string
  email: string
  phone?: string
  contract?: string
  roleId?: string
}

export interface UpdateUserReqParamsI {
  fullname?: string
  email?: string
  phone?: string
  contract?: string
  roleId?: string
}

export interface UpdateUserPasswordReqParamsI {
  oldPassword: string
  repeatedPassword: string
  newPassword: string
}