import { TabsControls } from "@/components";
import { useState } from "react";
import WrapperCpuCore from "../WrapperCharts/WrapperCpuCore";
import WrapperCpuProc from "../WrapperCharts/WrapperCpuProc";
import WrapperRam from "../WrapperCharts/WrapperRam";
import styles from "./Tabs.module.scss"
import CpuCoreFilter from "../Filters/CpuCoreFilter";
import RamFilter from "../Filters/RamFilter";
import { filter } from "lodash";
import WrapperTraffic from "../WrapperCharts/WrapperTraffic";
import WrapperDisk from "../WrapperCharts/WrapperDisk";

const tabControls = [
    { text: 'CPU Core' },
    { text: 'CPU Proc' },
    { text: 'Диск' },
    { text: 'Оперативная память' },
    { text: 'Трафик' }
]

const TabsAreas = () => {
    const [chartType, setChartType] = useState("CPU Core");

    const [filterRam, setFilterRam] = useState({
        cache: true,
        free: true,
        shared: true,
        total: true,
        used: true
    });

    const handleFilterRamChange = (param: keyof typeof filterRam) => {
        setFilterRam(prevFilters => ({
            ...prevFilters,
            [param]: !prevFilters[param],
        }));
    };

    return <>
    <div className={styles.flex}>
        <TabsControls
            items={tabControls}
            currentTab={chartType}
            onChange={setChartType}
        />
        {/* {chartType === "CPU Core"
            ?  <CpuCoreFilter filter={fitlerCpuCore} onChange={handleFilterChange} />
            : chartType === "CPU Proc"
                ? <></>
                : chartType === "Оперативная память"
                    ? <RamFilter filter={filterRam} onChange={handleFilterRamChange} />
                    : <></>
        } */}
    </div>
        {chartType === "CPU Core"
            ?  <WrapperCpuCore />
            : chartType === "CPU Proc"
                ? <WrapperCpuProc />
                : chartType === "Диск"
                    ? <WrapperDisk filter={filterRam} />
                    : chartType === "Оперативная память"
                     ? <WrapperRam />
                     : <WrapperTraffic />
        }
    </>
}

export default TabsAreas;