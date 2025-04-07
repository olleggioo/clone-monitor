import React, {FC} from "react"
import Layout from "../Layout"
import { StatsDevicesStatuses } from "@/blocks";
import AreaStatuses from "@/blocks/Main/AreaStatuses";
import { Button } from "@/ui";
import { useRouter } from "next/router";
import LayoutMain from "../LayoutMain";
import Map from "@/blocks/Main/Map";
import LayoutClients from "../Layout/LayoutClients";

const MainContainerClients: FC = () => {
    return (
        <LayoutClients pageTitle="Главная" header={""}>
            <AreaStatuses />
            <Map />
        </LayoutClients>
    )
}

export default MainContainerClients