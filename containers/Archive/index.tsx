import { useEffect, useState } from "react"
import { Layout } from ".."
import ProfileUser from "@/components/ProfileUser"
import { Dashboard, Pagination } from "@/components"
import DevicesFilterArchive from "./DevicesFilter"
import { useAtom } from "jotai"
import { devicesArchiveDataAtom, devicesArchiveFilterAtom, sortFilterAtom } from "@/atoms/appDataAtom"
import { deviceAPI, userAPI } from "@/api"
import { fetchDevicesArchiveData, fetchDevicesData } from "@/helpers/generateWhereClause"
import { DevicesTable } from "@/blocks"
import DevicesArchiveTable from "@/blocks/Archive/Devices"

const INITIAL_PAGE_LIMIT = 100

const ArchiveContainer = () => {
    const [data, setData] = useAtom(devicesArchiveDataAtom);
    const [loading, setLoading] = useState(false)
    const [filter, setFilter] = useAtom(devicesArchiveFilterAtom)
    const [selectedCount, setSelectedCount] = useState<number>(INITIAL_PAGE_LIMIT);
    const [sortFilter, setSortFilter] = useAtom(sortFilterAtom)

    useEffect(() => {
      setLoading(true);
      deviceAPI.getDevicesStatus()
          .then((res) => {
              setData((prevState) => ({
                  ...prevState,
                  statuses: res.rows,
              }));
          })
          .catch(console.error)
          .finally(() => setLoading(false));
  }, []);
  
  useEffect(() => {
      deviceAPI.getDevicesArea()
          .then((res) => {
              setData((prevState) => ({
                  ...prevState,
                  area: res.rows,
              }));
          })
          .catch(console.error);
  }, []);
  
  useEffect(() => {
      userAPI.getUsers({
          limit: 999,
          select: {
              id: true,
              fullname: true,
              login: true,
              contract: true,
          },
      })
          .then((res) => {
              setData((prevState) => ({
                  ...prevState,
                  users: res.rows,
              }));
          })
          .catch(console.error);
  }, []);
  
  useEffect(() => {
      deviceAPI.getDevicesAlgorithm()
          .then((res) => {
              setData((prevState: any) => ({
                  ...prevState,
                  algorithms: res.rows,
              }));
          })
          .catch(console.error);
  }, []);
  
  useEffect(() => {
      deviceAPI.getDeviceModel({ limit: 999 })
          .then((res) => {
              setData((prevState: any) => ({
                  ...prevState,
                  models: res.rows,
              }));
          })
          .catch(console.error);
  }, []);
  
  useEffect(() => {
      deviceAPI.getRangesIp({ limit: 999 })
          .then((res) => {
              setData((prevState) => ({
                  ...prevState,
                  names: res.rows,
              }));
          })
          .catch(console.error);
  }, []);

    // useEffect(() => {
    //     setLoading(true)
    //     Promise.all([
    //       deviceAPI.getDevicesStatus(),
    //       deviceAPI.getDevicesArea(),
    //       userAPI.getUsers({
    //         limit: 999,
    //         select: {
    //           id: true,
    //           fullname: true,
    //           login: true,
    //           contract: true
    //         }
    //       }),
    //       deviceAPI.getDevicesAlgorithm(),
    //       deviceAPI.getDeviceModel({
    //         limit: 999
    //       }),
    //       deviceAPI.getRangesIp({
    //         limit: 999
    //       })
    //     ])
    //       .then((res) => {
    //         const [statuses, area, users, algorithm, model, ranges] = res
    //         setData((prevState: any) => {
    //           return {
    //             ...prevState,
    //             statuses: statuses.rows,
    //             area: area.rows,
    //             users: users.rows,
    //             algorithms: algorithm.rows,
    //             models: model.rows,
    //             names: ranges.rows
    //           }
    //         })
    //         // setChecked
    //       })
    //       .catch(console.error)
    //       .finally(() => {
    //         setLoading(false)
    //       })
    //       .catch(console.error)
    // }, [])

    useEffect(() => {
        fetchDevicesArchiveData(
            filter, 
            // currentTabTest, 
            selectedCount, 
            sortFilter, 
            setData, 
            setLoading
        );
    }, [sortFilter, filter, selectedCount])
        
    // useEffect(() => {
    //     if (isEmpty) {
    //       setData((prevState) => {
    //         return {
    //           ...prevState,
    //           devices: {
    //             rows: [],
    //             total: 0
    //           }
    //         }
    //       })
    //     } else {
    //       setLoading(true)
    //       fetchDevicesData(filter, currentTabTest, selectedCount, sortFilter, setData, setLoading, setCheckboxFilter, setChecked, setSelected);
    //     }
    // }, [isEmpty, filter, currentTabTest, selectedCount, sortFilter])

    const test = document.getElementById("main-table");
    const handlePageChange = (page: number) => {
        setFilter((prevState: any) => {
          return {
            ...prevState,
            page
          }
        });
        test?.scrollTo({top: 0, left: 0, behavior: "smooth"});
    }

    return <Layout 
        pageTitle="Расторжение" 
        header={<ProfileUser title='Расторжение' />}
    >
        <DevicesFilterArchive />
        <Dashboard title="Список устройств">
            {!!data.devices.total && (
                <DevicesArchiveTable
                    devices={data.devices.rows}
                    isLoading={loading}
                    // onDeleteDevice={handleDeleteDevice}
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
    </Layout>
}

export default ArchiveContainer