import { useOnClickOutside } from "@/hooks";
import classNames from "classnames";
import { FC, useState } from "react";
import styles from './Dropdown.module.scss'
import Button from "../Button";
import { IconMoreVertical, IconPlay, IconRefresh } from "@/icons";
import { Menu, MenuItem } from "@mui/material";
import IconButton from "../IconButton";
import IconPower from "@/icons/Power";

const DropdownActions: FC<{items?: any, className?: any}> = ({ items, className }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);
    const onToggleClick = (e: any) => {
        setIsOpen((prev) => !prev)
        setAnchorEl(e.currentTarget)
    }
    const blockRef = useOnClickOutside(() => {
        // setIsOpen(false)
    })

    const flexItems = items.filter((item: any) => item.text === "Перезагрузить")
    const itemOn = items.filter((item: any) => item.text === "Включить")
    const itemOff = items.filter((item: any) => item.text === "Выключить")

    return <div
      className={classNames(styles.el, className, {
        [styles.el_open]: isOpen
      })}
      ref={blockRef}
    >
      <Button 
        onClick={onToggleClick}
        icon={<IconMoreVertical width={20} height={20} />}
        title="Действия"
      />
      <Menu
        open={isOpen}
        anchorEl={anchorEl}
        onClose={() => setIsOpen(false)}
        MenuListProps={{ sx: { py: 0 } }}
        slotProps={{
          paper: {
            style: {
              maxHeight: 250,
              borderRadius: 9,
            },
          }
        }}
      >
        {items.length === 0 ? (
          <MenuItem disabled className={styles.item}>
            Нет доступных действий
        </MenuItem>
        ) : <>
          <div className={styles.flexMenu}>
            <IconButton 
              icon={<IconPlay height={20} width={20} />}
              className={classNames(styles.itemFlex, itemOn.length !== 0 ? styles.itemFlexActiveOn : styles.itemFlexBlock)}
              disabled={itemOn.length !== 0 ? false : true}
              onClick={itemOn.length !== 0 ? () => {
                itemOn[0].onClick()
                setIsOpen(false)
              } : () => {}}
            />
            {flexItems.map((item: any) => {
              return <IconButton 
                icon={<IconRefresh width={20} height={20} />} 
                className={styles.itemFlex} 
                onClick={() => {
                  item.onClick()
                  setIsOpen(false)
                }}
              />
            })}
            <IconButton 
              icon={<IconPower height={20} width={20} />}
              className={classNames(styles.itemFlex, itemOff.length !== 0 ? styles.itemFlexActiveOff : styles.itemFlexBlock)}
              disabled={itemOff.length !== 0 ? false : true}
              onClick={itemOff.length !== 0 ? () => {
                itemOff[0].onClick()
                setIsOpen(false)
              } : () => {}}
            />
          </div>
          <div className={styles.divider} />
          {items
            .filter((item: any) => item.text !== "Перезагрузить" && item.text !== "Выключить" && item.text !== "Включить")
            .map((item: any) => {
            const handleClick = () => {
              item.onClick()
              setIsOpen(false)
            }
            return (
              <MenuItem
                onClick={handleClick}
                key={item.text}
                className={classNames(styles.item, {
                  [styles.item_red]: item.mod === 'red'
                })}
              >
                {item.icon}
                <span>{item.text}</span>
              </MenuItem>
            )
          })}
        </>
        }
      </Menu>
  </div>
}

export default DropdownActions;