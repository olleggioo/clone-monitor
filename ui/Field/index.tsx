import { FC, memo, useId, useRef, useState } from 'react'
import styles from './Field.module.scss'
import { FieldI } from '@/ui/Field/Field'
import classNames from 'classnames'
import { IconEye, IconEyeOff } from '@/icons'

const Field: FC<FieldI> = ({
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
  closeIcon,
  closeIconButton,
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

  const innerClass = classNames(styles.inner, { [styles.error]: error }, closeIcon && styles.testC)
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
          className={inputClass}
          type={fieldType}
          id={propId ?? id}
          onChange={onChange}
          autoComplete={autoComplete}
          ref={inputRef}
        />
        {closeIcon && 
          <div onClick={closeIconButton} className={styles.closeIcon}>
            {closeIcon}
          </div>
        }
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

export default memo(Field)
