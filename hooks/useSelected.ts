import { useCallback, useState } from 'react'
import uniq from 'lodash/uniq'
import difference from 'lodash/difference'

export const useselectes = <P>(initialState: Array<P>) => {
  const [selectes, setselectes] = useState(initialState)
  const add = useCallback(
    (items: Array<P>) => {
      setselectes((oldList) => uniq([...oldList, ...items]))
    },
    [setselectes]
  )

  const remove = useCallback(
    (items: Array<P>) => {
      setselectes((oldList) => difference(oldList, items))
    },
    [setselectes]
  )

  const change = useCallback(
    (addOrRemove: boolean, items: Array<P>) => {
      if (addOrRemove) {
        add(items)
      } else {
        remove(items)
      }
    },
    [add, remove]
  )

  const clear = useCallback(() => setselectes([]), [setselectes])

  return { selectes, add, remove, clear, change }
}