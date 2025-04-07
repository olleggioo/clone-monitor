import { FC, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { PortalProps } from './Portal'

const Portal: FC<PortalProps> = ({ children, selector }) => {
  const ref = useRef<Element | null>(null)
  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    const target = document.querySelector(selector)
    if (target) {
      ref.current = target
      setMounted(true)
    }
  }, [selector])

  return mounted && ref.current ? createPortal(children, ref.current) : null
}

export default Portal
