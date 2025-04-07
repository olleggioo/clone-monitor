import { atomPeriodFromToCharts } from "@/atoms/statsAtom";
import { Dashboard, ErrorPopup } from "@/components"
import { useAtom } from "jotai";
import DatePicker from "react-datepicker";
import styles from "./UploadUsers.module.scss"
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@/ui";
import { devicesFilterAtom } from "@/atoms/appDataAtom";
import { deviceAPI, userAPI } from "@/api";
import { saveAs } from 'file-saver';
import moment from "moment";
import { useState } from "react";
import ru from 'date-fns/locale/ru';

const UploadUsers = ({styl}: any) => {
    const [dateRange, setDateRange] = useAtom(atomPeriodFromToCharts);
    const [startDate, endDate] = dateRange;
    const [filter, setFilter] = useAtom(devicesFilterAtom)
    const [error, setError] = useState()
    const [loading, setLoading] = useState(false)
    
    const upload = async () => {
        setLoading(true)
        let where;
        where = {
          userDevices: {
            areaId: filter.area,
            // model: {
            //   name:  filter.model && `$Like("%${filter.model}%")` || null
            // },
            statusId: filter.status,
            algorithmId: filter.algorithm,
            ipaddr: filter.ip || null,
            sn: filter.sn && `$Like("%${filter.sn}%")` || null,
          },
          id: filter.client || null, 
        }
        const data = await userAPI.getUploadUserData({
            where,
            createdAt: [
                `${moment(startDate).format("YYYY-MM-DD HH:mm")}`,
                `${moment(endDate).add(1, 'day').subtract(1, 'minute').format("YYYY-MM-DD HH:mm")}`
            ],
        })
        .then(res => {
            const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, 'user_report.xlsx');
        })
        .catch((error) => {
            if (error.message) {
                setError(error.message)
            } else {
                console.error(error)
            }
        })
        .finally(() => {
            setLoading(false)
        })
    }
    const roleId = localStorage.getItem(`${process.env.API_URL}_role`)
    return <Dashboard title="Выгрузка пользователей" description="Для выгрузки можете использовать фильтр клиенты">
        <div className={styles.fields} style={roleId === "b9507b39-884d-11ee-932b-300505de684f" ? {gridTemplateColumns: '5fr 1fr'} : {}}>
            <div className={styles.field}>
                <DatePicker
                    locale={ru}
                    wrapperClassName={styles.dataPicker}
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update) => {
                        setDateRange(update);
                    }}
                    isClearable={true}
                    placeholderText={'Диапазон дат'} 
                />
            </div>
            <div className={styles.field}>
                <Button title="Экспорт" onClick={upload} className={styles.btn} loading={loading} />
            </div>
        </div>
        {!!error && <ErrorPopup text={error} />}
    </Dashboard>
}

export default UploadUsers