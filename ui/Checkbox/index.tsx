import { FC } from 'react'
import styles from './Checkbox.module.scss'
import classNames from 'classnames'
import { CheckboxI } from '@/ui/Checkbox/Checkbox'

const Checkbox: FC<CheckboxI> = ({
  className,
  isChecked,
  isDisabled = false,
  isInvalid = false,
  isRequired = true,
  label = '',
  name,
  onChange,
  type = 'checkbox',
  value,
  appearance = 'default',
  isReverse = false
}) => {
  const appearanceClass =
    appearance !== 'default' ? styles[`el_${appearance}`] : null
  const checkboxClass = classNames(
    className,
    styles.el,
    appearanceClass,
    isInvalid && styles[`el_isInvalid`],
    isDisabled && styles[`el_isDisabled`],
    isReverse && styles[`el_reverse`]
  )
  const id = type === 'checkbox' ? name : value
  return (
    <div className={checkboxClass}>
      <input
        checked={isChecked}
        className={styles.input}
        disabled={isDisabled}
        id={id}
        name={name}
        onChange={onChange}
        required={isRequired}
        type={type}
        value={value}
      />
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
    </div>
  )
}

export default Checkbox
