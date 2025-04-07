import { ChangeEvent, FC, memo, useState } from 'react'
import { Button, Field } from '@/ui'

import { getNumberDeclinationString } from '@/helpers'
import { IconCross } from '@/icons'

import { useAtom } from 'jotai'
import {
  devicesUserIdFilterAtom,
  usersFilterAtom
} from '@/atoms/appDataAtom'
import styles from './UsersFilter.module.scss'

const UsersFilter: FC<{setPage?: (n: number) => void}> = ({setPage}) => {

    const [filterData, setFilterData] = useAtom(usersFilterAtom)
    const [state, setState] = useState<{name: string, phone: string, contract: string}>(
        filterData
    )
    const [stateUsers, setStateUsers] = useAtom(devicesUserIdFilterAtom)

  const handleNameChange = (evt: ChangeEvent<HTMLInputElement>) => {
    if (setPage) {
        setPage(1)
    }
    setFilterData((prevState: { name: string, phone: string, contract: string }) => {
        return {
          ...prevState,
          name: evt.target.value
        };
      });
  }

  const handlePhoneChange = (evt: ChangeEvent<HTMLInputElement>) => {
    if (setPage) {
        setPage(1)
    }
    setFilterData((prevState: { name: string, phone: string, contract: string }) => {
        return {
          ...prevState,
          phone: evt.target.value
        };
      });
  }

  const handleContractChange = (evt: ChangeEvent<HTMLInputElement>) => {
    if (setPage) {
        setPage(1)
    }
    setFilterData((prevState: { name: string, phone: string, contract: string }) => {
        return {
          ...prevState,
          contract: evt.target.value
        };
      });
  }

  const countSuffixUsers = getNumberDeclinationString(stateUsers.length, [
    'пользователь',
    'пользоавтеля',
    'пользователей'
  ])

  return (
    <>
      <div className={styles.el}>
        <Field
          placeholder="Найти по ФИО"
          type="text"
          value={filterData.name}
          onChange={handleNameChange}
          // wrapClassname={styles.field}
        />
        <Field 
          placeholder='Найти по номеру телефона'
          type='text'
          value={filterData.phone}
          onChange={handlePhoneChange}
        />
        <Field 
          placeholder='Найти по номеру договора'
          type='text'
          value={filterData.contract}
          onChange={handleContractChange}
        />
      </div>
      <div className={styles.resetBtn}>
        <p>Выбрано {countSuffixUsers}</p>  
        <Button
          title="Сбросить фильтры"
          icon={<IconCross width={20} height={20} />}
          appearance="text"
          onClick={() => {
            setFilterData((prevState: any) => {
              return {
                ...prevState,
                name: '',
                phone: '',  
                contract: ''
              }
            })
          }}
          className={styles.resetBtn}
        />
      </div>
    </>
  )
}
export default memo(UsersFilter)
