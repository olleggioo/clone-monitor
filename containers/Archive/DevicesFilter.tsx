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
      devicesArchiveDataAtom,
      devicesArchiveFilterAtom,
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
  import styles from './../../blocks/Devices/Filter/Filter.module.scss'
import MassField from '@/ui/MassField'
  
  const LOCAL_STORAGE_KEY = 'devicesFilterState';
  
  
const DevicesFilterArchive = () => {
    const router = useRouter()
  
    const [isFull, setIsFull] = useState(false)
    const [filterData, setFilterData] = useAtom(devicesArchiveFilterAtom)
    const [sortFilter, setSortFilter] = useAtom(sortFilterAtom)
    const [state, setState] = useState<DevicesFilterStateI>(
        filterData
    )
    // console.log("State", state)
    useEffect(() => {
        console.warn = () => {};
    }, []);
    const [{ statuses, models, names, users }] = useAtom(devicesArchiveDataAtom)
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

    const handleClientChange = (newValue: any) => {
      handleSelectChange('client', newValue || null)
    }

    const handlePartNumberChange = (evt: ChangeEvent<HTMLInputElement>) => {
      handleSelectChange('partNumber', evt.target.value)
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
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
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
  
      const handleModelChange = (newValue: any) => {
        handleSelectChange('model', newValue || null)
      }
  
      const handleSnChange = (evt: ChangeEvent<HTMLInputElement>) => {
        handleSelectChange('sn', evt.target.value)
      }
  
      const handleReset = () => {
        setState(devicesFilterInitialState)
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(devicesFilterInitialState));
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
            <Field
              value={state.partNumber}
              placeholder="Номер поставки"
              type="text"
              onChange={handlePartNumberChange}
              wrapClassname={styles.field_small}
            />
            <MultiSelectUser 
              {...clientProps}
              type='multiple-user'
              label='Клиенты'  
              onChange={handleClientChange}
              className={styles.field}
            />
            <MultiSelectUser 
                {...modelProps}
                type='multiple'
                label='Модель'  
                onChange={handleModelChange}
                className={styles.field}
            />
        </div>
  
        <div className={styles.bottom}>
          <div className={styles.count}>
            {/* {statuses ? `Найдено ${countSuffix}` : 'Устройств не найдено'} */}
          </div>
  
          <div className={styles.actions}>
            <Button
              title="Сбросить фильтры"
              icon={<IconCross width={20} height={20} />}
              appearance="text"
              onClick={handleReset}
              className={styles.resetBtn}
            />
  
            {/* <Button
              title={isFull ? 'Свернуть фильтры' : 'Еще фильтры'}
              iconRight={<IconChevronDown width={20} height={20} />}
              appearance="text"
              onClick={handleMoreClick}
              className={styles.moreBtn}
            /> */}
          </div>
        </div>
      </Dashboard>
    )
  }
  export default DevicesFilterArchive