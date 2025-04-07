import { FC } from 'react'
import styles from './Banner.module.scss'
import Image from 'next/image'
import { Button } from '@/ui'

const Banner: FC = () => {
  return (
    <div className={styles.banner}>
      <Image
        className={styles.wallet}
        src="/images/wallet@1x.png"
        width="418"
        height="418"
        alt=""
      />
      <Button
        title="Настроить выплаты"
        href="/settings"
        appearance="inverted"
        className={styles.bannerBtn}
      />
    </div>
  )
}

export default Banner
