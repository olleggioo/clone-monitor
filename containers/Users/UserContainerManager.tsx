import { FC, useEffect, useMemo, useState } from 'react'
import { useAtom } from 'jotai'
import { RoleName, RoleGroup, RoleToGroup } from '@/const'
import { deviceAtom, rolesListAtom, usersListAtom } from '@/atoms'
import { deviceAPI, userAPI } from '@/api'
import { Layout } from '@/containers'
import { Dashboard, TabsControls, Pagination } from '@/components'
import { TabsControlI } from '@/components/TabsControls/TabsControls'
import { changeManyMiningStateInUsers, devicesUserIdFilterAtom, devicesUserIdMiningFilterAtom, modalInfoAtom, sortUserFilterAtom, statusInfoAtom, usersFilterAtom } from '@/atoms/appDataAtom'
import UsersFilter from '@/blocks/Users/UsersFilter'
import UsersHeaderManager from '@/blocks/Users/Header/UserHeaderManager'
import UsersTableManager from '@/blocks/Users/Table/UsersTableManager'
import { getNumberDeclinationString } from '@/helpers'
import DropdownActions from '@/ui/Dropdown/DropdownActions'
import { IconChart } from '@/icons'
import styles from './Users.module.scss'
import ProfileUser from '@/components/ProfileUser'
import { useSnackbar } from 'notistack'

const TABS: TabsControlI[] = [
  { text: RoleGroup.Clients },
  { text: RoleGroup.Team }
]
const USERS_PER_PAGE = 50

const UsersContainerManager: FC = () => {
  const [device] = useAtom(deviceAtom)
  const [usersList, setUsersList] = useAtom(usersListAtom)
  const [rolesList, setRolesList] = useAtom(rolesListAtom)

  const [currentTab, setCurrentTab] = useState(TABS[0].text)
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useAtom(usersFilterAtom)
  const [sortUserFilter, setSortUserFilter] = useAtom(sortUserFilterAtom)
  const [statuses, setStatuses] = useAtom(statusInfoAtom)
  const [totalCountUser, setTotalCountUser] = useState(0)
  const [state, setState] = useAtom(devicesUserIdFilterAtom)

  const currentTabUsers = useMemo(() => usersList.filter(
    (user) => RoleToGroup[user?.role?.name as RoleName] === currentTab
  ), [usersList, currentTab, setUsersList])
  const paginationOffset = USERS_PER_PAGE * (page - 1)

  const test = document.getElementById("main-table")

  const handlePageChange = (page: number) => {
    setPage(page)
    test?.scrollTo({top: 0, left: 0, behavior: "smooth"})
  }
  useEffect(() => {
    const where: {
      fullname?: string
      phone?: string
      contract?: string
      roleId?: string
    } = {}

    if(currentTab === RoleGroup.Clients) {
      where.roleId === process.env.ROLE_CLIENT_ID      
    } else {
      where.roleId = `$In([\"${process.env.ROLE_MANAGER_ID}\", \"${process.env.ROLE_ROOT_ID}\"])`
    }

    if(filter.name.length !== 0) {
      where.fullname = `$Like("%${filter.name}%")`
    }
    if(filter.phone.length !== 0) {
      where.phone = `$Like("%${filter.phone}%")`
    }
    if(filter.contract.length !== 0) {
      where.contract = `$Like("%${filter.contract}%")`
    }
    Promise.all([
      userAPI
        .getUsers({
          where,
          relations: {
            role: true,
            userDevices: {
              device: true
            }
          },
          // select: {
          //   // id: true,
          //   email: true,
          //   fullname: true,
          //   login: true,
          //   password: true,
          //   phone: true,
          //   role: true,
          //   roleId: true,
          //   // userDevices: {
          //   //   id: true,
          //   //   // isDisabled: true,
          //   //   statusId: true,
          //   //   deviceId: true
          //   // },
          //   contract: true
          // },
          order: sortUserFilter,
          page: page - 1,
          limit: USERS_PER_PAGE,
        }),
      // userAPI.getUsersRole(),
      // deviceAPI.getDevicesStatus()
    ])
      .then((res) => {
        const [
          users, 
          // roles, 
          // status
        ] = res 
        setUsersList(users.rows)
        setTotalCountUser(users.total)
        // console.log("big roles", roles)
        // setRolesList(roles.rows)
        // setStatuses(status.rows)
      })
      .catch(console.error)
  }, [filter, sortUserFilter, setUsersList, page, currentTab])

  useEffect(() => {
    Promise.all([
      userAPI.getUsersRole(),
      deviceAPI.getDevicesStatus()
    ]).then((res) => {
      const [
        roles, 
        status
      ] = res
        setRolesList(roles.rows)
        setStatuses(status.rows)
    }).catch(console.error)
  }, [])

  const [miningStateManyModal, setMiningStateModal] = useAtom(changeManyMiningStateInUsers)
  const [deleteManyUsers, setDeleteManyUsers] = useState(false)
  const tableDropDownItems = [
    {
      text: "Изменить состояние майнинга",
      icon: <IconChart width={20} height={20} />,
      onClick: () => setMiningStateModal(true)
    },
  ]
  const [stateDevicesId, setStateDevicesId] = useAtom(devicesUserIdMiningFilterAtom)

  const countSuffixDevice = getNumberDeclinationString(stateDevicesId.flatMap((item: any) => item.devicesId.map((device: any) => ({ id: device.deviceId }))).length, [
    'устройство',
    'устройства',
    'устройств'
  ])

  const [_, setModalInfo] = useAtom(modalInfoAtom)
  const roleId = localStorage.getItem(`${process.env.API_URL}_role`)
  const {enqueueSnackbar} = useSnackbar()
  return (
    <Layout pageTitle={device !== "mobile" ? "" : "Пользователи"} header={<ProfileUser title="Пользователи" />}>
      <Dashboard className={styles.el}>
        <TabsControls
          items={TABS}
          currentTab={currentTab}
          onChange={setCurrentTab}
        />
        <UsersFilter setPage={setPage} />
        {currentTab === RoleGroup.Clients && roleId !== "b9507b39-884d-11ee-932b-300505de684f" && <div className={styles.actionUsers}>
          <div className={styles.infoUsersSelected}>
            {currentTab === RoleGroup.Clients && <p>Суммарно {countSuffixDevice}</p>}
          </div>
          {state.length > 0 && <DropdownActions 
              items={tableDropDownItems}
              className={styles.buttonMoreActions}
              // className={styles.actions}
          />}
        </div>}
        <UsersTableManager
          view={currentTab}
          currentViewUsers={currentTabUsers}
        />

        {currentTabUsers.length > USERS_PER_PAGE && (
          <Pagination
            onPageChange={handlePageChange}
            limit={USERS_PER_PAGE}
            offset={paginationOffset}
            total_count={currentTabUsers.length}
          />
        )}
      </Dashboard>
    </Layout>
  )
}

export default UsersContainerManager
