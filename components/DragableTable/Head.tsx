import { FC } from "react";
import { TableHeadCellI } from "../Table/Table";
import SortAction from "../Table/TableHead/Sort";
import { Button } from "@/ui";

const Head: FC<{ requiredAction: boolean, items: TableHeadCellI[]; hasDropDown?: boolean, selected?: boolean, setSelected?: any, required: boolean, onSort: any }> = ({
    items,
    hasDropDown,
    selected,
    setSelected,
    required = true,
    onSort,
    requiredAction
  }) => {
    return <thead>
        <th>
        {items.map((item, i) => {
        return (
          <td
            style={{width: "150px"}}
            onClick={() => onSort && onSort(item.accessor)}
            key={item.title}
          >
            {onSort && <SortAction />}
            {item.onClick ? (
              <Button
                title={item.title}
                appearance="table"
                onClick={item.onClick}
              />
            ) : (
              <span style={{borderBottom: '1px solid #878787', cursor: 'pointer'}}>{item.title}</span>
            )}
          </td>
        )
      })}
        </th>
    </thead>
}

export default Head