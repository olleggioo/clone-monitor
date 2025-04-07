import { 
  useState, 
  useEffect, 
  useMemo, 
  useRef, 
  ChangeEvent, 
  FC, 
} from 'react'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { Dashboard } from '@/components'
import { Button, CustomSelect, Field } from '@/ui'
import { getNumberDeclinationString, getStatusName } from '@/helpers'
import { IconChevronDown, IconCross } from '@/icons'
import MultiSelectUser from '@/components/MultiSelect/User'
import { useAtom } from 'jotai'
import {
  devicesDataAtom,
  devicesFilterAtom,
  devicesFilterInitialState,
  DevicesFilterStateI,
  filteredNameContainer,
  sortFilterAtom
} from '@/atoms/appDataAtom'
import { selectPlaceholders } from '@/blocks/Devices/data'
import { OptionItemI } from '@/ui/CustomSelect/CustomSelect'
import { useDebounce } from '@/hooks'
import styles from './Filter.module.scss'
import MassField from '@/ui/MassField'

const LOCAL_STORAGE_KEY = 'devicesFilterState';


const DevicesFilter = () => {
    const router = useRouter()

    const [isFull, setIsFull] = useState(false)
    const [filterData, setFilterData] = useAtom(devicesFilterAtom)
    const [state, setState] = useState<DevicesFilterStateI>(() => {
      const savedState = sessionStorage.getItem(LOCAL_STORAGE_KEY);
      return savedState ? JSON.parse(savedState) : devicesFilterInitialState;
  });
  // console.log("State", state)
    useEffect(() => {
      console.warn = () => {};
    }, []);
    const [{ users, area, statuses, devices, algorithms, models, names }] = useAtom(devicesDataAtom)
    const debouncedState = useDebounce(state, 500)
    const [filteredName, setFilteredNames] = useAtom(filteredNameContainer);
    const [uniqueId, setUniqueId] = useState([])
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

    console.log("STATE", state)

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
            label: `${user.fullname}` || `${user.login}`,
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
        // console.log("HE", getSelectMultipleData('area', options))
      return getSelectMultipleData('area', options)
    }, [area, state.area])
    // console.log("AREAS", areaProps)

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

    const ownerProps = useMemo(() => {
      const options: OptionItemI[] =
        users?.map((user) => {
          return {
            label: `${user.fullname}` || `${user.login}`,
            value: user.id
          } as OptionItemI
        }) || []
      return getSelectMultipleData('owner', options)
    }, [users, state.owner])

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
      return getSelectMultipleData('name', filteredName)
    }, [state.name, filteredName])

    // const flashedProps = useMemo(() => {
    //   const options = [
    //     {
    //       label: "Прошит",
    //       value: true
    //     },
    //     {
    //       label: "Не прошит",
    //       value: "false"
    //     },
    //   ]
    //   return getSelectData('isFlashed', options)
    // }, [state.isFlashed])

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
        {
          label: "Не подмена",
          value: "false"
        },
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
        const newState = {
          ...prevState,
          [name]: value,
          page: 1
        }
        sessionStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
        return newState;
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

    const handleClientChange = (newValue: any) => {
      handleSelectChange('client', newValue || null)
    }

    const handleOwnerChange = (newValue: any) => {
      handleSelectChange('owner', newValue || null)
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

    const handleStatusChange = (option: OptionItemI) => {
      handleSelectChange('status', option.value)
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

    const handlePartNumberChange = (evt: ChangeEvent<HTMLInputElement>) => {
      handleSelectChange('partNumber', evt.target.value)
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

    // const handleToFlashedChange = (option: OptionItemI) => {
    //   handleSelectChange('isFlashed', option.value)
    // }

    const handleToFlashedChange = (e: any, option: any) => {
      handleSelectChange('isFlashed', option?.value)
    }

    const handleToGluedChange = (e: any, option: any) => {
      handleSelectChange('isGlued', option?.value)
    }

    const handleToDisabledChange = (e: any, option: any) => {
      handleSelectChange('isDisabled', option?.value)
    }

    const handleReset = () => {
      setState(devicesFilterInitialState)
      sessionStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(devicesFilterInitialState));
    }

    const handleMoreClick = () => {
      setIsFull((prev) => !prev)
    }

    useEffect(() => {
      setFilterData({
        ...state,
      })
    }, [state])

    return (
      <Dashboard
        title="Фильтр"
        className={classNames({
          [styles.isFull]: isFull,
        })}
      >
        <div className={classNames({
          [styles.fields]: true,
          [styles.slideIn]: isFull
        })}>
          <MultiSelectUser 
            {...clientProps}
            type='multiple-user'
            label='Клиенты'  
            onChange={handleClientChange}
            className={styles.field}
          />
          <Field
            value={state.worker}
            placeholder="Воркер"
            type="text"
            onChange={handleWorkerChange}
            wrapClassname={styles.fieldMedium}
          />
          {/* <Field
            value={state.sn}
            placeholder="SN"
            type="text"
            onChange={handleSnChange}
            wrapClassname={styles.field}
          /> */}
          <MassField 
            label="SN"
            onChange={handleSnChange}
            value={state.sn}
            onMassSearchChange={handleSnChange}
          />
          <MassField 
            label="IP адрес"
            onChange={handleIpChange}
            value={state.ip}
            onMassSearchChange={handleIpChange}
          />
          {/* <Field
            value={state.ip}
            placeholder="IP адрес"
            type="text"
            onChange={handleIpChange}
            wrapClassname={styles.fieldMedium}
            /> */}
          <MultiSelectUser
            {...areaProps}
            label='Площадки'
            type='multiple'
            onChange={handleAreaChange}
            className={styles.fieldMedium}
          />

          <MultiSelectUser
            {...statusProps}
            type='multiple'
            label='Статус'
            onChange={handleStatusMultipleChange}
            className={styles.fieldMedium}
          />

        {isFull && (
          <>
          <MultiSelectUser
            {...ownerProps}
            type='multiple-user'
            label='Владелец'
            onChange={handleOwnerChange}
            className={styles.field_small}
          />
          <MultiSelectUser
            {...algorithmProps}
            type='multiple'
            label='Алгоритмы'
            onChange={handleAlgorithmChange}
            className={styles.field_small}
          />
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
            {/* <CustomSelect
              {...flashedProps}
              onChange={handleToFlashedChange}
              className={styles.field}
            /> */}
            <MultiSelectUser 
              {...flashedProps}
              type='base'
              label='Прошивка'  
              onChange={handleToFlashedChange}
              className={styles.field}
            />
            {/* <CustomSelect
              {...gluedProps}
              onChange={handleToGluedChange}
              className={styles.field}
            /> */}
            <MultiSelectUser 
              {...gluedProps}
              type='base'
              label='Подмена'  
              onChange={handleToGluedChange}
              className={styles.field}
            />
            {/* <CustomSelect
              {...isDisabledProps}
              onChange={handleToDisabledChange}
              className={styles.field}
            /> */}
            <MultiSelectUser 
              {...isDisabledProps}
              type='base'
              label='Состояние майнинга'  
              onChange={handleToDisabledChange}
              className={styles.field}
            />

            {/* <Field
              value={state.mac}
              placeholder="MAC"
              type="text"
              onChange={handleMacChange}
              wrapClassname={styles.field_small}
            /> */}
            <MassField 
              label="MAC"
              onChange={handleMacChange}
              value={state.mac}
              onMassSearchChange={handleMacChange}
            />

            <Field
              value={state.pool}
              placeholder="Пул"
              type="text"
              onChange={handlePoolChange}
              wrapClassname={styles.field_small}
            />
            <Field
              value={state.partNumber}
              placeholder="Номер поставки"
              type="text"
              onChange={handlePartNumberChange}
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