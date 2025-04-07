import { deviceAPI } from "@/api";
import { getDevicesReq } from "@/blocks/Devices/helpers";

const generateWhereClause = (filter: any, currentTabTest?: any): any => {
    const { client, model, area, algorithm, name, status, owner, isFlashed, isGlued, isDisabled, ip, place, mac, sn, pool, worker, comment, partNumber } = filter;
    const clients = client !== null && client.length === 0 ? [null] : client;
    const owners = owner !== null && owner.length === 0 ? [null] : owner;
    const models = model !== null && model.length === 0 ? [null] : model;
    const areas = area !== null && area.length === 0 ? [null] : area;
    const algorithms = algorithm !== null && algorithm.length === 0 ? [null] : algorithm;
    const names = name !== null && name.length === 0 ? [null] : name;
    const statuss = status !== null && status.length === 0 ? [null] : status;
    const sns = sn !== null && sn.length === 0 ? [null] : sn;
  

    console.log("sn", sns)
    const testWhere: any[] = [];

    // statusId: `$Not($In("%1eda7201-913e-11ef-8367-bc2411b3fd76%"))`
    clients.forEach((clientItem: any) => {
      owners.forEach((ownerItem: any) => {
        models.forEach((modelItem: any) => {
          areas.forEach((areaItem: any) => {
            algorithms.forEach((algorithmItem: any) => {
              names.forEach((nameItem: any) => {
                statuss.forEach((statusItem: any) => {
                  const containerNames = nameItem === null ? [null] : nameItem.value;
                  containerNames.forEach((container: any) => {
                    const someWhere: any = {};
                    // if(statusItem === null) {
                    //   someWhere.statusId = `$Not($In([1eda7201-913e-11ef-8367-bc2411b3fd76]))`
                    // }
                    if(currentTabTest?.value === "Все") {
                      someWhere.statusId = `$Not($In(["1eda7201-913e-11ef-8367-bc2411b3fd76"]))`
                    }
                    if (Array.isArray(sn)) {
                      someWhere.sn = `$In([${sn.map(s => `"${s.value}"`).join(",")}])`;
                    } else if (sn) {
                      someWhere.sn = `$Like("%${sn}%")`;
                    }

  
                    if (isFlashed) someWhere.isFlashed = isFlashed;
                    if (isGlued) someWhere.isGlued = isGlued;
                    if (isDisabled) someWhere.isDisabled = isDisabled;
                    if (clientItem) someWhere.userDevices = {
                      userId: clientItem.value
                    };
                    if (ownerItem) someWhere.ownerId = ownerItem.value;
  
                    if (statusItem !== null || currentTabTest) {
                      someWhere.statusId = statusItem !== null
                        ? statusItem.value && currentTabTest
                          ? currentTabTest.id
                          : statusItem.value
                        : currentTabTest.id;
                    }
  
                    if (areaItem) someWhere.areaId = areaItem.value;
                    if (modelItem) someWhere.modelId = modelItem.value;
                    if (algorithmItem) someWhere.algorithmId = algorithmItem.value;
                    // if (ip) someWhere.ipaddr = ip;
                    if(partNumber) someWhere.partNumber = partNumber;
                    if (Array.isArray(ip)) {
                      someWhere.ipaddr = `$In([${ip.map(s => `"${s.value}"`).join(",")}])`;
                    } else if (ip) {
                      someWhere.ipaddr = ip;
                    }
                    if (place) someWhere.place = `$Like("%${place}%")`;
                    // if (mac) someWhere.macaddr = mac;
                    if (Array.isArray(mac)) {
                      someWhere.macaddr = `$In([${mac.map(s => `"${s.value}"`).join(",")}])`;
                    } else if (mac) {
                      someWhere.macaddr = mac;
                    }
                    // if (sn) someWhere.sn = `$Like("%${sn}%")`;
                    if (nameItem) someWhere.rangeipId = container;
                    if (pool.length !== 0) {
                      someWhere.devicePools = {
                        pool: {
                          name: `$Like("%${pool}%")`
                        }
                      };
                    }
                    if (worker.length !== 0) {
                      someWhere.devicePools = {
                        pool: {
                          user: `$Like("%${worker}%")`
                        }
                      };
                    }
                    if (comment) someWhere.comment = `$Like("%${comment}%")`;
                    if(currentTabTest?.value === "Все") {
                      someWhere.statusId = `$Not($In(["1eda7201-913e-11ef-8367-bc2411b3fd76"]))`
                    }
  
                    testWhere.push(someWhere);
                  });
                });
              });
            });
          });
        });
      });
    })
  
    return testWhere.length === 1 ? testWhere[0] : testWhere;
};

