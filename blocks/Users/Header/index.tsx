import { FC, useState } from 'react'
import { AddClientModal, AddUserModal } from '@/modals'
import { Header } from '@/components'
import { Button } from '@/ui'
import { IconUserPlus } from '@/icons'
import styles from './UsersHeader.module.scss'

type ModalStateType = 'add-user' | 'add-client' | null

const UsersHeader: FC = () => {
  const [modal, setModal] = useState<ModalStateType>(null)

  const handleCloseModal = () => {
    setModal(null)
  }

  const buttons = (
    <div className={styles.buttons}>
      <Button
        title="Добавить клиента"
        icon={<IconUserPlus width={22} height={22} />}
        onClick={() => setModal('add-client')}
      />
      <Button
        title="Добавить администратора"
        icon={<IconUserPlus width={22} height={22} />}
        onClick={() => setModal('add-user')}
      />
    </div>
  )

  return (
    <>
      <Header title="Пользователи" controlsBlock={buttons} />
      {modal === 'add-client' && <AddClientModal onClose={handleCloseModal} />}
      {modal === 'add-user' && <AddUserModal onClose={handleCloseModal} />}
    </>
  )
}

export default UsersHeader
