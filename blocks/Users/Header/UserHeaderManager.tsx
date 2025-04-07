import { FC, useState } from 'react'
import styles from './UsersHeader.module.scss'
import { Button } from '@/ui'
import { IconUserPlus } from '@/icons'
import { Header } from '@/components'
import { AddClientModal, AddUserModal } from '@/modals'

type ModalStateType = 'add-user' | 'add-client' | null

const UsersHeaderManager: FC = () => {
  const [modal, setModal] = useState<ModalStateType>(null)

  const handleCloseModal = () => {
    setModal(null)
  }

  const buttons = (
    <div className={styles.buttons}>
    </div>
  )

  return (
    <>
      <Header title="Пользователи" controlsBlock={buttons} />
    </>
  )
}

export default UsersHeaderManager
