import { TableHeadCellI } from '@/components/Table/Table'

export const tableWorkerShortHeads: TableHeadCellI[] = [
  {
    title: 'Воркер',
    accessor: 'workerName'
  },
  {
    title: 'Отказ',
    accessor: 'rejectrate'
  },
  {
    title: 'Хэшрейт, 15 мин',
    accessor: 'hashrate15'
  },
  {
    title: 'Обновлено',
    accessor: 'updateTime'
  }
]
export const tableAllHeads: TableHeadCellI[] = [
  {
    title: 'Дата',
    accessor: 'effective_at'
  },
  {
    title: 'Тип операции',
    accessor: 'operationType'
  },
  {
    title: 'Сумма',
    accessor: 'amount'
  },
  {
    title: 'Статус',
    accessor: 'paymentStatus'
  }
]

export const tableRewardHeads: TableHeadCellI[] = [
  {
    title: 'Дата',
    accessor: 'created_at'
  },
  {
    title: 'Период',
    accessor: 'effective_at'
  },
  {
    title: 'Хэшрейт',
    accessor: 'metadata'
  },
  {
    title: 'Сумма',
    accessor: 'amount'
  },
  {
    title: 'Статус',
    accessor: 'paymentStatus'
  }
]

export const tablePayoutHeads: TableHeadCellI[] = [
  {
    title: 'Дата',
    accessor: 'created_at'
  },
  {
    title: 'Ссылка',
    accessor: 'id'
  },
  {
    title: 'Сумма',
    accessor: 'amount'
  },
  {
    title: 'Статус',
    accessor: 'paymentStatus'
  }
]

export const tableAllHeadsFinance: TableHeadCellI[] = [
  {
    title: 'Дата',
    accessor: 'created_at'
  },
  {
    title: 'Тип операции',
    accessor: 'operationType'
  },
  {
    title: 'Сумма',
    accessor: 'amount'
  },
  {
    title: 'Статус',
    accessor: 'paymentStatus'
  }
]

export const tableWorkerHeads: TableHeadCellI[] = [
  {
    title: 'Воркер',
    accessor: 'workerName'
  },
  {
    title: 'Отказ',
    accessor: 'rejectrate'
  },
  {
    title: 'Хэшрейт, 15 мин',
    accessor: 'hashrate15'
  },
  {
    title: 'Хэшрейт, Час',
    accessor: 'hashrate1h'
  },
  {
    title: 'Хэшрейт, день',
    accessor: 'hashrate1d'
  },
  {
    title: 'Обновлено',
    accessor: 'updateTime'
  },
  {
    title: 'График',
    accessor: 'chartData'
  }
]

export const tableAllHeadsDevices: TableHeadCellI[] = [
  {
    title: 'Модель',
    accessor: 'workerName'
  },
  {
    title: 'Клиент',
    accessor: 'workerName'
  },
  {
    title: 'Дата-центр',
    accessor: 'workerName'
  },
  {
    title: 'UPTIME',
    accessor: 'workerName'
  },
  {
    title: 'SN',
    accessor: 'workerName'
  }
]
