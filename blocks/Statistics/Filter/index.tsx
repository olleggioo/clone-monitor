import {
  FC,
  useEffect,
  useMemo,
} from 'react'
import { useRouter } from 'next/router'
import { useAtom } from 'jotai'
import classNames from 'classnames'
import styles from './StatsFilter.module.scss'
import type { OptionItemI } from '@/ui/CustomSelect/CustomSelect'
import {
  StatsFilterStateI,
  atomPeriodFromToCharts,
  atomPeriodFromToChartsStats,
  statsDataAtom,
  statsFilterAtom,
  statsFilterInitialState
} from '@/atoms/statsAtom'
import { Button } from '@/ui'
import { Dashboard } from '@/components'
import { selectPlaceholders } from '@/blocks/Devices/data'
import { ChartPeriodType } from '@/interfaces'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IconCross } from '@/icons'
import MultiSelectUser from '@/components/MultiSelect/User'
import { getStatusName } from '@/helpers'
import ru from 'date-fns/locale/ru';
import { hasAccess } from '@/helpers/AccessControl'
import { requestsAccessMap } from '@/helpers/componentAccessMap'

const StatsFilter: FC<{ 
  className?: string, 
  periodType: ChartPeriodType, 
  setPeriodType: (type: ChartPeriodType) => void 
}> = ({ className, periodType, setPeriodType }) => {
  const router = useRouter()

  const [{ users, area, algorithms, model, status, ranges}] = useAtom(statsDataAtom)
  const [state, setState] = useAtom(statsFilterAtom)
  const filterClass = classNames(styles.el, className)
  const getSelectData = (
    name: keyof StatsFilterStateI,
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

  const clientProps = useMemo(() => {
    const options: OptionItemI[] = users.map((user) => {
      return {
        label: user.fullname,
        value: user.id
      } as OptionItemI
    })
    return getSelectData('client', options)
  }, [users, state.client])

  const areaProps = useMemo(() => {
    const options: OptionItemI[] = area.map((item) => {
      return {
        label: item.name,
        value: item.id
      } as OptionItemI
    })
    return getSelectData('area', options)
  }, [area, state.area])

  const algorithmProps = useMemo(() => {
    const options: OptionItemI[] = algorithms.map((algorithm: any) => {
      return {
        label: algorithm.name,
        value: algorithm.id
      } as OptionItemI
    })
    return getSelectData('algorithm', options)
  }, [algorithms, state.algorithm])

  const rangesProps = useMemo(() => {
    const options: OptionItemI[] = ranges.map((algorithm: any) => {
      return {
        label: algorithm.name,
        value: algorithm.id
      } as OptionItemI
    })
    return getSelectData('ranges', options)
  }, [ranges, state.ranges])

  const modelProps = useMemo(() => {
    const options: OptionItemI[] = model.map((mod: any) => {
      return {
        label: mod.name,
        value: mod.id
      } as OptionItemI
    })
    return getSelectData('model', options)
  }, [model, state.model])
  

  console.log('status', status
    .filter((item: any) => item.name !== "In archive" && item.name !== "Not online" && item.name !== "In repair"))
  const statusProps = useMemo(() => {
    const options: OptionItemI[] = status
    .filter((item: any) => item.name !== "In archive" && item.name !== "Not online" && item.name !== "In repair")
    .map((mod: any) => {
      const label = getStatusName(mod.name)
      return {
        label,
        value: mod.id
      } as OptionItemI
    })
    return getSelectData('status', options)
  }, [status, state.status])

  const handleSelectChange = (
    name: keyof StatsFilterStateI,
    value: string | null | boolean
  ) => {
    setState((prevState) => {
      return {
        ...prevState,
        [name]: value
      }
    })
  }

  const handleClientChange = (e: any, option: any) => {
    handleSelectChange('client', option?.value)
  }

  const handleAreaChange = (e: any, option: any) => {
    handleSelectChange('area', option?.value)
  }

  const handleAlgorithmChange = (e: any, option: any) => {
    handleSelectChange('algorithm', option?.value)
  }

  const handleModelChange = (e: any, option: any) => {
    handleSelectChange('model', option?.value)
  }

  
  const handleStatusChange = (e: any, option: any) => {
    handleSelectChange('status', option?.value)
  }

  const handleRangesChange = (option: OptionItemI) => {
    handleSelectChange('ranges', option?.value)
  }

  useEffect(() => {
    const { user } = router.query

    if (typeof user === 'string') {
      setState((prevState) => {
        return {
          ...prevState,
          client: user
        }
      })
    }
  }, [router.query])

  const handleReset = () => {
    setState(statsFilterInitialState)
    setDateRange([null, null])
  }

  const [dateRange, setDateRange] = useAtom(atomPeriodFromToChartsStats);
  const [startDate, endDate] = dateRange;

  const timeDiff = Math.abs(new Date((startDate)).getTime() - new Date(endDate).getTime());
  const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 

  useEffect(() => {
    if(diffDays === 0) {
      setPeriodType("day")
    }
    if(diffDays <= 1 && diffDays > 0) {
      setPeriodType("day")
    }
    else if(diffDays > 1 && diffDays < 8) {
      setPeriodType("month")
    } else if(diffDays > 8) {
      setPeriodType("month")
    }
  }, [startDate, endDate])

  return (
    <Dashboard 
    sideComp={<Button
      title="Сбросить фильтры"
      icon={<IconCross width={20} height={20} />}
      appearance="text"
      onClick={handleReset}
      className={styles.resetBtn}
    />} 
    title="Фильтр" 
    className={filterClass}>
      <div className={styles.list}>
        {hasAccess(requestsAccessMap.getDeviceModel) && <MultiSelectUser 
          {...modelProps}
          type='base'
          label='Модель'  
          onChange={handleModelChange}
          className={styles.field}
        />}
        {hasAccess(requestsAccessMap.getDevicesStatus) && <MultiSelectUser 
          {...statusProps}
          type='base'
          label='Статус'  
          onChange={handleStatusChange}
          className={styles.field}
        />}
        {hasAccess(requestsAccessMap.getDevicesArea) && <MultiSelectUser 
          {...areaProps}
          type='base'
          label='Площадки'  
          onChange={handleAreaChange}
          className={styles.field}
        />}
        {hasAccess(requestsAccessMap.getDevicesAlgorithm) && <MultiSelectUser 
          {...algorithmProps}
          type='base'
          label='Алгоритмы'  
          onChange={handleAlgorithmChange}
          className={styles.field}
        />}
        {hasAccess(requestsAccessMap.getUsers) && <MultiSelectUser 
          {...clientProps}
          type='base'
          label='Клиенты'  
          onChange={handleClientChange}
          className={styles.field}
        />}
        
        <DatePicker
          locale={ru}
          wrapperClassName={styles.dataPicker}
          selectsRange={true}
          startDate={startDate}
          endDate={endDate}
          onChange={(update) => {
            setDateRange(update);
          }}
          isClearable={true}
          placeholderText={'Диапазон дат'} 
        />
      </div>
      <div className={styles.additionAction}>
        {/* <Button
          title="Сбросить фильтры"
          icon={<IconCross width={20} height={20} />}
          appearance="text"
          onClick={handleReset}
          className={styles.resetBtn}
        /> */}
      </div>
    </Dashboard>
  )
}

export default StatsFilter
