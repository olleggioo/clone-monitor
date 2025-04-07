import { useEffect } from 'react'
import { userAPI } from '@/api'
import { refreshUser } from '@/helpers'
import { useRouter } from 'next/router'

const useRefreshToken = () => {
  const router = useRouter()
  let timer: ReturnType<typeof setTimeout> | false = false

  const refresh = () => {
    const accessToken = localStorage.getItem(
      `${process.env.API_URL}_accessToken`
    )
    const refreshToken = localStorage.getItem(
      `${process.env.API_URL}_refreshToken`
    )

    if (!!accessToken && !!refreshToken) {
      if (!timer) {
        userAPI
          .refreshUser({ accessToken, refreshToken })
          .then((res) => {
            refreshUser(res)
            timer = setTimeout(() => {
              timer = false
              refresh()
            }, 59000)
          })
          .catch((error) => {
            console.error(error)
            router.push('/login')
          })
      }
    } else {
      router.push('/login')
    }
  }

  useEffect(() => {
    refresh()
  }, [])
}

export default useRefreshToken
