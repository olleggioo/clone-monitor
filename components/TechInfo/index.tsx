import { FC, Fragment, useId } from 'react'
import { TechInfoI } from './TechInfo'
import Dashboard from '../Dashboard'
import styles from './TechInfo.module.scss'

const TechInfo: FC<TechInfoI> = ({ items, model }) => {
  return <Dashboard title="Техническая информация" className={styles.box}>
      <div className={styles.el}>
        {model !== undefined && items.map((item) => {
          if(item.label.toLowerCase() === "ip") {
            return <Fragment key={item.label}>
              <span className={styles.label}>{item.label}</span>
              <span className={styles.value}>
                <a className={styles.addInfo} href={model.name.includes("Antminer") ? `http://root:root@${item.value}` : `https://${item.value}`} target='_blank'>
                  {item.value}
                </a>
                {item.addInfo && (
                  <a className={styles.addInfo}>{item.addInfo}</a>
                )}
              </span>
            </Fragment>
          } else {
            return item.value !== "" ? <Fragment key={item.label}>
              <span className={styles.label}>{item.label}</span>
              <span className={styles.value}>
                {item.value}
                {item.addInfo && (
                  <span className={styles.addInfo}>{item.addInfo}</span>
                )}
              </span>
            </Fragment> : <></>
          }})}
      </div>
    </Dashboard>
}
export default TechInfo
