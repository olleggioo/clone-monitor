import { FC, memo, useEffect, useMemo, useState } from 'react'
import { useAtom } from 'jotai'
import { RoleName, RoleGroup, RoleToGroup } from '@/const'
import { deviceAtom, rolesListAtom, usersListAtom } from '@/atoms'
import { deviceAPI, userAPI } from '@/api'
import { Layout } from '@/containers'
import { UsersHeader, UsersTable } from '@/blocks'
import { Dashboard, TabsControls, Pagination } from '@/components'
import { TabsControlI } from '@/components/TabsControls/TabsControls'
import { changeManyMiningStateInUsers, devicesUserIdFilterAtom, devicesUserIdMiningFilterAtom, modalInfoAtom, sortUserFilterAtom, statusInfoAtom, usersFilterAtom } from '@/atoms/appDataAtom'
import UsersFilter from '@/blocks/Users/UsersFilter'
import UsersHeaderMobile from '@/blocks/Users/Header/Mobile'
import DropdownActions from '@/ui/Dropdown/DropdownActions'
import { IconChart, IconTrash, IconUserPlus } from '@/icons'
import { getNumberDeclinationString } from '@/helpers'
import Alert from '@/modals/Areas/Alert'
import { useSnackbar } from 'notistack'
import styles from './Users.module.scss'
import ProfileUser from '@/components/ProfileUser'
import { Button } from '@/ui'
import { AddClientModal, AddUserModal } from '@/modals'
import { hasAccess } from '@/helpers/AccessControl'
import { requestsAccessMap } from '@/helpers/componentAccessMap'
import AddUsersModal from '@/modals/User/Add/AddUsersModal'

type ModalStateType = 'add-user' | 'add-client' | 'add-users' | null

const TABS: TabsControlI[] = [
  { text: RoleGroup.Clients },
  { text: RoleGroup.Team }
]
const USERS_PER_PAGE = 50

