import { TableHeadCellI } from '@/components/Table/Table'
import { DevicesFilterStateI } from '@/atoms/appDataAtom'
import { OptionItemI } from '@/ui/CustomSelect/CustomSelect'
import { Table } from 'react-virtualized'

export const devicesTableHead: TableHeadCellI[] = [
  {
    title: 'Модель',
    accessor: 'model',
    width: 10
  },
  {
    title: "Rate ideal",
    accessor: "nominalHashrate",
    width: 8,
  },
  {
    title: "Rate real",
    accessor: "deviceBoards",
    width: 8
  },
  {
    title: 'Клиент',
    accessor: 'user',
    width: 14
  },
  {
    title: 'Пул',
    accessor: 'devicePool',
    width: 12
  },
  {
    title: 'Воркер',
    accessor: 'deviceWorker',
    width: 14
  },
  {
    title: 'Дата-центр',
    accessor: 'area',
    width: 12
  },
  {
    title: 'UPTIME',
    accessor: 'uptimeElapsed',
    width: 8
  },
  {
    title: 'IP',
    accessor: 'ipaddr',
    width: 10
  },
  {
    title: "Прошит",
    accessor: "isFlushed",
    width: 4,
  },
  {
    title: "Подмена",
    accessor: "isGlued",
    width: 2,
    align: 'right'
  },
  
]

export const devicesArchiveRolledTableHead: TableHeadCellI[] = [
  {
    title: 'Модель',
    accessor: 'model',
    width: 10,
    flagCopy: true,
  },
  {
    title: "Идеальный хэшрейт",
    accessor: "nominalHashrate",
    width: 6,
    flagCopy: false,

  },
  // {
  //   title: 'IP',
  //   accessor: 'ipaddr',
  //   width: 10,
  // },
  {
    title: 'Клиент',
    accessor: 'user',
    width: 10,
    flagCopy: true,
  },
  {
    title: 'Владелец',
    accessor: "owner"
  },
  {
    title: 'Воркер',
    accessor: 'deviceWorker',
    width: 10,
    flagCopy: true,

  },
  {
    title: 'Пул',
    accessor: 'devicePool',
    width: 10,
    flagCopy: true,

  },
  {
    title: 'Дата-центр',
    accessor: 'area',
    width: 10
  },
  {
    title: "Контейнер",
    accessor: "container"
  },
  // {
  //   title: "SN",
  //   accessor: "sn",
  //   width: 10
  // },
  {
    title: "В норме",
    accessor: "lastSeenNormal",
  }
]

export const devicesRolledTableHead: TableHeadCellI[] = [
  {
    title: 'Модель',
    accessor: 'model',
    width: 10,
    flagCopy: true,
  },
  {
    title: "Идеальный хэшрейт",
    accessor: "nominalHashrate",
    width: 6,
    flagCopy: false,

  },
  {
    title: "Текущий хэшрейт",
    accessor: "deviceBoards",
    width: 6,
    flagCopy: false,

  },
  {
    title: "Потребление",
    accessor: "energy",
    width: 6,
    flagCopy: false,

  },
  // {
  //   title: 'IP',
  //   accessor: 'ipaddr',
  //   width: 10,
  // },
  {
    title: 'Клиент',
    accessor: 'user',
    width: 10,
    flagCopy: true,
  },
  {
    title: 'Владелец',
    accessor: "owner",
    flagCopy: true,
  },
  {
    title: 'Воркер',
    accessor: 'deviceWorker',
    width: 10,
    flagCopy: true,

  },
  {
    title: 'Пул',
    accessor: 'devicePool',
    width: 10,
    flagCopy: true,
  },
  {
    title: 'Номер поставки',
    accessor: 'partNumber',
    width: 10,
    flagCopy: true,
  },
  {
    title: 'Дата-центр',
    accessor: 'area',
    width: 10
  },
  {
    title: "Контейнер",
    accessor: "container"
  },
  {
    title: "Процент отказа",
    accessor: "rejectedPollsProcents"
  },
  // {
  //   title: "SN",
  //   accessor: "sn",
  //   width: 10
  // },
  {
    title: 'Время работы',
    accessor: 'uptimeElapsed',
    width: 10,
  },
  {
    title: 'Состояние майнинга',
    accessor: "miningState"
  },
  {
    title: "Прошит",
    accessor: "isFlushed",
    width: 2
  },
  {
    title: "Подмена",
    accessor: "isGlued",
    width: 2
  },
  {
    title: "В норме",
    accessor: "lastSeenNormal",
  },
  {
    title: "В сети",
    accessor: "notOnlinedAt"
  }
]

