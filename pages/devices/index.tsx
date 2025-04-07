import { DevicesContainer } from '@/containers'
import Head from 'next/head'
import { NextPage } from 'next'
import withAuth from '@/hoc/withAuth'
// import DevicesContainerClients from '@/containers/Devices/DevicesClients'
import DevicesContainerManager from '@/containers/Devices/DevicesManager'
import { hasAccess } from '@/helpers/AccessControl'
import { requestsAccessMap } from '@/helpers/componentAccessMap'
import EmptyWrapper from '@/containers/EmptyWrapper'

const Devices: NextPage = () => {
  const roleId = localStorage.getItem(`${process.env.API_URL}_role`)
  return (
    <>
      <Head>
        <title>Устройства</title>
      </Head>
      {/* <DevicesContainer /> */}
      {hasAccess(requestsAccessMap.getDevices)
        ? roleId === process.env.ROLE_ROOT_ID 
          ? <DevicesContainer />
          : roleId === process.env.ROLE_MANAGER_ID 
            ? <DevicesContainerManager />
            : <DevicesContainer />
        : <div>
        <EmptyWrapper />
      </div>
      }
      {/* {roleId === process.env.ROLE_ROOT_ID
        ? <DevicesContainer />
        : roleId === process.env.ROLE_MANAGER_ID
          ? <DevicesContainerManager />
          : <DevicesContainerClients />
      } */}
    </>
  )
}

export default withAuth(Devices)
