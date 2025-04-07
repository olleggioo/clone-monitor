import { DeviceContainer } from '@/containers'
import Head from 'next/head'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState, useCallback } from 'react'
import { DeviceI } from '@/interfaces'
import { deviceAPI, userAPI } from '@/api'
import { Loader } from '@/components'
import withAuth from '@/hoc/withAuth'
import moment from 'moment'
import getEnergyUnit from '@/helpers/getEnergyUnit'
import { useAtom } from 'jotai'
import { atomChartType, atomDataDevice, atomPeriodFromToCharts } from '@/atoms/statsAtom'
import DeviceClients from '@/containers/Device/DeviceClients'
import DeviceManager from '@/containers/Device/DeviceManager'
import { usersAtom } from '@/atoms'
import { devicesDataAtom } from '@/atoms/appDataAtom'
import Load from '@/components/Load'
import EmptyWrapper from '@/containers/EmptyWrapper'
import { requestsAccessMap } from '@/helpers/componentAccessMap'
import { hasAccess } from '@/helpers/AccessControl'

const DevicePage: NextPage = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useAtom(atomDataDevice)
  const [log, setLog] = useState<any>()
  const [sumEnergyMonth, setEnergyMonth] = useState<any>()
  const [uptimeTotal, setUptimeTotal] = useState<number>(0)
  const [periodType, setPeriodType] = useAtom(atomChartType)
  const [userList, setUserList] = useAtom(usersAtom)
  const [dateRange] = useAtom(atomPeriodFromToCharts)
  const [_, setDeviceData] = useAtom(devicesDataAtom)
  const roleId = localStorage.getItem(`${process.env.API_URL}_role`)
  const id = router.query.id as string | undefined;

  const [energyDay, setEnergyDay] = useState<any>({
    sum: 0,
    length: 0
  })

  const dateFrom = {
    day: moment().startOf('day').subtract(3, 'hour').format('YYYY-MM-DD HH:mm:ss'),
    week: moment().subtract(1, 'week').format('YYYY-MM-DD HH:mm:ss'),
    month: moment().subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss')
  }
  const dateNow = moment().subtract(3, 'hour').format('YYYY-MM-DD HH:mm:ss')

  const fetchHistoryData = useCallback(async () => {
    if (!id) return;
    try {
      const historyData = await deviceAPI.getDeviceDataHistory({
        where: {
          deviceId: id
        }
      })
      setLog((prevState: any) => ({ ...prevState, ...historyData }))
    } catch (error) {
      console.error(error);
    }
  }, [id])

  const fetchDeviceData = useCallback(async () => {
    if (!id) return;
    setPeriodType("day");
    try {
      const deviceData = await deviceAPI.getDeviceData(id, {
        relations: {
          status: true,
          area: true,
          model: true,
          algorithm: true,
          deviceBoards: true,
          devicePools: { pool: true },
          rangeip: true,
          deviceLogs: true,
          deviceComments: true,
        }
      });
      setData((prevState: any) => ({ ...prevState, ...deviceData }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await userAPI.getUsers({
        limit: 999,
        select: { id: true, fullname: true, login: true }
      });
      setUserList(res.rows);
      setDeviceData((prevState: any) => ({ ...prevState, users: res.rows }));
    } catch (error) {
      console.error(error);
    }
  }, []);

  const refreshComments = useCallback(async () => {
    if (!id) return;
    try {
      const res = await deviceAPI.getComments({ where: { deviceId: id } });
      setData((prevState: any) => ({
        ...prevState,
        deviceComments: res.rows,
      }));
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  const refreshDevicePolling = useCallback(async () => {
    if (!id) return;
    try {
      const res = await deviceAPI.getDevicePollingId(id);
      setData((prevState: any) => ({
        ...prevState,
        deviceFan: res.fan,
        devicePools: res.pools,
        rejectedPollsProcents: res.rejectedPollsProcents,
        deviceBoards: res.boards,
      }));
    } catch (error) {
      console.error("Polling error:", error);
    }
  }, [id]);

  const fetchEnergyAndUptime = useCallback(async () => {
    if (!id) return;

    const fetchEnergy = (apiMethod: any, timeRange: string) => apiMethod({
      where: {
        deviceId: id,
        createdAt: `$Between(["${dateFrom["day"]}", "${dateNow}"])`,
      },
    });

    try {
      const energyMethod = deviceAPI.getDevicesEnergySumDay;

      const [
        energyRes, 
        // uptimeRes
      ] = await Promise.all([
        fetchEnergy(energyMethod, dateFrom[periodType]),
        // fetchEnergy(uptimeMethod, dateFrom[periodType]),
      ]);
      const sumEnergy = energyRes.reduce((prev: any, curr: any) => prev + Number(curr.value), 0) || 0
      setEnergyMonth(getEnergyUnit(sumEnergy));
      
      setUptimeTotal(sumEnergy);
    } catch (error) {
      console.error("Error fetching energy or uptime:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchDeviceData();
    if(hasAccess(requestsAccessMap.getDeviceDataHistory)) {
      fetchHistoryData();
    }
    fetchUsers();
  }, [fetchDeviceData, fetchUsers, fetchHistoryData]);

  useEffect(() => {
    deviceAPI.getDevicesHashRateLog({
      where: {
        deviceId: id,
        createdAt: `$Between(["${dateFrom["day"]}", "${dateNow}"])`,
      },
      limit: 300,
      order: {
        createdAt: "DESC"
      },
      select: {
        value: true,
        createdAt: true
      }
    })
      .then((res: any) => {
        const sumEnergyDay = res.reduce((prev: any, curr: any) => prev + Number(curr.value), 0) || 0
        console.log("RES ENERGY SUM", sumEnergyDay)
        setEnergyDay({
          sum: sumEnergyDay,
          length: res.length
        })
      })
      .catch(err => console.error(err))
  }, [id])

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (id) {
      refreshComments();
      intervalId = setInterval(refreshComments, 10000);
    }
    return () => clearInterval(intervalId);
  }, [refreshComments, id]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (id) {
      refreshDevicePolling();
      intervalId = setInterval(refreshDevicePolling, 10000);
    }
    return () => clearInterval(intervalId);
  }, [refreshDevicePolling, id]);

  useEffect(() => {
    fetchEnergyAndUptime();
  }, [])

  return loading ? (
    <Loader />
  ) : (
    <>
      <Head>
        <title>{data?.modelId || 'Устройство'}</title>
      </Head>
      {data && (hasAccess(requestsAccessMap.getDeviceData) || hasAccess(requestsAccessMap.getDeviceDataAuthedUserId))  ? (
        <DeviceContainer
          {...data}
          listLog={log}
          sumEnergyMonth={sumEnergyMonth}
          uptimeTotal={uptimeTotal}
          energyDay={energyDay}
        />
      ) : (
        <div>
          <EmptyWrapper />
        </div>
      )}
      {/* {data ? (
        roleId === process.env.ROLE_ROOT_ID ? (
          <DeviceContainer
            {...data}
            listLog={log}
            sumEnergyMonth={sumEnergyMonth}
            uptimeTotal={uptimeTotal}
          />
        ) : roleId === process.env.ROLE_MANAGER_ID ? (
          <DeviceManager
            {...data}
            listLog={log}
            sumEnergyMonth={sumEnergyMonth}
            uptimeTotal={uptimeTotal}
          />
        ) : (
          <DeviceClients
            {...data}
            listLog={log}
            sumEnergyMonth={sumEnergyMonth}
            uptimeTotal={uptimeTotal}
          />
        )
      ) : (
        <div>
          <EmptyWrapper />
        </div>
      )} */}
    </>
  );
};

export default withAuth(DevicePage);