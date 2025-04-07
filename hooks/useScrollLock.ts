import { useState } from 'react'
import { useIsomorphicLayoutEffect } from './index'

const useScrollLock = () => {
  // const [originalStyle] = useState(
  //   window.getComputedStyle(document.body).overflow
  // )

  useIsomorphicLayoutEffect((): (() => void) => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])
}

export default useScrollLock
