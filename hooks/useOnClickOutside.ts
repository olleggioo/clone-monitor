import { RefObject, useRef, useState, useEffect, useCallback } from 'react'

interface Callback<T extends Event = Event> {
  (event: T): void
}
type Refs = RefObject<HTMLElement>[]
type AnyEvent = MouseEvent | TouchEvent
interface Return {
  (element: HTMLElement | null): void
}

const useOnClickOutside = (callback: Callback, refs?: Refs, additionalRef?: any): Return => {
  const [refsState, setRefsState] = useState<Refs>([])
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  const ref: Return = useCallback(
    (el) => setRefsState((prevState) => [...prevState, { current: el }]),
    []
  )

  useEffect(() => {
    if (!refs?.length && !refsState.length) return

    const getEls = () => {
      const els: HTMLElement[] = []
      const targetRefs = refs || refsState
      targetRefs.forEach(({ current }) => current && els.push(current))
      return els
    }

    const handler = (e: AnyEvent) => {
      const target = e.target as Node;
      const datepicker = document.querySelector('.react-datepicker');
    
      // Проверка, что элемент, по которому кликнули, является частью скролла меню
      if (additionalRef?.contains(e.target)) {
        return;  // Если клик внутри меню, не закрываем дропдаун
      }
    
      if (getEls().every((el) => !el.contains(target)) && !datepicker?.contains(target)) {
        callbackRef.current(e);
      }
    };

    document.addEventListener(`mousedown`, handler)
    document.addEventListener(`touchstart`, handler)
    return () => {
      document.removeEventListener(`mousedown`, handler)
      document.removeEventListener(`touchstart`, handler)
    }
  }, [refs, refsState])

  return ref
}

export default useOnClickOutside
