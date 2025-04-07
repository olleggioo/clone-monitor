import {
    FC,
    useState,
    useMemo
  } from 'react'
  import { useRouter } from 'next/router'
  import { useAtom } from 'jotai'
  import type { UserI } from '@/interfaces'
  import type { DropdownItemI } from '@/ui/Dropdown/Dropdown'
  import { RoleGroup } from '@/const'
  import { usersListAtom } from '@/atoms'
  import { userAPI } from '@/api'
  import {
    IconEdit2,
    IconTrash,
    IconTrendingUp
  } from '@/icons'
  import { UsersTableI } from '@/blocks/Users/Table/UsersTable'
  import {
    clientsTableHead,
    teamTableHead
  } from '@/blocks/Users/Table/tableData'
  import { getUsersTableData } from '@/blocks/Users/helpers'
  import {
    EditClientModal,
    EditUserModal
  } from '@/modals'
  import {  } from '@/components'
  import Table from '@/components/Table/CopyTable'
  import { Button } from '@/ui'
  import { changeManyMiningStateInUsers, devicesFilterAtom, devicesUserIdFilterAtom, devicesUserIdMiningFilterAtom, statusInfoAtom } from '@/atoms/appDataAtom'
  import Alert from '@/modals/Areas/Alert'
  import { useSnackbar } from 'notistack'
import TestTable from '@/components/Table/TestTable'
import styles from "./Table.module.scss"
import UpdateManyMiningState from '@/modals/MiningState/UpdateManyMiningState'
import MiningState from '@/modals/MiningState'
  
  const UsersTableManager: FC<UsersTableI> = ({ view, currentViewUsers, isLoading }) => {
    const router = useRouter()
  
    const [usersList, setUsersList] = useAtom(usersListAtom)
    const [currentUser, setCurrentUser] = useState<UserI | undefined>(undefined)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [warningDelete, setWarningDelete] = useState(false)
    const [state, setState] = useAtom(devicesUserIdFilterAtom)
    const [statuses, setStatuses] = useAtom(statusInfoAtom)

    const handleUserClick = (id: string) => {
      router.push(`/users/${id}`)
    }

    const tableData = useMemo(() => {
      const head = view === RoleGroup.Clients ? clientsTableHead : teamTableHead
      return {
        columns: head,
        rows: getUsersTableData(head, currentViewUsers, statuses, handleUserClick)
      }
    }, [view, currentViewUsers])
    const [filterData, setFilterData] = useAtom(devicesFilterAtom)
  
    const deleteUserFromList = (id: string) => {
      setUsersList(usersList.filter((user) => user.id !== id))
    }
    const handleStatisticsClick = (id?: string) => {
      if(usersList.length !== 0) {

        setFilterData((prevState: any) => {
          return {
            ...prevState,
            client: [{
              label: usersList.filter((item: any) => item.id === id)[0]?.fullname,
              value: id,
            }]
          }
    
        })
        // setFilterData((prevState: any) => {
        //   return {
        //     ...prevState,
        //     client: id
        //   }
        // })
        router.push(`/devices`)
      }
    }
  
    const handleEditClick = (id?: string) => {
      setCurrentUser(currentViewUsers.find((user) => user.id === id))
      setIsEditModalOpen(true)
    }
  
    const handleCloseModal = () => {
      setIsEditModalOpen(false)
    }

    const [modalChangeMin, setModalChangeMin] = useState(false)
    const [usersDevicesIds, setUsersDevicesIds] = useState<any>(null)
    const changeMiningState = (id?: string) => {
      if(id) {
        const userDevices = currentViewUsers.filter((item: any) => item.id === id)[0]?.userDevices
        if(userDevices) {
          setUsersDevicesIds(userDevices)
          setModalChangeMin(true)
        }
      }
    }
    let tableDropDownItems: DropdownItemI[] = []
    
    if(view === RoleGroup.Clients) {
        tableDropDownItems = [
            {
              text: 'Статистика',
              icon: <IconTrendingUp width={20} height={20} />,
              onClick: handleStatisticsClick
            },
            {
              text: 'Редактировать',
              icon: <IconEdit2 width={20} height={20} />,
              onClick: handleEditClick
            },
            {
              text: 'Изменить состояние майнинга',
              icon: <IconTrendingUp width={20} height={20} />,
              onClick: changeMiningState
            },
          ]
    } else if(view === RoleGroup.Team) {
        tableDropDownItems = [
            {
              text: 'Статистика',
              icon: <IconTrendingUp width={20} height={20} />,
              onClick: handleStatisticsClick
            },
        ]
    }

    const [stateDevicesId, setStateDevicesId] = useAtom(devicesUserIdMiningFilterAtom)
    const [miningStateManyModal, setMiningStateModal] = useAtom(changeManyMiningStateInUsers)

    return (
      <>
      {modalChangeMin && usersDevicesIds && <MiningState state={usersDevicesIds} onClose={() => setModalChangeMin(false)} />}
      {miningStateManyModal && <UpdateManyMiningState state={stateDevicesId} onClose={() => setMiningStateModal(false)} /> }
        <TestTable
          {...tableData}
          whichTable={"users"}
          dropdownItems={tableDropDownItems}
          isLoading={isLoading}
          className={view === RoleGroup.Clients ? styles.containerClients : styles.containerManagerUsers}
          requiredAction={view === RoleGroup.Clients ? true : false}
        />
        {isEditModalOpen && currentUser && (
          <>
            {view === RoleGroup.Clients && (
              <EditClientModal
                initialState={currentUser}
                onClose={handleCloseModal}
              />
            )}
          </>
        )}
      </>
    )
  }
  
  export default UsersTableManager
  