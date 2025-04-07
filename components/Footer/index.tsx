import { FC, useState } from 'react'
import styles from './Footer.module.scss'
import classNames from 'classnames'
import { Link } from '@/ui'
import { PolicyPopup } from '@/components'

const Footer: FC = () => {
  const year = new Date().getFullYear()
  const [popupOpen, setPopupOpen] = useState(false)

  return (
    <>
      <footer className={styles.el}>
        <div className={classNames(styles.inner)}>
          <p className={styles.text}>© {year} Promminer </p>
          <Link
            title="Условия использования"
            appearance="gray"
            className={styles.link}
            onClick={() => setPopupOpen(true)}
          />
        </div>
      </footer>
      {popupOpen && <PolicyPopup onClose={() => setPopupOpen(false)} />}
    </>
  )
}
export default Footer
