import { deviceAPI } from "@/api";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ChartCpuCore from "../ChartCpuCore";
import ChartCpuProc from "../ChartCpuProc";
import moment from "moment-timezone";
import { Button } from "@/ui";
import styles from "./Wrapper.module.scss"
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';

export const namesCpu = ["map", "poll", "redis"]

export const pidNames = [
    "polling-listen",
    "mapping-listen",
    "polling-schedule",
    "mapping-schedule",
    "polling-logger",
    "mapping-logger",
    "kernel-schedule",
]

const timezone = "Europe/Moscow";
const intervalHours = 1;

const WrapperCpuProc= () => {
    const router = useRouter()
    const id = router.query.id as string | undefined;
    const [cpuProcData, setCpuProcData] = useState<any>([]);

    const dateNow = moment().subtract(3, 'hour').format('YYYY-MM-DD HH:mm:ss')

    const [currentStart, setCurrentStart] = useState(
        moment.tz(timezone).subtract(intervalHours, 'hour')
    );
    const [currentEnd, setCurrentEnd] = useState(moment.tz(timezone));

    const formatForQuery = (m: moment.Moment) => {
        return m.clone().utc().format("YYYY-MM-DD HH:mm:ss");
    };

    useEffect(() => {
        // Функция для получения данных по конкретному индексу
        const fetchCpuProcData = async (name: string) => {
            try {
                const res = await deviceAPI.getBoxCpuProc({
                    where: {
                        appId: id,
                        pid: name,
                        createdAt: `$Between(["${formatForQuery(currentStart)}", "${formatForQuery(currentEnd)}"])`,
                    },
                    limit: 5000,
                    order: {
                        createdAt: "ASC"
                    }
                });
                return res;
            } catch (err) {
                console.error(`Error fetching data for name ${name}:`, err);
                return null;
            }
        };

        const fetchAllCpuProcData = async () => {
            const indices = Array.from({ length: 8 }, (_, i) => i + 1);
            const requests = pidNames.map(name => fetchCpuProcData(name));
            
            try {
                const results = await Promise.all(requests);
                // Фильтруем null значения, если какие-то запросы не удались
                const filteredResults = results.filter(result => result !== null);
                setCpuProcData(filteredResults);
            } catch (err) {
                console.error('Error fetching all CPU core data:', err);
            }
        };

        if (id) {
            fetchAllCpuProcData();
        }
    }, [id]);

    const handleBack = () => {
        setCurrentStart(prev => moment(prev).subtract(intervalHours, 'hour'));
        setCurrentEnd(prev => moment(prev).subtract(intervalHours, 'hour'));
    };

    const handleForward = () => {
        const newEnd = moment(currentEnd).add(intervalHours, 'hour');
        if (newEnd.isAfter(moment())) {
            setCurrentEnd(moment());
            setCurrentStart(moment().subtract(intervalHours, 'hour'));
        } else {
            setCurrentStart(prev => moment(prev).add(intervalHours, 'hour'));
            setCurrentEnd(prev => moment(prev).add(intervalHours, 'hour'));
        }
    };

    const isForwardDisabled = moment().diff(currentEnd, 'seconds') < 1;

    return <>
        <div className={styles.btnActions}>
            <Button 
                icon={<ArrowBackIosRoundedIcon width={20} height={20} />}
                title="-1 час"
                className={styles.arrow}
                onClick={handleBack}
            />
            <Button 
                iconRight={<ArrowForwardIosRoundedIcon width={30} height={30} />}
                title="+1 час"
                className={styles.arrow}
                onClick={handleForward}
                disabled={isForwardDisabled}
            />
        </div>
        {cpuProcData && cpuProcData.length > 0 && <ChartCpuProc cpuCoreData={cpuProcData} />}
    </>
}

export default WrapperCpuProc;