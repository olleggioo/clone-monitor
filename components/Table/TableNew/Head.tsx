import { FC, useRef, useState } from "react";
import { TableHeadCellI } from "../Table";
import SortAction from "../TableHead/Sort";
import { Button } from "@/ui";
import { useAtom } from "jotai";
import { devicesFilterAtom, selectedInputAtom } from "@/atoms/appDataAtom";
import { deviceAtom } from "@/atoms";
import styles from "./TableNew.module.scss"
import Checkbox from "@/components/Checkbox";
import classNames from "classnames";
import { useDrag, useDrop } from "react-dnd";

const DraggableColumn = ({ item, index, moveColumn }: any) => {
  const ref = useRef(null);
  const [, drop] = useDrop({
    accept: 'column',
    hover(draggedItem: any) {
      if (draggedItem.index !== index) {
        moveColumn(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'column',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={classNames(styles.headCol, { [styles.dragging]: isDragging })}
    >
      {item.title}
    </div>
  );
};

const Head: FC<{ 
  moveColumn: any
  requiredAction: boolean 
  items: TableHeadCellI[] 
  hasDropDown?: boolean 
  selected?: boolean 
  setSelected?: any 
  required: boolean 
  whichTable?: string
  onSort: any
  sortConfig?: any 
  className?: any
  handleSelectAll?: any
  checked?: any
}> = ({
    moveColumn,
    items,
    hasDropDown,
    required = true,
    onSort,
    setSelected,
    requiredAction,
    sortConfig,
    whichTable,
    className,
    handleSelectAll,
    checked
  }) => {
    const [selected] = useAtom(selectedInputAtom)
    const roleId = localStorage.getItem(`${process.env.API_URL}_role`)
    const [isSort, setIsSort] = useState(false)
    const [flashed, setFlashed] = useState(false)
    const [filter, setFilter] = useAtom(devicesFilterAtom)
    const [device] = useAtom(deviceAtom)
    const onClickFlashed = () => {
      setFlashed(prevState => !prevState)
      setFilter((prevState: any) => {
        return {
            ...prevState,
            isFlashed: flashed === true ? true : "false"
        }
    })
    }
    return <thead className={styles.thead}>
      <tr className={styles.tr}>
      {required &&
      <th className={classNames(styles.th, styles.headerCheckbox)}>
          <Checkbox 
            // value={userId}
            checked={checked}
            onChange={setSelected}
            keys={"head"}
        /> 
      </th>
      }
      <th className={styles.th} />
      {items.map((item: any, i) => {
        const isSortingColumn = sortConfig && sortConfig.key === item.accessor;
        const sortDirection = sortConfig && sortConfig.direction;
        return (
          <th
            className={classNames(styles.th, styles.headCol)}
            onClick={() => {
              onSort && onSort(item.accessor);
              setIsSort(true);
            }}
            style={{
              flexDirection: "row",
              justifyContent: "left",
              gap: "5px"
            }}
            key={item?.accessor}
          >
            {isSortingColumn && <SortAction isSort={isSortingColumn} direction={sortDirection} />}
            {item?.onClick ? (
              <Button
                title={item.title}
                appearance="table"
                onClick={item.onClick}
              />
            ) : (
              <DraggableColumn
                key={item?.accessor}
                item={item}
                index={i}
                moveColumn={moveColumn}
              />
              // <span className={styles.headTitle} style={isSortingColumn ? {color: "black"} : {}}>{item.title}</span>
            )}
          </th>
        );
      })}
    {requiredAction && <th className={classNames(styles.th, styles.btnActions)}>
     {/* {requiredAction && <span className={styles['action-column']} style={(whichTable !== "device" && whichTable !== "users") ? {width: "80px"} : {}} /> } */}
     {/* {whichTable === "device" || whichTable === "users" && <span className={styles['action-column']} />} */}
    </th>}
    </tr>
    </thead>
}

export default Head;