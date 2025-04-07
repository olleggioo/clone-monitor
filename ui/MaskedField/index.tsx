import { FC, useId } from 'react'
import { MaskedFieldI } from './MaskedField'
import styles from './Field.module.scss'
import classNames from 'classnames'
import ReactInputMask from 'react-input-mask'

const MaskedField: FC<MaskedFieldI> = ({
  label,
  icon,
  error,
  className,
  mod,
  ...props
}) => {
  const id = useId()

  return (
    <div
      className={classNames(
        styles.el,
        className,
        mod ? styles[`el_${mod}`] : null
      )}
    >
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.inner}>
        {icon}
        <ReactInputMask {...props} id={id} className={styles.input} />
      </div>
    </div>
  )
}

export default MaskedField
