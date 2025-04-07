import { FC, useEffect, useState } from "react"
import { Layout } from ".."
import styles from "./AreaId.module.scss"
import TechInfoArea from "../Areas/TechInfoArea"
import AreasTable from "@/blocks/Areas/AreasTable"
import { Dashboard } from "@/components"
import TabsAreas from "@/blocks/Areas/Tabs"
import WrapperLoggingPoll from "@/blocks/Areas/WrapperLogging/WrapperLoggingPoll"
import WrapperLoggingMap from "@/blocks/Areas/WrapperLogging/WrapperLoggingMap"

interface RangeipsI {
    id: string
    name: string
    from: string
    to: string
    fromNum: string
    toNum: string
    areaId: string
}

export interface LoggingPollI {
    createdAt: string
    message: string
    type: number
    appId: string
    env: string
    argv: string
    options: string
}

export interface AuthedSyncBoxI {
    user: string
    time: string
    host: string
} 

export interface FilesystemSyncBoxI {
    filesystem: string
    size: string
    used: string
    avail: string
    use: string
    mounted: string
}

export interface SyncBoxI {
    id: string
    authed: AuthedSyncBoxI[]
    filesystem: FilesystemSyncBoxI[]
}

export interface CpuCoreDataI {
    appId: string
    argv: string
    createdAt: string
    env: string
    num: string
    value: number
}

interface AreaContainerI {
    id: string
    isError: number
    isNormal: number
    isNotOnline: number
    isRepair: number
    isWarning: number
    name: string
    uptime: string
    energy: {
        unit: string
        value: string
    }
    rangeips: RangeipsI[]
    loggingPoll: {
        rows: LoggingPollI[]
        total: number
    }
    loggingMap: {
        rows: LoggingPollI[]
        total: number
    }
    syncBoxInfo: SyncBoxI
    loggingClickhouse: LoggingPollI[]
    loggingWorker: LoggingPollI[]
    // cpuCoreData: CpuCoreDataI[][]
}

const AreaContainer: FC<AreaContainerI> = ({
    id,
    isError,
    isNormal,
    isNotOnline,
    isRepair,
    isWarning,
    name,
    uptime,
    energy,
    rangeips,
    loggingPoll,
    loggingMap,
    syncBoxInfo,
    loggingClickhouse,
    loggingWorker
    // cpuCoreData
}) => {
    // console.log("cpuCoreData", cpuCoreData)
    return <Layout pageTitle={name}>
        <div className={styles.el}>
            {rangeips && <TechInfoArea 
                isNormal={isNormal}
                isError={isError}
                isWarning={isWarning}
                isNotOnline={isNotOnline}
                isRepair={isRepair}
                // isArchived={isArchived}
                rangeLen={rangeips.length}
                uptime={uptime}
                energy={energy}
            />}
            {rangeips && <AreasTable rows={rangeips} />}
            {/* <Dashboard title="Авторизованные пользователи" className={styles.dashboardAuthed}>
                {syncBoxInfo && <AuthedUserTable data={syncBoxInfo.authed} />}
            </Dashboard>
            <Dashboard title="Файловая система" className={styles.dashboardAuthed}>
                {syncBoxInfo && <FilesystemTable data={syncBoxInfo.filesystem} />}
            </Dashboard> */}
                
            {/* <WrapperLoggingClickhouse data={loggingClickhouse} />
            <WrapperLoggingWorker data={loggingWorker} /> */}
            {/* <LoggingPollTable data={loggingPoll} /> */}
            {/* <div className={styles.dashboardAuthed}>
                <WrapperLoggingPoll data={loggingPoll} />
            </div>
            <div className={styles.dashboardAuthed}>
                <WrapperLoggingMap data={loggingMap} />
            </div> */}
            {/* <LoggingMapTable data={loggingMap} /> */}
            {/* <Dashboard title="Графики" className={styles.dashboardAuthed}>
                <TabsAreas />
            </Dashboard> */}
        </div>
    </Layout>
}

export default AreaContainer