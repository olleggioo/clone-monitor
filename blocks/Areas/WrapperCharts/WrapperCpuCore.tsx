import { deviceAPI } from "@/api";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import ChartCpuCore from "../ChartCpuCore";
import moment from "moment-timezone";
import styles from "./Wrapper.module.scss"
import { IconArrowRightCircle } from "@/icons";
import { ArrowLeft, ArrowRight, ArrowRightRounded } from "@mui/icons-material";
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import { IconButton } from "@mui/material";
import { Button } from "@/ui";

const timezone = "Europe/Moscow";
// Длительность интервала (в часах) – подберите значение, при котором будет 177 точек
const intervalHours = 1; // Например, 1 час

const WrapperCpuCore: FC<any> = () => {
    const router = useRouter();
    const id = router.query.id as string | undefined;
    const [cpuCoreData, setCpuCoreData] = useState<any>([]);
    
    const [currentStart, setCurrentStart] = useState(
        moment.tz(timezone).subtract(intervalHours, 'hour')
    );
    const [currentEnd, setCurrentEnd] = useState(moment.tz(timezone));

    const formatForQuery = (m: moment.Moment) => {
        return m.clone().utc().format("YYYY-MM-DD HH:mm:ss");
    };

    console.log("currentEnd", formatForQuery(currentEnd))

    // Функция для получения данных по конкретному индексу с учетом интервала currentStart-currentEnd
    const fetchCpuCoreData = async (index: number) => {
        try {
            const res = await deviceAPI.getBoxCpuCore({
                where: {
                    appId: id,
                    num: `${index}`,
                    createdAt: `$Between(["${formatForQuery(currentStart)}", "${formatForQuery(currentEnd)}"])`,
                },
                limit: 5000,
                order: {
                    createdAt: "ASC"
                }
            });
            return res;
        } catch (err) {
            console.error(`Error fetching data for index ${index}:`, err);
            return null;
        }
    };

    const fetchAllCpuCoreData = async () => {
        setCpuCoreData([]);
        
        const indices = Array.from({ length: 8 }, (_, i) => i + 1);
        const requests = indices.map(index => fetchCpuCoreData(index));
    
        try {
            const results = await Promise.all(requests);
            const filteredResults = results.filter(result => result !== null);
            setCpuCoreData(filteredResults);
        } catch (err) {
            console.error('Error fetching all CPU core data:', err);
        }
    };

    useEffect(() => {
        if (id) {
            fetchAllCpuCoreData();
        }
    }, [id, currentStart, currentEnd]);

    const handleBack = () => {
        setCurrentStart(prev => moment(prev).subtract(intervalHours, 'hour'));
        setCurrentEnd(prev => moment(prev).subtract(intervalHours, 'hour'));
    };

    const handleForward = () => {
        const newEnd = moment(currentEnd).add(intervalHours, 'hour');
        if (newEnd.isAfter(moment())) {
            // Если новое время превышает текущее, просто устанавливаем currentEnd равным текущему времени
            setCurrentEnd(moment());
            setCurrentStart(moment().subtract(intervalHours, 'hour'));
        } else {
            setCurrentStart(prev => moment(prev).add(intervalHours, 'hour'));
            setCurrentEnd(prev => moment(prev).add(intervalHours, 'hour'));
        }
    };

    const isForwardDisabled = moment().diff(currentEnd, 'seconds') < 1;

    return (
        <>
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
            {cpuCoreData && cpuCoreData.length > 0 && (
                <ChartCpuCore cpuCoreData={cpuCoreData} />
            )}
        </>
    );
};

export default WrapperCpuCore;
