import { IconPlus } from "@/icons"
import { Button } from "@/ui"
import { useState } from "react"
import styles from "./UsersHeader.module.scss"
import { Header } from "@/components"
import { AddClientModal } from "@/modals"
import AddArea from "@/modals/Areas/AddArea"
import { hasAccess } from "@/helpers/AccessControl"
import { requestsAccessMap } from "@/helpers/componentAccessMap"

const AreasHeaderMobile = () => {
    const [modal, setModal] = useState<any>(null)
    const buttons = (
        <div className={styles.buttons}>
          {hasAccess(requestsAccessMap.createArea) && <Button
            title="Добавить площадку"
            icon={<IconPlus width={22} height={22} />}
            onClick={() => setModal('add-area')}
          />}
        </div>
    )

    return (
        <>
          {buttons}
          {modal === 'add-area' && <AddArea onClose={() => setModal(null)} />}
        </>
      )
}

export default AreasHeaderMobile