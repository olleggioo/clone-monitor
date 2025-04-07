import ProfileUser from "@/components/ProfileUser"
import { Layout } from ".."
import styles from "./CurrentRoleAccess.module.scss"
import { requestsAccessMap, requestsAccessTranslation } from "@/helpers/componentAccessMap"
import AccessTable from "@/blocks/Devices/Log/AccessTable"

const CurrentRoleAccessContainer = () => {
    const currentRoleAccessStorage = localStorage.getItem("currentRoleAccess")
    let currentRoleAccess = [];
    if(currentRoleAccessStorage) {
        currentRoleAccess = JSON.parse(currentRoleAccessStorage)
    }

    const result = currentRoleAccess.map((item: any) => {
        // Найти ключ по accessId
        const key = Object.keys(requestsAccessMap).find(
            k => (requestsAccessMap as Record<string, string>)[k] === item.accessId
        );
        
        // Получить перевод или вернуть сообщение, если ключ не найден
        const translation = key ? (requestsAccessTranslation as Record<string, string>)[key] : item.access.name;
        
        return {
            id: item.id,
            accessId: item.accessId,
            key: key || item.access.name,
            translation
        };
    });

    console.log("result", result)

    return <Layout header={<ProfileUser title='Текущий role-access' />}>
        <div className={styles.el}>
            {/* {result && result.map((item: any) => {
                return <div className={styles.inner}>
                    <div className={styles.translation}>
                        {item.key}
                    </div>
                    <div>-</div>
                    <div className={styles.key}>
                        {item.translation}
                    </div>
                </div>
            })} */}
            <AccessTable 
                data={result}
            />
        </div>
    </Layout>
}

export default CurrentRoleAccessContainer