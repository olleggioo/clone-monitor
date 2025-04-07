import { FC } from 'react'
import styles from './TableCell.module.scss'
import { TableCellI } from '../Table'
import classNames from 'classnames'
import { Status } from '@/ui'
import { renderIcon } from '@/helpers'

const TableCell: FC<TableCellI> = ({
  title,
  accessor,
  icon,
  description,
  status,
  bold,
  align,
  width,
  isLoading,
  state,
}) => {
  const alignClass = align !== 'left' ? styles[`align_${align}`] : undefined
  const cellClass = classNames(styles.el, alignClass, {
    [styles.is_loading]: isLoading
  })

  if (width) {
    width = width > 100 ? 100 : width < 5 ? 5 : width
  }
  return (
    <div
      className={cellClass}
      style={{
        width: width ? `${width}%` : undefined
      }}
    >
      {status ? (
        <Status tagName="span" title={title} state={status} />
      ) 
      : (
        // state && accessor === "rateReal"
        //   ? <>
        //     {icon && renderIcon(icon)} 
        //     <p className={styles.text}>
        //       {bold ? (
        //         <b className={styles.title}>{title}</b>
        //       ) : (
        //         <span className={styles.title}>{(state?.firmwareData?.rateReal / 1000).toFixed(1)} TH/s</span>
        //       )}
        //       {description && <span className={styles.desc}>{description}</span>}
        //     </p>
        //   </>
          <>
            {icon && renderIcon(icon)}
            <p className={styles.text}>
              {bold ? (
                <b className={styles.title}>{title}</b>
              ) : (
                <span className={styles.title}>{title}</span>
              )}
              {description && <span className={styles.desc}>{description}</span>}
            </p>
          </>
      )}
    </div>
  )
}

export default TableCell
