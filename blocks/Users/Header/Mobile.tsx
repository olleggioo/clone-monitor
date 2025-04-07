import { FC, useState } from 'react'
import styles from './UsersHeader.module.scss'
import { Button } from '@/ui'
import { IconUserPlus } from '@/icons'
import { Header } from '@/components'
import { AddClientModal, AddUserModal } from '@/modals'
import AddUsersModal from '@/modals/User/Add/AddUsersModal'

type ModalStateType = 'add-user' | 'add-client' | 'add-users' | null

const UsersHeaderMobile: FC = () => {
  const [modal, setModal] = useState<ModalStateType>(null)

  const handleCloseModal = () => {
    setModal(null)
  }

  const buttons = (
    <div className={styles.buttons}>
      <Button
        title="Добавить пользователя"
        icon={<IconUserPlus width={22} height={22} />}
        onClick={() => setModal('add-users')}
      />
      {/* <Button
        title="Добавить клиента"
        icon={<IconUserPlus width={22} height={22} />}
        onClick={() => setModal('add-client')}
      />
      <Button
        title="Добавить администратора"
        icon={<IconUserPlus width={22} height={22} />}
        onClick={() => setModal('add-user')}
      /> */}
    </div>
  )

  return (
    <>
      {buttons}
      {/* {modal === 'add-client' && <AddClientModal onClose={handleCloseModal} />}
      {modal === 'add-user' && <AddUserModal onClose={handleCloseModal} />} */}
      {modal === 'add-users' && <AddUsersModal onClose={handleCloseModal} />}
    </>
  )
}

export default UsersHeaderMobile
