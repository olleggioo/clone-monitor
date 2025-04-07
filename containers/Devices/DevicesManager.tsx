import { FC, memo, useEffect, useMemo, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import { Layout } from '@/containers';
import { deviceAPI, userAPI } from '@/api';
import { DevicesTable, DevicesTabs } from '@/blocks';
import { getDevicesReq } from '@/blocks/Devices/helpers';
import { getNumberDeclinationString } from '@/helpers';
import { Header, Loader, Pagination } from '@/components';
import DevicesFilter from '@/blocks/Devices/Filter';

import { checkedAtom, devicesDataAtom, devicesFilterAtom, devicesFilterInitialState, devicesUserIdFilterAtom, deviceTabsControlsAtom, selectedInputAtom, sortFilterAtom } from '@/atoms/appDataAtom';

import Dashboard from '../../components/Dashboard';
import UploadData from '@/blocks/Devices/UploadData';
import SendData from '@/blocks/Devices/SendData';
import styles from './Devices.module.scss';
import { Button, Heading } from '@/ui';
import { IconAperture, IconArrowRightCircle, IconLogOut, IconUsers } from '@/icons';
import { Menu, MenuItem } from '@mui/material';
import { deviceAtom, userAtom } from '@/atoms';
import { useRouter } from 'next/router';
import ArrowDown from '@/icons/ArrowDown';
import ProfileUser from '@/components/ProfileUser';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { fetchDevicesData, generateWhereClause } from '@/helpers/generateWhereClause';
import Load from '@/components/Load';
import { hasAccess } from '@/helpers/AccessControl';
import { requestsAccessMap } from '@/helpers/componentAccessMap';
import DevicesTabsManager from '@/blocks/Devices/Tabs/DeviceTabsManager';

const INITIAL_PAGE_LIMIT = 100;

const DevicesContainer: FC = () => {
  const [statusTab, setStatusTab] = useState<string | null>(null);
  const [currentTabTest, setCurrentTabTest] = useAtom(deviceTabsControlsAtom);
  const [selectedCount, setSelectedCount] = useState<number>(INITIAL_PAGE_LIMIT);
  const [sortFilter, setSortFilter] = useAtom(sortFilterAtom);
  const [loading, setLoading] = useState(true);

  const [load, setLoad] = useState(true);
  const [data, setData] = useAtom(devicesDataAtom);
  const [filterT, setFilterT] = useAtom(devicesFilterAtom);
  const [filter, setFilter] = useState<any>(() => {
    const filters = sessionStorage.getItem('devicesFilterState')
    return filters ? JSON.parse(filters) : devicesFilterInitialState;
  })

  const filters = sessionStorage.getItem('devicesFilterState')
  useEffect(() => {
    if(filters) {
      setFilter((prevState: any) => {
        return {
          ...prevState,
          ...JSON.parse(filters)
        }
      })
    }
  }, [filters])
  

  const [checkboxFilter, setCheckboxFilter] = useAtom(devicesUserIdFilterAtom);
  const [checked, setChecked] = useAtom(checkedAtom)
  const [selected, setSelected] = useAtom(selectedInputAtom);
  const countSuffix = getNumberDeclinationString(checkboxFilter.length, [
    'устройство',
    'устройства',
    'устройств'
  ]);
  const handleTabChange = (tab: string | null) => {
    setStatusTab(tab)
    setFilter((prevState: any) => {
      return {
        ...prevState,
        page: 1
      }
    });
  }
  const handleCountChange = (newCount: number) => {
    
    setFilter((prevState: any) => {
      return {
        ...prevState,
        page: 1
      }
    });
    setSelectedCount(newCount);
  }

  const test = document.getElementById("main-table");

  const handlePageChange = (page: number) => {
    // const filterInfo = filters ? JSON.parse(filters) : devicesFilterInitialState
    const newFilter = {
      ...filterT,
      page
    }
    // console.log("newFilter", newFilter)
    // localStorage.setItem('devicesFilterState', JSON.stringify(newFilter))
    setFilter((prevState: any) => {
      return {
        ...prevState,
        page
      }
    });
    test?.scrollTo({top: 0, left: 0, behavior: "smooth"});
  }
  const handleDeleteDevice = async (id: string) => {
    try {
      await deviceAPI.deleteDevice(id);
      fetchDevicesData(filter, currentTabTest, selectedCount, sortFilter, setData, setLoading, setCheckboxFilter, setChecked, setSelected);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    Promise.all([
      deviceAPI.getDevicesStatus({
        where: {
          id: `$Not($In(["1eda7201-913e-11ef-8367-bc2411b3fd76"]))`
        }
      }),
      deviceAPI.getDevicesArea(),
      userAPI.getUsers({
        limit: 999,
        select: {
          id: true,
          fullname: true,
          login: true,
          contract: true
        },
        where: {
          roleId: "b3c5ce0e-884d-11ee-932b-300505de684f"
        }
      }),
      deviceAPI.getDevicesAlgorithm(),
      deviceAPI.getDeviceModel({
        limit: 999
      }),
      deviceAPI.getRangesIp({
        limit: 999
      })
    ])
      .then((res) => {
        const [statuses, area, users, algorithm, model, ranges] = res
        setData((prevState: any) => {
          return {
            ...prevState,
            statuses: statuses.rows,
            area: area.rows,
            users: users.rows,
            algorithms: algorithm.rows,
            models: model.rows,
            names: ranges.rows
          }
        })
        setCheckboxFilter([])
        // setChecked
      })
      .catch(console.error)
      .catch(console.error)
  }, [])

  console.log("loading", !loading ? "ДА" : "НЕТ")

  const isEmpty = useMemo(() => {
    return filter.status && filter.status.length !== 0 
      ? filter.status.every((filterStatus: any) => filterStatus.value !== statusTab) && statusTab !== null
      : false;
  }, [filter.status, statusTab]);

  const memoizedTabTest = useMemo(() => currentTabTest, [currentTabTest]);
  const memoizedSortFilter = useMemo(() => sortFilter, [sortFilter]);

  useEffect(() => {
    if (isEmpty) {
      setData((prevState) => ({
        ...prevState,
        devices: { rows: [], total: 0 },
      }));
    } else {
        if(hasAccess(requestsAccessMap.getDevices)) {
          setLoading(true);
          fetchDevicesData(filter, memoizedTabTest, selectedCount, memoizedSortFilter, setData, setLoading, setCheckboxFilter, setChecked, setSelected);
        }
    }
}, [isEmpty, JSON.stringify(filter), memoizedTabTest, selectedCount, memoizedSortFilter]);

  const [userInfo, setUserInfo] = useAtom(userAtom)

  const [isOpenProfile, setIsOpenProfile] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null);

  const onToggleClick = (e: any) => {
    setIsOpenProfile((prev) => !prev)
    setAnchorEl(e.currentTarget)
  }

  const router = useRouter()
  const [device] = useAtom(deviceAtom)

  console.log("data.devices.total",data.devices.total)

  return device !== "mobile" ? <Layout 
      pageTitle="Устройства" 
      header={<ProfileUser title='Устройства' />}
      >
      <div className={styles.el}>
        <DevicesFilter />
        <div className={styles.actionsUser}>
          <SendData />
          <UploadData />
          {/* <UploadUsers /> */}
        </div>
        <Dashboard>
          <DevicesTabs
            statuses={data.statuses || []}
            filterStatus={filter.status || undefined}
            onTabChange={handleTabChange}
            onCountChange={handleCountChange}
          />
          <p className={styles.selectedTitle}>Выбрано {countSuffix}</p>
          {hasAccess(requestsAccessMap.getDevices) && (!!data.devices.total ?
            !loading 
              ? (
                <DevicesTable
                  devices={data.devices.rows}
                  isLoading={loading}
                  onDeleteDevice={handleDeleteDevice}
                />
                
              ) : <Load />
              : <p>Устройства не найдены</p>)}
          {data.devices.total > selectedCount && (
            <Pagination
              onPageChange={handlePageChange}
              limit={selectedCount}
              offset={selectedCount * (filter.page - 1)}
              total_count={data.devices.total}
              isLoading={loading}
            />
          )}
        </Dashboard>
      </div>
    </Layout>
    : <Layout 
    pageTitle="Устройства" 
    // header={<p>DSADs</p>}
    header={<ProfileUser title={"Устройства"} />}>
    <div className={styles.el}>
      <DevicesFilter />
      <div className={styles.actionsUser}>
        <SendData />
        <UploadData />
        {/* <UploadUsers /> */}
      </div>
      <Dashboard>
        <DevicesTabsManager
          statuses={data.statuses || []}
          filterStatus={filter.status || undefined}
          onTabChange={handleTabChange}
          onCountChange={handleCountChange}
        />
        <p className={styles.selectedTitle}>Выбрано {countSuffix}</p>
        {!!data.devices.total && (
            <DevicesTable
              devices={data.devices.rows}
              isLoading={loading}
              onDeleteDevice={handleDeleteDevice}
            />
          
        )}
        {data.devices.total > selectedCount && (
          <Pagination
            onPageChange={handlePageChange}
            limit={selectedCount}
            offset={selectedCount * (filter.page - 1)}
            total_count={data.devices.total}
            isLoading={loading}
          />
        )}
      </Dashboard>
    </div>
  </Layout>
}

export default memo(DevicesContainer)