const UsersContainer: FC = () => {
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

  // const currentTabUsers = useMemo(() => usersList.filter(
  //   (user) => RoleToGroup[user?.role?.name as RoleName] === currentTab
  // ), [usersList, currentTab, setUsersList])

  const currentTabUsers = useMemo(() => 
    usersList.filter((user) => {
      const isTeamTab = currentTab === RoleGroup.Team;
      return isTeamTab ? user?.role?.isTeam : !user?.role?.isTeam;
    }), 
    [usersList, currentTab]
  );
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
      role?: any
    } = {}

    if(currentTab === RoleGroup.Clients) {
      // where.roleId === process.env.ROLE_CLIENT_ID
      where.role = {
        isTeam: false
      }      
    } else {
      // where.roleId = `$In([\"${process.env.ROLE_MANAGER_ID}\", \"${process.env.ROLE_ROOT_ID}\"])`
      where.role = {
        isTeam: true
      }
    }

    if(filter.name.length !== 0) {
      where.fullname = `$Like("%${filter.name}%")`
    }
    if(filter.phone.length !== 0) {
      where.phone = `$Like("%${filter.phone}%")`
    }
    if(filter.contract.length !== 0) {
      where.contract = `${filter.contract}`
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
    userAPI.getUsersRole()
      .then((res) => {
        setRolesList(res.rows)
      })
      .catch(err => console.error(err))
  }, [])

  useEffect(() => {
    deviceAPI.getDevicesStatus()
      .then((res) => {
        setStatuses(res.rows)
        console.log("TEST")
      })
      .catch(err => console.error(err))
  }, [])

  // useEffect(() => {
  //   Promise.all([
  //     userAPI.getUsersRole(),
  //     deviceAPI.getDevicesStatus()
  //   ]).then((res) => {
  //     const [
  //       roles, 
  //       status
  //     ] = res
  //       setRolesList(roles.rows)
  //       setStatuses(status.rows)
  //   }).catch(console.error)
  // }, [])

  const [miningStateManyModal, setMiningStateModal] = useAtom(changeManyMiningStateInUsers)
  const [deleteManyUsers, setDeleteManyUsers] = useState(false)
  const tableDropDownItems: any = [
    
  ]

  if(hasAccess(requestsAccessMap.enableDevice) && hasAccess(requestsAccessMap.disableDevice)) {
    tableDropDownItems.push({
      text: "Изменить состояние майнинга",
      icon: <IconChart width={20} height={20} />,
      onClick: () => setMiningStateModal(true)
    })
  }

  if(hasAccess(requestsAccessMap.deleteUser)) {
    tableDropDownItems.push({
      text: "Удалить",
      icon: <IconTrash width={20} height={20} />,
      onClick: () => setDeleteManyUsers(true),
      mod: "red"
    })
  }
  const [stateDevicesId, setStateDevicesId] = useAtom(devicesUserIdMiningFilterAtom)

  const countSuffixDevice = getNumberDeclinationString(stateDevicesId.flatMap((item: any) => item.devicesId.map((device: any) => ({ id: device.deviceId }))).length, [
    'устройство',
    'устройства',
    'устройств'
  ])

  const [_, setModalInfo] = useAtom(modalInfoAtom)
  const {enqueueSnackbar} = useSnackbar()

  const deleteUsersFromList = (ids: any) => {
    let newArr: any = usersList
    ids.forEach((item: any) => {
      newArr = newArr.filter((user: any) => user.id !== item.id) 
    })
    setUsersList(newArr)
  }

  const handleDeleteManyUsers = () => {
    if(state && state.length > 0) {
      userAPI.deleteManyUsers({
        where: state
      }).then(res => {
        deleteUsersFromList(state)
        setModalInfo({
          open: true,
          action: "Удаление пользователей",
          status: "Успешно",
          textInAction: "Пользователи успешно удалены"
        })
        enqueueSnackbar("Пользователи удалены.", {
          variant: "success",
          autoHideDuration: 3000
        })
      }).catch(err => {
        setModalInfo({
          open: true,
          action: "Удаление пользователей",
          status: "Ошибка",
          textInAction: "Произошла ошибка при удалении пользователей"
        })
        enqueueSnackbar("Произошла ошибка при удалении пользователей.", {
          variant: "error",
          autoHideDuration: 3000
        })
      }).finally(() => {
        setDeleteManyUsers(false)
      })
    }
  }

  const [modal, setModal] = useState<ModalStateType>(null)

  const handleCloseModal = () => {
    setModal(null)
  }

  return device !== "mobile" ? (
    <Layout 
      // header={<UsersHeader />} 
      
      header={<ProfileUser title="Пользователи" />}>
      <Dashboard className={styles.el}>
        <div className={styles.flexActions}>
          <TabsControls
            items={TABS}
            currentTab={currentTab}
            onChange={setCurrentTab}
            onChangePage={setPage}
          />
          {modal === 'add-client' && <AddClientModal onClose={handleCloseModal} />}
          {modal === 'add-user' && <AddUserModal onClose={handleCloseModal} />}
          {modal === 'add-users' && <AddUsersModal onClose={handleCloseModal} />}
          {hasAccess(requestsAccessMap.createUser) && <div className={styles.buttons}>
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
          </div>}
        </div>
        <UsersFilter setPage={setPage} />
        {deleteManyUsers && <Alert 
          title={"Удаление пользователей"} 
          content={"Вы уверены что хотите удалить пользователей?"} 
          open={deleteManyUsers} 
          setOpen={setDeleteManyUsers} 
          handleDeleteClick={handleDeleteManyUsers} 
        />}
        <div className={styles.actionUsers}>
          <div className={styles.infoUsersSelected}>
            {currentTab === RoleGroup.Clients && <p>Суммарно {countSuffixDevice}</p>}
          </div>
          {state.length > 0 && <DropdownActions 
              items={tableDropDownItems}
              className={styles.buttonMoreActions}
              // className={styles.actions}
          />}
        </div>
        <UsersTable
          view={currentTab}
          currentViewUsers={currentTabUsers}
        />

        {totalCountUser > USERS_PER_PAGE && (
          <Pagination
            onPageChange={handlePageChange}
            limit={USERS_PER_PAGE}
            offset={paginationOffset}
            total_count={totalCountUser}
          />
        )}
      </Dashboard>
    </Layout>
  ) : (
    <Layout pageTitle='Пользователи' header={<ProfileUser title="Пользователи" />}>
      {hasAccess(requestsAccessMap.createUser) && <UsersHeaderMobile />}
      <Dashboard className={styles.el}>
        <TabsControls
          items={TABS}
          currentTab={currentTab}
          onChange={setCurrentTab}
        />
        <UsersFilter setPage={setPage} />
        {deleteManyUsers && <Alert 
          title={"Удаление IP-диапазона"} 
          content={"Вы уверены что хотите удалить IP-диапазон?"} 
          open={deleteManyUsers} 
          setOpen={setDeleteManyUsers} 
          handleDeleteClick={handleDeleteManyUsers} 
        />}
        <div className={styles.actionUsers}>
          <div className={styles.infoUsersSelected}>
            {currentTab === RoleGroup.Clients && <p>Суммарно {countSuffixDevice}</p>}
          </div>
          {state.length > 0 && <DropdownActions 
              items={tableDropDownItems}
              className={styles.buttonMoreActions}
              // className={styles.actions}
          />}
        </div>
        <UsersTable
          view={currentTab}
          currentViewUsers={currentTabUsers}
        />

        {totalCountUser > USERS_PER_PAGE && (
          <Pagination
            onPageChange={handlePageChange}
            limit={USERS_PER_PAGE}
            offset={paginationOffset}
            total_count={totalCountUser}
          />
        )}
      </Dashboard>
    </Layout>
  )
}

export default memo(UsersContainer)
