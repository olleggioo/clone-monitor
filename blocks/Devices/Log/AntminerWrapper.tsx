import { deviceAPI, logListAPI } from "@/api"
import { Dashboard, Loader, Pagination } from "@/components"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import AntminerLog from "./AntminerLog"
import moment from "moment"
import Load from "@/components/Load"
import { Button } from "@/ui"
import styles from "./Table.module.scss"

const INITIAL_PAGE_LIMIT = 100


const AntminerWrapper = () => {
    const router = useRouter()
    const [logList, setLogList] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const [filterPage, setFilterPage] = useState(1)
    const [originalFile, setOriginalFile] = useState<any>(null)
    function compare(a: any, b: any) {
        let dateA: any = new Date(a.createdAt);
        let dateB: any = new Date(b.createdAt);
       
        return dateB - dateA;
    }

    const setOriginalFileFunc = (logs: any) => {
        setOriginalFile({ originalFile: logs });
    };
    useEffect(() => {
        setLoading(true)
        if(typeof(router.query.id) === "string" && router.query.id !== "") {
            deviceAPI.getLogDeviceById(
                router.query.id,
                {
                }
            )
                .then((res) => {
                    setOriginalFileFunc([...res.logs])
                    setLogList(res.logs.sort(compare))
                    setLoading(false)
                })
                .catch((err) => console.error(err))
        }
    }, [router.query.id])

    const reloadReq = () => {
        setLoading(true)
        if(typeof(router.query.id) === "string" && router.query.id !== "") {
            deviceAPI.getLogDeviceById(
                router.query.id,
                {
                }
            )
                .then((res) => {
                    setOriginalFileFunc([...res.logs])
                    setLogList(res.logs.sort(compare))
                    setLoading(false)
                })
                .catch((err) => console.error(err))
        }
    }
    const [selectedCount, setSelectedCount] = useState<number>(INITIAL_PAGE_LIMIT)
    
    const handlePageChange = (page: number) => {
        setFilterPage(page);
    }
    const downloadTxtFile = () => {
        const formattedData = originalFile.originalFile.map((item: any) => `${moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss")} ${item.message.trim()}`).join('\n');
        const element = document.createElement("a");
        const file = new Blob([formattedData], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = "data.txt";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }

    return (
        <>
        
            {!loading && logList !== null && logList.length !== 0
                ? <Dashboard>
                    <Button 
                        title="Обновить"
                        onClick={reloadReq}
                        // className={styles.updateBtn}
                    />
                    <AntminerLog 
                        page={filterPage}
                        listLog={logList}
                    />
                    <Button 
                        title="Скачать"
                        onClick={downloadTxtFile}
                    />
                    <Pagination 
                        onPageChange={handlePageChange}
                        limit={INITIAL_PAGE_LIMIT}
                        offset={INITIAL_PAGE_LIMIT * (filterPage - 1)}
                        total_count={logList.length}
                    />
                </Dashboard> 
                : logList.length === 0
                    ? <p>Нет данных</p>
                    : <Load />
            }
        </>
    )
}

export default AntminerWrapper