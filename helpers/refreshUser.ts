import { LoginUserResI } from '@/interfaces'

const refreshUser = (data: any) => {
  localStorage.setItem(`${process.env.API_URL}_accessToken`, data.accessToken)
  localStorage.setItem(`${process.env.API_URL}_refreshToken`, data.refreshToken)
  localStorage.setItem(`${process.env.API_URL}_role`, data.roleId)
  localStorage.setItem(`${process.env.API_URL}_id`, data.id)
}

export default refreshUser
