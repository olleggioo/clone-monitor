import { FC, Fragment } from 'react'
import styles from './UserInfo.module.scss'
import Dashboard from '../Dashboard'

const UserInfo: FC<any> = ({ items }) => {
  return <Dashboard title="Информация о пользователе">
      <div className={styles.el}>
        {items.map((item: any) => {
            return <Fragment key={item.label}>
              <span className={styles.label}>{item.label}</span>
              <span className={styles.value}>
                {item.value}
                {item.addInfo && (
                  <span className={styles.addInfo}>{item.addInfo}</span>
                )}
              </span>
            </Fragment>
          })}
      </div>
    </Dashboard>
}
export default UserInfo
