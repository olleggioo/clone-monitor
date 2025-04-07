import { FC } from 'react'
import Layout from '../Layout'
import { Header } from '@/components'
import EditForm from '@/blocks/Devices/EditForm'
import withAuth from '@/hoc/withAuth'

const AddDevice: FC = () => {
  const header = <Header title="Редактировать устройство" back />

  return (
    <Layout pageTitle="Редактировать устройство" header={header}>
      <EditForm />
    </Layout>
  )
}

export default AddDevice
