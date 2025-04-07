import { useEffect, useState } from "react"
import Layout from "../Layout"
import { deviceAPI } from "@/api"
import { Dashboard } from "@/components"
import ModelsTable from "@/blocks/Models"
import ProfileUser from "@/components/ProfileUser"
import { useAtom } from "jotai"
import { modelInfoAtom } from "@/atoms/appDataAtom"
import { deviceAtom } from "@/atoms"

export interface ModelI {
    id: string
    name: string
    nominalEnergy: string
}

export interface ModelReqI {
    rows: ModelI[]
    total: number
}

const ModelsContainer = () => {
    const [models, setModels] = useAtom(modelInfoAtom)
    const [device] = useAtom(deviceAtom)

    useEffect(() => {
        deviceAPI.getDeviceModel({
            limit: 999
        })
            .then((res: ModelReqI) => setModels(res))
            .catch(err => console.error(err))
    }, [])

    return <Layout pageTitle="Модели" header={<ProfileUser title="Модели" />}>
        <Dashboard>

            {models && models.rows && <ModelsTable 
                rows={models.rows}
            />}
        </Dashboard>
    </Layout> 
}

export default ModelsContainer