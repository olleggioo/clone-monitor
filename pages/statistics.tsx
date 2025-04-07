import { StatisticsContainer } from '@/containers'
import Head from 'next/head'
import { NextPage } from 'next'
import withAuth from '@/hoc/withAuth'
import StatisticsContainerClients from '@/containers/Clientura/Statistics'
import { useEffect } from 'react'
import { deviceAPI } from '@/api'

const Statistics: NextPage = () => {
  const roleId = localStorage.getItem(`${process.env.API_URL}_role`)

  // useEffect(() => {
  //   deviceAPI.getRoleAccess({
  //     relations: {
  //       role: true,
  //       access: true
  //     }
  //   })
  //     .then((res) => {
  //       localStorage.setItem("roleAccess", JSON.stringify(res))
  //     })
  //     .catch(err => console.error(err))
  // }, [])

  // useEffect(() => {
  //     const rawData = localStorage.getItem("roleAccess");
  //     if (rawData) {
  //       const parsedData = JSON.parse(rawData);
  //       const rows = parsedData.rows || [];
        
  //       const initialCheckboxes = rows
  //       .filter(
  //           (item: any) => item.role.id === roleId
  //       )
      
  //       console.log("initialCheckboxes", initialCheckboxes, parsedData)
  //       localStorage.setItem("currentRoleAccess", JSON.stringify(initialCheckboxes))
  //     }
      

  // }, [roleId]);

  return (
    <>
      <Head>
        <title>Статистика</title>
      </Head>
      <StatisticsContainer />
      {/* {roleId === process.env.ROLE_ROOT_ID
        ? <StatisticsContainer />
        : roleId === process.env.ROLE_MANAGER_ID
          ? <StatisticsContainer />
          : <StatisticsContainerClients />
      } */}
    </>
  )
}

export default withAuth(Statistics)
