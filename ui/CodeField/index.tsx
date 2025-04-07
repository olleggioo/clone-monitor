import {
  ChangeEvent,
  FC,
  KeyboardEvent,
  useEffect,
  useRef,
  useState
} from 'react'
import { CodeFieldI } from '@/ui/CodeField/CodeField'
import styles from './CodeField.module.scss'
import classNames from 'classnames'
import { toast } from 'react-toastify'
import onChange = toast.onChange

const CodeField: FC<CodeFieldI> = ({
  error,
  onChange,
  onClear,
  onComplete
}) => {
  const [code, setCode] = useState('')
  const codeFieldRef = useRef<HTMLDivElement | null>(null)

  const handleKeyDown = (evt: KeyboardEvent<HTMLInputElement>) => {
    const { key } = evt
    const isBackspace = key === 'Backspace'
    const isSpace = key === ' '
    const isNumber = (!!Number(key) || key === '0') && !isSpace
    if (isBackspace) {
      setCode((prevState) => prevState.slice(0, prevState.length - 1))
      onClear && onClear()
      onChange && onChange()
    }
    if (!isNumber && !isBackspace) {
      evt.preventDefault()
    }
  }

  const handleChange = (evt: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = evt.target.value
    if (value.length <= 1) {
      onChange && onChange()
      setCode((prevState) => {
        const slicedValue = prevState.slice(0, index)
        return `${slicedValue}${value}`
      })
    }
  }

  useEffect(() => {
    if (codeFieldRef.current) {
      if (code.length >= 6) {
        const currentField = codeFieldRef.current
          .children[5] as HTMLInputElement
        currentField.blur()
        onComplete && onComplete(code)
      } else {
        const currentField = codeFieldRef.current.children[
          code.length
        ] as HTMLInputElement
        if (currentField) {
          currentField.focus()
        }
      }
    }
  }, [code, codeFieldRef])

  const fieldClassname = classNames(styles.el, { [styles.el_error]: error })

  return (
    <div className={fieldClassname} ref={codeFieldRef}>
      <input
        type="number"
        value={code[0] ?? ''}
        onKeyDown={handleKeyDown}
        onChange={(evt) => handleChange(evt, 0)}
      />
      <input
        type="number"
        value={code[1] ?? ''}
        onKeyDown={handleKeyDown}
        onChange={(evt) => handleChange(evt, 1)}
      />
      <input
        type="number"
        value={code[2] ?? ''}
        onKeyDown={handleKeyDown}
        onChange={(evt) => handleChange(evt, 2)}
      />
      <input
        type="number"
        value={code[3] ?? ''}
        onKeyDown={handleKeyDown}
        onChange={(evt) => handleChange(evt, 3)}
      />
      <input
        type="number"
        value={code[4] ?? ''}
        onKeyDown={handleKeyDown}
        onChange={(evt) => handleChange(evt, 4)}
      />
      <input
        type="number"
        value={code[5] ?? ''}
        onKeyDown={handleKeyDown}
        onChange={(evt) => handleChange(evt, 5)}
      />
    </div>
  )
}

export default CodeField
