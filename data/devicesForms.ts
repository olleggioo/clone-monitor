import { OptionItemI } from '@/ui/CustomSelect/CustomSelect'
import {
  devicesAlgorithmOptions,
  devicesModelOptions
} from '@/blocks/Devices/data'

export const modelPlaceholder = { label: 'Выберите модель', value: 'default' }
export const modelOptions = [
  { label: 'Whatsminer M30S++', value: 'Whatsminer' }
]
export const poolNameOptions = [
  { label: 'btc.viabtc.io', value: 'btc.viabtc.io' }
]

export const poolWorkerOptions = [
  {label: 'Dimon2712.7x44', value: 'Dimon2712.7x44'}
]

export const locationPlaceholder = {
  label: 'Выберите площадку',
  value: null
}

export const poolNamePlaceholder = {
  label: 'Выберите пул',
  value: null
}

export const poolUrlPlaceholder = {
  label: 'Выберите url пула',
  value: null
}

export const poolWorkerPlaceholder = {
  label: 'Выберите воркера',
  value: null
}

export const algorithmPlaceholder = {
  label: 'Выберите алгоритм',
  value: null
}

export const statusPlaceholder = {
  label: 'Выберите статус',
  value: null
}

export const gluedPlaceholder = {
  label: 'Выберите подмена',
  value: null
}

export const locationOptions = [{ label: 'Площадка 1', value: 'location-1' }]
export const statusOptions = [{ label: 'В норме', value: 'location-1' }]

export const clientPlaceholder = {
  label: 'Назначьте клиента',
  value: null
}

export const clientOptions = [{ label: 'Клиент 1', value: 'client-1' }]
export const gluedOptions = [{
  label: 'Выберите подмена',
  value: null
}]

export type SelectData = {
  type: 'select'
  value: OptionItemI
  options: OptionItemI[]
  label: string
  name: string
  disabled?: boolean
}

export type FieldData = {
  label: string
  name: string
  type?: 'field'
  disabled?: boolean
}

export type RowData = {
  type: 'row'
  fields: FieldData[]
}

export type FieldsType = SelectData | FieldData | RowData | any

export interface DevicesFormFieldsetI {
  title: string
  fields: FieldsType[]
}

export const devicesFormPoolFieldsets: DevicesFormFieldsetI[] = [
  {
    title: "Выберите пул",
    fields: [
      {
        type: 'select',
        value: poolNamePlaceholder,
        options: poolNameOptions,
        label: 'Имя пула',
        name: 'name0'
      }
    ]
  },
  {
    title: 'Пул 1',
    fields: [
      {
        type: 'select',
        value: poolNamePlaceholder,
        options: poolNameOptions,
        label: 'Url пула',
        name: 'url1'
      },
      {
        label: "Отсчёт воркера",
        name: "from",
        type: "number"
      },
      {
        label: 'Воркер',
        name: 'worker1'
      },
      {
        label: 'Пароль',
        name: 'password1'
      },
    ]
  },
  {
    title: 'Пул 2',
    fields: [
      {
        type: 'select',
        value: poolNamePlaceholder,
        options: poolNameOptions,
        label: 'Url пула',
        name: 'url2'
      },
      {
        label: 'Воркер',
        name: 'worker2'
      },
      {
        label: 'Пароль',
        name: 'password2'
      },
    ]
  },
  {
    title: 'Пул 3',
    fields: [
      {
        type: 'select',
        value: poolNamePlaceholder,
        options: poolNameOptions,
        label: 'Url пула',
        name: 'url3'
      },
      {
        label: 'Воркер',
        name: 'worker3'
      },
      {
        label: 'Пароль',
        name: 'password3'
      },
    ]
  },
]

export const devicesFormFieldsets: DevicesFormFieldsetI[] = [
  {
    title: 'Данные устройства',
    fields: [
      {
        type: 'select',
        value: modelPlaceholder,
        options: modelOptions,
        label: 'Модель',
        name: 'model',
        disabled: true
      },
      {
        type: 'select',
        value: devicesAlgorithmOptions[0],
        options: devicesAlgorithmOptions,
        label: 'Алгоритм',
        name: 'algorithm',
        disabled: true
      },
      {
        label: 'Номинальный хэшрейт',
        name: 'hashrate',
        disabled: true
      },
      {
        label: 'IP адрес',
        name: 'ip',
        disabled: true
      },
      {
        label: 'MAC адрес',
        name: 'mac',
        disabled: true
      },
      {
        label: 'Cерийный номер',
        name: 'serialNum'
      },
      {
        label: 'Cерийный номер БП',
        name: 'serialNumPower'
      },
      {
        type: 'select',
        value: locationPlaceholder,
        options: locationOptions,
        label: 'Площадка',
        name: 'location',
        disabled: true
      },
      {
        type: 'select',
        value: statusPlaceholder,
        options: statusOptions,
        label: "Статус",
        name: "status",
        disabled: true
      }
    ]
  },
  {
    title: 'Размещение',
    fields: [
      {
        label: 'Здание/контейнер',
        name: 'building',
        disabled: true
      },
      {
        type: 'row',
        fields: [
          {
            label: 'Стойка',
            name: 'stand'
          },
          {
            label: 'Полка',
            name: 'shelf'
          },
          {
            label: 'Место',
            name: 'place'
          }
        ]
      },
      {
        label: 'Комментарий',
        name: 'comment'
      }
    ]
  },
  {
    title: 'Клиент',
    fields: [
      {
        type: 'multi-select',
        value: clientPlaceholder,
        options: clientOptions,
        label: 'Клиент',
        name: 'client'
      },
      {
        type: 'select',
        value: gluedPlaceholder,
        options: gluedOptions,
        label: "Подмена",
        name: "glued",
      }
    ]
  },
]

export const deviceUserFormField: DevicesFormFieldsetI = {
  title: 'Клиент',
  fields: [
    {
      type: 'select',
      value: clientPlaceholder,
      options: clientOptions,
      label: 'Клиент',
      name: 'client'
    },
  ]
}