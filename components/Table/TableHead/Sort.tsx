import { IconSortArrow } from "@/icons";
import { FC } from "react"

const SortAction: FC<{isSort?: boolean, direction?: string}> = ({ isSort, direction }) => {
    return <span><IconSortArrow width={16} height={16} style={{ transform: direction === 'DESC' ? 'rotate(180deg)' : 'none' }} /></span>;
}

export default SortAction