export const boardsTableHead: TableHeadCellI[] = [
  {
    title: "",
    accessor: "icon"
  },
  {
    title: 'Хэшрейт',
    accessor: 'rateReals'
  },
  {
    title: 'Температура',
    accessor: 'tempOutlet'
  },
  {
    title: 'Чипы',
    accessor: 'chipNum'
  },
  {
    title: 'Температура чипов',
    accessor: 'tempChip'
  }
]

export const coolersTableHead: TableHeadCellI[] = [
  {
    title: "",
    accessor: "icon"
  },
  {
    title: "Кулеры",
    accessor: "cooler"
  },
  {
    title: "Обороты",
    accessor: "rpm"
  },
  {
    title: "Статус",
    accessor: "status"
  }
]

export const poolReserveTableHead: TableHeadCellI[] = [
  {
    title: 'Url',
    accessor: 'url',
  },
  {
    title: 'Воркер',
    accessor: 'user',
    align: 'center'
  },
]

export const poolTableHead: TableHeadCellI[] = [
  // {
  //   title: 'Имя',
  //   accessor: 'name',
  // },
  {
    title: 'Url',
    accessor: 'url',
  },
  {
    title: 'Воркер',
    accessor: 'user',
    align: 'center'
  },
  {
    title: 'Статус',
    accessor: 'status',
    align: 'center'
  }
]

export const logTableHead: TableHeadCellI[] = [
  {
    title: "Дата",
    accessor: "createdAt",
    width: 10,
    gap: 20,
  },
  {
    title: "Пользователь",
    accessor: "user",
    width: 15,
    gap: 20,
  },
  {
    title: "Действие",
    accessor: "action",
    width: 15,
    gap: 20,
  },
  {
    title: "До",
    accessor: "before",
    width: 30,
  },
  {
    title: "После",
    accessor: "after"
  },
  {
    title: "Источник IP",
    accessor: "executorIp"
  },
  // {
  //   title: "PrevData",
  //   accessor: "prevdata"
  // },
  {
    title: "Агент",
    accessor: "source",
    width: 10,
    gap: 20
  },
]

export const logByUserTableHead: TableHeadCellI[] = [
  {
    title: "Дата",
    accessor: "createdAt",
    width: 10,
    gap: 20,
  },
  {
    title: "Пользователь",
    accessor: "user",
    width: 15,
    gap: 20,
  },
  {
    title: "Действие",
    accessor: "action",
    width: 15,
    gap: 20,
  },
  {
    title: "До",
    accessor: "before",
    width: 30,
  },
  {
    title: "После",
    accessor: "after"
  },
  {
    title: "Информация",
    accessor: "info"
  },
  {
    title: "Источник IP",
    accessor: "executorIp"
  },
  // {
  //   title: "PrevData",
  //   accessor: "prevdata"
  // },
  {
    title: "Агент",
    accessor: "source",
    width: 10,
    gap: 20
  },
]

export const logUserTableHead: TableHeadCellI[] = [
  {
    title: "Дата",
    accessor: "createdAt",
    width: 10,
    gap: 20,
  },
  {
    title: "Название",
    accessor: "title",
    width: 15,
    gap: 20,
  },
  {
    title: "Сообщение",
    accessor: "message",
    width: 50,
    gap: 20,
  },
  {
    title: "Info",
    accessor: "data"
  },
  {
    title: "Options",
    accessor: "options"
  },
  {
    title: "PrevData",
    accessor: "prevdata"
  },
  {
    title: "Источник",
    accessor: "source",
    width: 10,
    gap: 20
  },
]

