import { FC } from 'react'
import Layout from '../Layout'
import { Header } from '@/components'
import withAuth from '@/hoc/withAuth'
import { AddDeviceForm, EditDeviceForm } from '@/blocks'

const AddDevice: FC = () => {
  const header = <Header title="Добавить устройство" />

  return (
    <Layout pageTitle="Добавить устройство" header={header}>
      <AddDeviceForm />
    </Layout>
  )
}

export default AddDevice
