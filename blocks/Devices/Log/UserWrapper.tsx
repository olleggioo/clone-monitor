import { deviceAPI, logListAPI } from "@/api"
import { Dashboard, Loader, Pagination } from "@/components"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Load from "@/components/Load"
import UserLog from "./UserLog"

const INITIAL_PAGE_LIMIT = 100


const UserWrapper = () => {
    const router = useRouter()
    const [logList, setLogList] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const [filterPage, setFilterPage] = useState(1)
    function compare(a: any, b: any) {
        let dateA: any = new Date(a.createdAt);
        let dateB: any = new Date(b.createdAt);
       
        return dateB - dateA;
    }
    useEffect(() => {
        setLoading(true)
        if(typeof(router.query.id) === "string" && router.query.id !== "") {
            logListAPI.getLogDevice(router.query.id, {
                where: {
                  userId: `$Like("%${router.query.id}%")`
                },
                limit: 1000,
                order: {
                  createdAt: "DESC"
                }}).then((res) => {
                    setLogList(res.rows.sort(compare))
                    setLoading(false)
                }).catch((err: any) => {
                    console.error(err)
            })
        }
    }, [router.query.id])
    
    const handlePageChange = (page: number) => {
        setFilterPage(page);
    }

    return (
        <>
            {!loading
                ? logList !== null && logList.length !== 0
                    ? <Dashboard>
                        {/* <AntminerLog 
                            page={filterPage}
                            listLog={logList}
                        /> */}
                        <UserLog 
                            page={filterPage}
                            listLog={logList}
                        />
                        <Pagination 
                            onPageChange={handlePageChange}
                            limit={INITIAL_PAGE_LIMIT}
                            offset={INITIAL_PAGE_LIMIT * (filterPage - 1)}
                            total_count={logList.length}
                        />
                    </Dashboard> 
                    : <p>Нет данных</p>
                : <Load />
            }
        </>
    )
}

export default UserWrapper