import { FC } from "react"
import styles from "./FlexTable.module.scss"
import { TableHeadCellI, TableRowI } from "../Table"
import { Status } from "@/ui"

interface PropsFlexTable {
    columns: TableHeadCellI[]
    rows: TableRowI[]

}

// interface TableHeadCellI {
//     title: string
//     accessor: string
// }

const FlexTable: FC<PropsFlexTable> = ({
    columns, 
    rows
}) => {
    return (
        <div className={styles.el}>
            <div className={styles.header}>
            {columns.map((item: TableHeadCellI) => {
                return <div key={item.accessor} className={styles.innerColumn}>
                    {item.title}
                </div>
            })}
            </div>
                {rows.map((item: TableRowI) => {
                    return <div key={item.id} className={styles.content}>
                        {item.columns.map((column: any) => {
                            return <div key={column.title} className={styles.innerContent}>
                                {/* {column.title} */}
                                {column.status ?
                                    <Status 
                                        onClick={column.onClick} 
                                        href={`${column.url}`} 
                                        tagName="span" 
                                        correctTitle={column.state?.firmwareData?.modelId} 
                                        title={column.title} 
                                        state={column.status} 
                                        description={column.description} 
                                        additionalDescription={column.additionalDescription}
                                        place={column.place}
                                /> : column.title}
                            </div>
                        })}
                    </div>
                })}
            {/* </div> */}
        </div>
    )
}

export default FlexTable;