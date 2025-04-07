import { TableHeadCellI } from '@/components/Table/Table'

export const clientsTableHead: TableHeadCellI[] = [
  {
    title: 'Номер договора',
    accessor: 'contract',
    width: 18.66
  },
  {
    title: 'Логин',
    accessor: 'login',
    width: 18.66,
    flagCopy: true,
  },
  {
    title: 'ФИО',
    accessor: 'fullname',
    width: 18.66,
    flagCopy: true,
  },
  {
    title: 'Email',
    accessor: 'email',
    width: 18.66,
    flagCopy: true,
  },
  {
    title: 'Номер телефона',
    accessor: 'phone',
    width: 18.66,
    flagCopy: true,
  },
  {
    title: "Состояние майнгинга",
    accessor: "miningState",
  },
  {
    title: "Статусы устройств",
    accessor: "statuses",
    width: 1,
  },
  {
    title: "Всего устройств",
    accessor: "counts",
    width: 1
  },
  {
    title: 'Роль',
    accessor: 'role',
    width: 11.4
  }
]

export const teamTableHead: TableHeadCellI[] = [
  {
    title: 'Логин',
    accessor: 'login',
    width: 20,
    flagCopy: true,
  },
  {
    title: 'ФИО',
    accessor: 'fullname',
    width: 20,
    flagCopy: true,
  },
  
  {
    title: 'Телефон',
    accessor: 'phone',
    width: 20,
    flagCopy: true,
  },
  {
    title: 'Email',
    accessor: 'email',
    width: 20,
    flagCopy: true,
  },
  {
    title: 'Роль',
    accessor: 'role',
    width: 20
  }
]
