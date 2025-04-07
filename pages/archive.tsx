import { AreasContainer } from '@/containers'
import Head from 'next/head'
import { NextPage } from 'next'
import withAuth from '@/hoc/withAuth'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import AreasContainerManager from '@/containers/Areas/AreaContainerManager'
import ArchiveContainer from '@/containers/Archive'
import { Loader } from '@/components'

const InArchive: NextPage = () => {
  const roleId = localStorage.getItem(`${process.env.API_URL}_role`)
  const router = useRouter();
  useEffect(() => {
      if(roleId !== process.env.ROLE_ROOT_ID && roleId !== process.env.ROLE_MANAGER_ID) {
        router.push("/statistics")
      }
  }, [roleId])
  return (
    <>
      <Head>
        <title>Статистика</title>
      </Head>
      {roleId === process.env.ROLE_ROOT_ID ? <ArchiveContainer /> : <ArchiveContainer />}
      {/* {roleId === process.env.ROLE_MANAGER_ID && <AreasContainerManager />} */}
    </>
  )
}

export default withAuth(InArchive)