const generateWhereArchiveClause = (filter: any, currentTabTest?: any): any => {
  const { model, sn, client, partNumber } = filter;
  
  const models = model !== null && model.length === 0 ? [null] : model;
  const clients = client !== null && client.length === 0 ? [null] : client;

  const testWhere: any[] = [];
    models.forEach((modelItem: any) => {
      clients.forEach((clientItem: any) => {
      const someWhere: any = {};
        someWhere.statusId = "1eda7201-913e-11ef-8367-bc2411b3fd76"
        if (modelItem) someWhere.modelId = modelItem.value;
        if (clientItem) someWhere.userDevices = {
          userId: clientItem.value
        };
        if(partNumber) someWhere.partNumber = partNumber;
        if (Array.isArray(sn)) {
          someWhere.sn = `$In([${sn.map(s => `"${s.value}"`).join(",")}])`;
        } else if (sn) {
          someWhere.sn = `$Like("%${sn}%")`;
        }
        testWhere.push(someWhere);
      });
    });

  return testWhere.length === 1 ? testWhere[0] : testWhere;
};

const fetchDevicesData = async (
    filter: any,
    currentTabTest: any,
    selectedCount: number,
    sortFilter: any,
    setData: React.Dispatch<React.SetStateAction<any>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setCheckboxFilter: any,
    setChecked: any,
    setSelected: any
) => {
    try {
        const where = generateWhereClause(filter, currentTabTest);
        const { devicesRes, statusesRes } = await getDevicesReq(filter.page, selectedCount, where, sortFilter);
        if(statusesRes && Array.isArray(statusesRes.rows)) {
          console.log("statusesRes", devicesRes, statusesRes)
          const updatedStatuses: any = statusesRes?.rows
          const promises = updatedStatuses.map((row: any) => {
            const updatedTestWhere = generateWhereClause(filter, { id: row.id });
            return deviceAPI.getDevicesStatusCount({
              where: updatedTestWhere.length === 1 ? updatedTestWhere[0] : updatedTestWhere,
            });
          });
          const counts = await Promise.all(promises);
          const updatedStatusCounts = counts.map((count: any, index: number) => ({
            count: count.total,
            name: updatedStatuses[index].name,
            color: updatedStatuses[index].color,
            id: updatedStatuses[index].id,
            description: updatedStatuses[index].description
          }));

          setData((prevState: any) => {
            return {
              ...prevState,
              statuses: updatedStatusCounts,
            }
          })
        }
    
        setData((prevState: any) => ({
          ...prevState,
          devices: devicesRes,
          
        }));
    
        setCheckboxFilter([]);
        setChecked([]);
        setSelected(false);

        // setLoading(false)
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
}

const fetchDevicesArchiveData = async (
  filter: any,
  // currentTabTest: any,
  selectedCount: number,
  sortFilter: any,
  setData: React.Dispatch<React.SetStateAction<any>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  // setCheckboxFilter: any,
  // setChecked: any,
  // setSelected: any
) => {
  try {
    console.log("SORTFITLER,", sortFilter)
      const where = generateWhereArchiveClause(filter);
      const { devicesRes, statusesRes } = await getDevicesReq(filter.page, selectedCount, where, sortFilter);
      if(statusesRes) {
        const updatedStatuses: any = statusesRes.rows;
        const promises = updatedStatuses.map((row: any) => {
          const updatedTestWhere = generateWhereClause(filter, { id: row.id });
          return deviceAPI.getDevicesStatusCount({
            where: updatedTestWhere.length === 1 ? updatedTestWhere[0] : updatedTestWhere,
          });
        });
        const counts = await Promise.all(promises);
        const updatedStatusCounts = counts.map((count: any, index: number) => ({
          count: count.total,
          name: updatedStatuses[index].name,
          color: updatedStatuses[index].color,
          id: updatedStatuses[index].id,
          description: updatedStatuses[index].description
        }));
        setData((prevState: any) => ({
          ...prevState,
          statuses: updatedStatusCounts,
        }));

      }
  
      setData((prevState: any) => ({
        ...prevState,
        devices: devicesRes,
      }));

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
}
 
export {
    generateWhereClause,
    fetchDevicesData,
    fetchDevicesArchiveData
}