import { Dashboard } from "@/components"
import styles from "./TechInfoArea.module.scss"

const TechInfoArea = ({
    isNormal,
    isError,
    isWarning,
    isNotOnline,
    isRepair,
    isArchived,
    rangeLen,
    uptime,
    energy
}: any) => {
    const sumTotal = isNormal + isError + isWarning + isNotOnline + isRepair;
    return <Dashboard title="Техническая информация" className={styles.el}>
        <div className={styles.wrapper}>
            <span className={styles.title}>В норме</span>
            <span className={styles.data}>{isNormal} шт</span>
            <span className={styles.title}>Всего устройств</span>
            <span className={styles.data}>{isNaN(sumTotal) ? "Нет доступа" : `${sumTotal} шт`}</span>
            <span className={styles.title}>Предупреждение</span>
            <span className={styles.data}>{isWarning} шт</span>
            <span className={styles.title}>Диапазонов</span>
            <span className={styles.data}>{rangeLen}</span>
            <span className={styles.title}>Проблема</span>
            <span className={styles.data}>{isError} шт</span>
            <span className={styles.title}>Общее потребление</span>
            <span className={styles.data}>{isNaN(energy?.value) ? 0 : energy?.value} {energy?.unit}</span>
            <span className={styles.title}>Не в сети</span>
            <span className={styles.data}>{isNotOnline} шт</span>
            {/* <span className={styles.title}>Uptime</span> */}
            {/* <span className={styles.data}>{uptime.total.toFixed(2)}%</span> */}
            <span className={styles.title}>В ремонте</span>
            <span className={styles.data}>{isRepair} шт</span>
            {/* <span className={styles.title}>Расторжение</span>
            <span className={styles.data}>{isArchived} шт</span> */}
        </div>
    </Dashboard>
}

export default TechInfoArea