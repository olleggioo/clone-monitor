import { NextPage } from 'next'
import Head from 'next/head'
import { UsersContainer } from '@/containers'
import withAuth from '@/hoc/withAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import UsersContainerManager from '@/containers/Users/UserContainerManager'
import { hasAccess } from '@/helpers/AccessControl'
import { requestsAccessMap } from '@/helpers/componentAccessMap'
import EmptyWrapper from '@/containers/EmptyWrapper'

const UsersPage: NextPage = () => {
  const roleId = localStorage.getItem(`${process.env.API_URL}_role`)
  const router = useRouter();
  // useEffect(() => {
  //     if(roleId !== process.env.ROLE_ROOT_ID && roleId !== process.env.ROLE_MANAGER_ID) {
  //       router.push("/statistics")
  //     } else return;
  // }, [roleId])
  return (
    <>
      <Head>
        <title>Пользователи</title>
      </Head>
      {hasAccess(requestsAccessMap.getUsers)
        ? roleId === process.env.ROLE_ROOT_ID 
          ? <UsersContainer />
          : roleId === process.env.ROLE_MANAGER_ID ? <UsersContainerManager /> : <UsersContainer />
        : <div>
        <EmptyWrapper />
      </div>
      }
      {/* {roleId === process.env.ROLE_ROOT_ID && <UsersContainer />}
      {roleId === process.env.ROLE_MANAGER_ID && <UsersContainerManager />} */}
    </>
  )
}

export default withAuth(UsersPage)
