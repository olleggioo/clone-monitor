import { FC, memo, useId, useRef, useState } from 'react'
import styles from './MassField.module.scss'
import { FieldI } from '@/ui/Field/Field'
import classNames from 'classnames'
import { IconEye, IconEyeOff } from '@/icons'

const OtherField: FC<FieldI> = ({
  label,
  type = 'text',
  icon,
  error,
  disabled = false,
  autoComplete,
  onChange,
  className,
  wrapClassname,
  id: propId,
  onKeyPress,
  onFocus,
  ...props
}) => {
  const id = useId()
  const isPasswordField = type === 'password'
  const [fieldType, setFieldType] = useState(type)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const modifierClass =
    isPasswordField && icon
      ? styles.input_pass
      : !!icon
      ? styles.input_icon
      : isPasswordField && !icon
      ? styles.input_passNoIcon
      : null

  const innerClass = classNames(styles.inner, { [styles.error]: error })
  const inputClass = classNames(styles.input, modifierClass, className)
  const wrapClass = classNames(styles.el, wrapClassname)

  const handleFieldTypeToggle = () => {
    setFieldType((prevState) =>
      prevState === 'password' ? 'text' : 'password'
    )
  }

  return (
    <div className={wrapClass}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <div className={innerClass}>
        {icon}
        <input
          {...props}
          disabled={disabled}
          onFocus={onFocus}
          className={inputClass}
          onKeyPress={onKeyPress}
          type={fieldType}
          id={propId ?? id}
          onChange={onChange}
          autoComplete={"off"}
          ref={inputRef}
        />
        {isPasswordField && (
          <button
            type="button"
            className={styles.toggle}
            onClick={handleFieldTypeToggle}
          >
            {fieldType === 'password' ? (
              <IconEye width={24} height={24} />
            ) : (
              <IconEyeOff width={24} height={24} />
            )}
          </button>
        )}
      </div>
    </div>
  )
}

export default memo(OtherField)
