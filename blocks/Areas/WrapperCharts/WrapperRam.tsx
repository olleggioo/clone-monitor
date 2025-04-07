import { deviceAPI } from "@/api";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import ChartCpuCore from "../ChartCpuCore";
import ChartCpuProc from "../ChartCpuProc";
import moment from "moment-timezone";
import { Button } from "@/ui";
import styles from "./Wrapper.module.scss"
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import ChartRam from "../ChartRam";

export const namesCpu = ["map", "poll", "redis"]


const timezone = "Europe/Moscow";
const intervalHours = 8;

const WrapperRam: FC<any> = ({
    filter
}) => {
    const router = useRouter()
    const id = router.query.id as string | undefined;
    const [ramData, setRamData] = useState<any>([]);

    const dateNow = moment().subtract(3, 'hour').format('YYYY-MM-DD HH:mm:ss')

    const [currentStart, setCurrentStart] = useState(
        moment.tz(timezone).subtract(intervalHours, 'hour')
    );
    const [currentEnd, setCurrentEnd] = useState(moment.tz(timezone));

    const formatForQuery = (m: moment.Moment) => {
        return m.clone().utc().format("YYYY-MM-DD HH:mm:ss");
    };

    const fetchRamData = async () => {
        try {
            const res = await deviceAPI.getBoxRam({
                where: {
                    appId: id,
                    createdAt: `$Between(["${formatForQuery(currentStart)}", "${formatForQuery(currentEnd)}"])`,
                },
                limit: 5000,
                order: {
                    createdAt: "ASC"
                }
            });
            return res;

        } catch (error) {
            console.error(`Error fetching data`, error);
            return null;
        }
    }

    useEffect(() => {

        const fetchAllRamData = async () => {
            try {
                const [ramSwapData] = await Promise.all([
                    fetchRamData(),
                ]);
                const data = [ramSwapData]
                console.log("ramSwapData", ramSwapData)
                setRamData(data);
            } catch (err) {
                console.error('Error fetching all CPU core data:', err);
            }
        };

        if (id) {
            fetchAllRamData();
        }
    }, [id, currentStart, currentEnd]);

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

    // console.log("cpuProcData", cpuProcData)

    return <>
        <div className={styles.btnActions}>
            <Button 
                icon={<ArrowBackIosRoundedIcon width={20} height={20} />}
                title="-8 часов"
                className={styles.arrow}
                onClick={handleBack}
            />
            <Button 
                iconRight={<ArrowForwardIosRoundedIcon width={30} height={30} />}
                title="+8 часов"
                className={styles.arrow}
                onClick={handleForward}
                disabled={isForwardDisabled}
            />
        </div>
        {ramData && ramData.length > 0 && <ChartRam cpuCoreData={ramData} filter={filter} />}
    </>
}

export default WrapperRam;