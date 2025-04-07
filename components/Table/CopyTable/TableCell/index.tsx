import React, { FC } from 'react'
import styles from './TableCell.module.scss'

import classNames from 'classnames'
import { Status } from '@/ui'
import { renderIcon } from '@/helpers'
import { TableCellI } from '../../Table'
import { userAPI } from '@/api'
import { deviceAtom } from '@/atoms'
import { useAtom } from 'jotai'

const TableCell: FC<TableCellI> = ({
  onClick,
  onLink,
  url,
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
  const [device] = useAtom(deviceAtom)
  const alignClass = align !== 'left' ? styles[`align_${align}`] : undefined
  const cellClass = classNames(styles.el, alignClass, {
    [styles.is_loading]: isLoading
  })

  if (width) {
    width = width > 100 ? 100 : width < 5 ? 5 : width
  }

  return (
    <div
    style={device === "mobile" ?{
      width: 'auto',
    } : {
      width: width ? `${width}%` : undefined
    }}
      className={cellClass}
    >
      {status ? (
        <Status onClick={onClick} tagName="span" correctTitle={state?.firmwareData?.modelId} title={title} state={status} />
      ) : accessor === "rateReal"
          ? <>
            {icon && renderIcon(icon)} 
            <p className={styles.text}>
              {bold ? (
                <b className={styles.title}>{title}</b>
              ) : (
                <span className={styles.title}>{((state?.firmwareData?.rateNow || 0) / 1000).toFixed(1)} TH/s</span>
              )}
              {description && <span className={styles.desc}>{description}</span>}
            </p>
          </>
          : accessor==="ipaddr" 
          ? <> {icon && renderIcon(icon)}
            <a className={styles.text} href={`${url + title}`} target='_blank'>
              {bold ? (
                <b className={styles.title}>{title}</b>
              ) : (
                <span className={styles.title}>{title}</span>
              )}
              {description && <span className={styles.desc}>{description}</span>}
            </a>
          </>
          : <>
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
      }
    </div>
  )
}

export default React.memo(TableCell)