export const logAntminerTableHead: TableHeadCellI[] = [
  {
    title: "Дата",
    accessor: "createdAt"
  },
  {
    title: "Сообщение",
    accessor: "messages"
  }
]

export const accessTableHead: TableHeadCellI[] = [
  {
    title: "Функция",
    accessor: "function"
  },
  {
    title: "Описание",
    accessor: "description"
  }
]

export const logErrorTableHead: TableHeadCellI[] = [
  {
    title: "Обнаружено",
    accessor: "discovered",
    width: 15,
    gap: 20,
  },
  {
    title: "Дата",
    accessor: "createdAt",
    width: 10,
    gap: 20,
  },
  {
    title: "Сообщение",
    accessor: "processing",
    width: 15,
    gap: 20,
  },
  {
    title: "Причина",
    accessor: "reason",
    width: 50,
    gap: 20,
  },
  {
    title: "Код",
    accessor: "code",
    width: 10,
    gap: 20
  }
]

export const commentsTableHead: TableHeadCellI[] = [
  {
    title: "Пользователь",
    accessor: "user"
  },
  {
    title: "Комментарий",
    accessor: "comment",
  },
  {
    title: "Дата",
    accessor: "createdAt"
  }
]

export const modelsTableHead: TableHeadCellI[] = [
  {
    title: "Название",
    accessor: "name"
  },
  {
    title: "Энергоэффективность",
    accessor: "nominalEnergy"
  }
]

export const areasTableHead: TableHeadCellI[] = [
  {
    title: "Диапазон от",
    accessor: "from",
  },
  {
    title: "Диапазон до",
    accessor: "to",
  },
  {
    title: "Имя",
    accessor: "name"
  }
]

export const accessesTableHead: TableHeadCellI[] = [
  {
    title: "Название функции",
    accessor: "name"
  },
  {
    title: "Описание",
    accessor: "description"
  }
]

export const poolMockTableHead: TableHeadCellI[] = [
  {
    title: "Имя",
    accessor: "name",
    flagCopy: true
  },
  {
    title: "Url 1",
    accessor: "url",
    flagCopy: true
  },
  {
    title: "Url 2",
    accessor: "url1",
    flagCopy: true
  },
  {
    title: "Url 3",
    accessor: "url2",
    flagCopy: true
  },
]

export const selectPlaceholdersExport: {
  [x: string]: OptionItemI
} = {
  client: {
    label: 'Клиент',
    value: null
  },
  table: {
    label: 'Таблица',
    value: null
  }
}

export const selectPlaceholders: {
  [x: string]: OptionItemI
} = {
  client: {
    label: 'Клиент',
    value: null
  },
  area: {
    label: 'Площадка',
    value: null
  },
  algorithm: {
    label: 'Алгоритм',
    value: null
  },
  status: {
    label: 'Статус',
    value: null
  },
  model: {
    label: 'Модель',
    value: null
  },
  ranges: {
    label: "Контейнеры",
    value: null
  },
  isFlashed: {
    label: "Прошивка",
    value: null
  },
  isGlued: {
    label: "Подмена",
    value: null
  },
  isDisabled: {
    label: "Состояние майнгинга",
    value: null
  }
}

export const devicesModelOptions = [
  {
    label: 'Antminer-s19j-pro',
    value: 'antminer-s19j-pro'
  },
  {
    label: 'Whats-miner-m50-vh20',
    value: 'whats-miner-m50-vh20'
  }
]

export const devicesPoolNameOptions = [
  {
    label: '',
    value: ''
  },
  {
    label: '',
    value: ''
  }
]

export const devicesPoolWorkerOptions = [
  {
    label: '',
    value: ''
  },
  {
    label: '',
    value: ''
  }
]

export const devicesAlgorithmOptions = [
  {
    label: 'SHA-256',
    value: 'sha256'
  },
  {
    label: 'Scrypt',
    value: 'scrypt'
  },
  {
    label: 'Eaglesong',
    value: 'eaglesong'
  },
  {
    label: 'Ethash',
    value: 'ethash'
  }
]
