import { 
  useState, 
  useEffect, 
  useMemo, 
  useRef, 
  ChangeEvent, 
  FC, 
} from 'react'
import { useRouter } from 'next/router'
import styles from './Filter.module.scss'
import { Dashboard } from '@/components'
import { Button, CustomSelect, Field } from '@/ui'

import { getNumberDeclinationString, getStatusName } from '@/helpers'
import { IconChevronDown, IconCross } from '@/icons'
import classNames from 'classnames'

import { useAtom } from 'jotai'
import {
  devicesDataAtom,
  devicesFilterAtom,
  devicesFilterInitialState,
  DevicesFilterStateI,
  filteredNameContainer,
  filteredNamesAtom,
  sortFilterAtom
} from '@/atoms/appDataAtom'
import { OptionItemI } from '@/ui/CustomSelect/CustomSelect'
import { selectPlaceholders } from '@/blocks/Devices/data'
import { useDebounce } from '@/hooks'
import MultiSelectUser from '@/components/MultiSelect/User'

const DevicesFilter: FC<{statusTab?: any}> = ({statusTab}) => {

    const [isFull, setIsFull] = useState(false)
    const [filterData, setFilterData] = useAtom(devicesFilterAtom)
    const [sortFilter, setSortFilter] = useAtom(sortFilterAtom)
    const [state, setState] = useState<DevicesFilterStateI>(
      filterData
    )
    useEffect(() => {
      console.warn = () => {};
    }, []);
    const [{ users, area, statuses, devices, algorithms, models, names }] = useAtom(devicesDataAtom)
    const debouncedState = useDebounce(state, 500)
    const [filteredName, setFilteredNames] = useAtom(filteredNameContainer);
    const tabControls: any[] = useMemo(() => {
      const statusList = statuses && statuses.map((status) => {
        const count = filterData.status && filterData.status.length !== 0
          ? filterData.status.some((filterStatus) => filterStatus.value === status.id)
            ? status.count
            : undefined
          : status.count;
        return {
          count
        };
      });
      return statusList ? [...statusList] : [];
    }, [statuses]);
    const countSuffix = getNumberDeclinationString(tabControls.reduce((prevState, accamulator) => accamulator.count === undefined ? prevState + 0 : prevState + accamulator.count, 0), [
      'устройство',
      'устройства',
      'устройств'
    ])
    const autocompleteRef = useRef<HTMLInputElement>(null);


    const getSelectData = (
      name: keyof DevicesFilterStateI,
      options: OptionItemI[]
    ) => {
      const selected =
        state[name] !== null
          ? options.find((option) => option.value === state[name]) ||
            selectPlaceholders[name]
          : selectPlaceholders[name]
      return {
        placeholder: selectPlaceholders[name]
          ? selectPlaceholders[name]
          : undefined,
        options,
        selectedOption: selected
      }
    }

    const getSelectMultipleData = (
        name: keyof DevicesFilterStateI,
        options: OptionItemI[]
      ) => {
        const selected =
        state[name] !== null
          ? options.filter((item: any) => state[name]?.some((item2: any) => item.value === item2.value))
          : selectPlaceholders[name]
      return {
        placeholder: selectPlaceholders[name]
          ? selectPlaceholders[name]
          : undefined,
        options,
        selectedOption: selected
      }
    }

    const clientProps = useMemo(() => {
      const options: OptionItemI[] =
        users?.map((user) => {
          return {
            label: user.fullname || user.login,
            value: user.id
          } as OptionItemI
        }) || []
      return getSelectMultipleData('client', options)
    }, [users, state.client])
    const modelProps = useMemo(() => {
      const options: OptionItemI[] =
        models?.map((model: any) => {
          return {
            label: model.name,
            value: model.id
          } as OptionItemI
        }) || []
      return getSelectMultipleData('model', options)
    }, [models, state.model])

    const areaProps = useMemo(() => {
      const options: OptionItemI[] =
        area?.map((item) => {
          return {
            label: item.name,
            value: item.id
          } as OptionItemI
        }) || []
      return getSelectMultipleData('area', options)
    }, [area, state.area])

    const algorithmProps = useMemo(() => {
      const options: OptionItemI[] =
        algorithms?.map((item: any) => {
          return {
            label: item.name,
            value: item.id
          } as OptionItemI
        }) || []
      return getSelectMultipleData('algorithm', options)
    }, [area, state.algorithm])

    const statusProps = useMemo(() => {
      const options: OptionItemI[] =
        statuses?.map((item) => {
          const label = getStatusName(item.name)
          return {
            label,
            value: item.id
          } as OptionItemI
        }) || []
      return getSelectMultipleData('status', options)
    }, [statuses, state.status])

    const namesProps = useMemo(() => {
      // const options: OptionItemI[] =
      //   names?.map((item: any) => {
      //     return {
      //       label: item.name,
      //       value: item.id
      //     } as OptionItemI
      //   }) || []
      return getSelectMultipleData('name', filteredName)
    }, [state.name, filteredName])

    const flashedProps = useMemo(() => {
      const options = [
        {
          label: "Прошит",
          value: true
        },
        {
          label: "Не прошит",
          value: "false"
        },
      ]
      return getSelectData('isFlashed', options)
    }, [state.isFlashed])

    const gluedProps = useMemo(() => {
      const options = [
        {
          label: "Подмена",
          value: true
        },
        // {
        //   label: "Не переклеен",
        //   value: "false"
        // },
      ]
      return getSelectData('isGlued', options)
    }, [state.isGlued])
    const isDisabledProps = useMemo(() => {
      const options = [
        {
          label: "Выключен",
          value: true
        },
        {
          label: "Включён",
          value: "false"
        },
      ]
      return getSelectData('isDisabled', options)
    }, [state.isDisabled])
    const handleSelectChange = (
      name: keyof DevicesFilterStateI,
      value: string | null | boolean | any
    ) => {
      setState((prevState) => {
        return {
          ...prevState,
          [name]: value,
          page: 1
        }
      })
      if (name === 'area') {
        setFilteredNames([])
        setState((prevState) => {
          return {
            ...prevState,
            name: []
          }
        })
        const areasValuesSet = new Set(value.map((area: any) => area.value));
        const filteredNames = names?.filter((e: any) => areasValuesSet.has(e.areaId)).map((item: any) => ({
          label: item.name,
          value: item.id
        }) as OptionItemI) || [];
        const uniqueLabels: Record<string, string[]> = {};
        const combinedIdsArray = [];
        filteredNames.forEach((item: any) => {
          const { label, value } = item;
  
          if (uniqueLabels[label]) {
            uniqueLabels[label].push(value);
          } else {
            uniqueLabels[label] = [value];
          }
        });
        const newObj = Object.entries(uniqueLabels).map(([label, value]) => ({
          label,
          value,
        }))
        setFilteredNames(newObj);
      }
    }

    const handleModelChange = (newValue: any) => {
      handleSelectChange('model', newValue || null)
    }

    const handleAreaChange = (newValue: any) => {
      handleSelectChange('area', newValue || null)
    }

    const handleAlgorithmChange = (newValue: any) => {
      handleSelectChange('algorithm', newValue || null)
    }

    const handleStatusMultipleChange = (newValue: any) => {
      handleSelectChange('status', newValue || null)
    }

    const handleNameChange = (newValue: any) => {
      handleSelectChange('name', newValue || [])
    }

    const handleIpChange = (evt: ChangeEvent<HTMLInputElement>) => {
      handleSelectChange('ip', evt.target.value)
    }

    const handleSnChange = (evt: ChangeEvent<HTMLInputElement>) => {
      handleSelectChange('sn', evt.target.value)
    }

    const handleMacChange = (evt: ChangeEvent<HTMLInputElement>) => {
      handleSelectChange('mac', evt.target.value)
    }

    const handleCommentChange = (evt: ChangeEvent<HTMLInputElement>) => {
      handleSelectChange('comment', evt.target.value)
    }

    const handlePlaceChange = (evt: ChangeEvent<HTMLInputElement>) => {
      handleSelectChange('place', evt.target.value)
    }

    const handlePoolChange = (evt: ChangeEvent<HTMLInputElement>) => {
      handleSelectChange('pool', evt.target.value)
    }

    const handleWorkerChange = (evt: ChangeEvent<HTMLInputElement>) => {
      handleSelectChange('worker', evt.target.value)
    }

    const handleFromIpChange = (evt: ChangeEvent<HTMLInputElement>) => {
      handleSelectChange('from', evt.target.value)
    }

    const handleToIpChange = (evt: ChangeEvent<HTMLInputElement>) => {
      handleSelectChange('to', evt.target.value)
    }

    const handleToFlashedChange = (option: OptionItemI) => {
      handleSelectChange('isFlashed', option.value)
    }

    const handleToGluedChange = (option: OptionItemI) => {
      handleSelectChange('isGlued', option.value)
    }

    const handleToDisabledChange = (option: OptionItemI) => {
      handleSelectChange('isDisabled', option.value)
    }

    const handleReset = () => {
      setState(devicesFilterInitialState)
    }

    const handleMoreClick = () => {
      setIsFull((prev) => !prev)
    }

    useEffect(() => {
      setFilterData({
        ...debouncedState,
      })
    }, [debouncedState])
    
    return (
      <Dashboard
        title="Фильтр"
        className={classNames({
          [styles.isFull]: isFull
        })}
      >
        <div className={styles.fields}>
          <MultiSelectUser
            {...areaProps}
            label='Площадки'
            type='multiple'
            onChange={handleAreaChange}
            className={styles.field}
          />

          <MultiSelectUser
            {...algorithmProps}
            type='multiple'
            label='Алгоритмы'
            onChange={handleAlgorithmChange}
            className={styles.field}
          />

          <MultiSelectUser
            {...statusProps}
            type='multiple'
            label='Статус'
            onChange={handleStatusMultipleChange}
            className={styles.field}
          />
          <Field
            value={state.worker}
            placeholder="Воркер"
            type="text"
            onChange={handleWorkerChange}
            wrapClassname={styles.field}
          />
          <Field
            value={state.sn}
            placeholder="SN"
            type="text"
            onChange={handleSnChange}
            wrapClassname={styles.field}
          />

        {isFull && (
          <>
            <MultiSelectUser 
              {...modelProps}
              type='multiple'
              label='Модель'  
              onChange={handleModelChange}
              className={styles.field}
            />
            {state.area && state.area.length === 1 && <MultiSelectUser 
              {...namesProps}
              label='Контейнер'  
              type={"multiple"}
              innerRef={autocompleteRef}
              onChange={handleNameChange}
              className={styles.field}
            />}
            <CustomSelect
              {...flashedProps}
              onChange={handleToFlashedChange}
              className={styles.field}
            />
            <CustomSelect
              {...gluedProps}
              onChange={handleToGluedChange}
              className={styles.field}
            />
            <CustomSelect
              {...isDisabledProps}
              onChange={handleToDisabledChange}
              className={styles.field}
            />
            <Field
              value={state.ip}
              placeholder="IP адрес"
              type="text"
              onChange={handleIpChange}
              wrapClassname={styles.field}
            />

            <Field
              value={state.mac}
              placeholder="MAC"
              type="text"
              onChange={handleMacChange}
              wrapClassname={styles.field_small}
            />

            <Field
              value={state.pool}
              placeholder="Пул"
              type="text"
              onChange={handlePoolChange}
              wrapClassname={styles.field_small}
            />
            <Field
              value={state.comment}
              placeholder="Комментарий"
              type="text"
              onChange={handleCommentChange}
              wrapClassname={styles.field_small}
            />
            {state.area && state.area.length !== 0 && state.name && state.name.length !== 0 && <Field
              value={state.place}
              placeholder="Место"
              type="text"
              onChange={handlePlaceChange}
              wrapClassname={styles.field_small}
            />}
          </>
        )}
      </div>

      <div className={styles.bottom}>
        <div className={styles.count}>
          {statuses ? `Найдено ${countSuffix}` : 'Устройств не найдено'}
        </div>

        <div className={styles.actions}>
          <Button
            title="Сбросить фильтры"
            icon={<IconCross width={20} height={20} />}
            appearance="text"
            onClick={handleReset}
            className={styles.resetBtn}
          />

          <Button
            title={isFull ? 'Свернуть фильтры' : 'Еще фильтры'}
            iconRight={<IconChevronDown width={20} height={20} />}
            appearance="text"
            onClick={handleMoreClick}
            className={styles.moreBtn}
          />
        </div>
      </div>
    </Dashboard>
  )
}
export default DevicesFilter