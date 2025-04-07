import { FC, memo } from 'react'
import styles from './Dashboard.module.scss'
import { DashboardI } from '@/components/Dashboard/Dashboard'
import classNames from 'classnames'
import { Heading } from '@/ui'
import Link from 'next/link'

interface DashboardNewI extends DashboardI {
  sizeTitle?: any
}

const Dashboard: FC<DashboardNewI> = ({
  title,
  titleTagName,
  linkText,
  linkHref,
  className,
  style,
  children,
  description,
  sideComp,
  headerTable,
  sizeTitle
}) => {
  const dashboardClassname = classNames(styles.el, className)
  return (
    <div className={dashboardClassname} style={style}>
      {title && (
        <div className={styles.side}>
          <div className={styles.head}>
            <Heading text={title} size={sizeTitle} tagName={titleTagName} />
            {linkHref && (
              <Link href={linkHref} className={styles.link}>
                {linkText}{' '}
              </Link>
            )}
            {description && (
              <div className={styles.desc}>
                {description}
              </div>
            )}
          </div>
          {sideComp && (
          <div>
            {sideComp}
          </div>
        )}
        </div>
      )}
      
        {headerTable && <div className={styles.headingTable}>
          {headerTable}  
        </div>}
      {children}
    </div>
  )
}

export default memo(Dashboard)
