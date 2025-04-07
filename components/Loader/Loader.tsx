import styles from './Loader.module.scss'
import { FC } from 'react'
import { useScrollLock } from '@/hooks'
import { useLottie } from 'lottie-react'
import loader from '../../public/loader.json'

const Loader: FC = () => {
  useScrollLock()

  const options = {
    animationData: loader,
    loop: true
  }

  const { View } = useLottie(options)

  return (
    <div className={styles.el}>
      <div className={styles.inner}>{View}</div>
    </div>
  )
}

export default Loader
