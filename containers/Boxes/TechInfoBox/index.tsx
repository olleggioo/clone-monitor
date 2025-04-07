import { Dashboard } from "@/components"
import styles from "./TechInfoBox.module.scss"

const TechInfoBox = ({
    
}: any) => {
    return <Dashboard title="Техническая информация" className={styles.el}>
        <div className={styles.wrapper}>
            {/* <span className={styles.title}>Расторжение</span>
            <span className={styles.data}>{isArchived} шт</span> */}
        </div>
    </Dashboard>
}

export default TechInfoBox