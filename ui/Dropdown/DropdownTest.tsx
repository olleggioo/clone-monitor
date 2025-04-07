import { FC, memo, useEffect, useRef, useState } from 'react'
import { DropdownI, DropdownItemI } from './Dropdown'
import styles from './Dropdown.module.scss'
import classNames from 'classnames'
import { useOnClickOutside } from '@/hooks'
import { IconMoreVertical, IconPlay, IconRefresh } from '@/icons'
import { Divider, Menu, MenuItem } from '@mui/material'
import IconButton from '../IconButton'
import IconPower from '@/icons/Power'

interface DropdownNewI extends DropdownI {
  style?: any
  title?: any
  whichTable?: string
  accessId?: string
}

const DropdownTest: FC<DropdownNewI> = ({ id, items, className, style, title, whichTable, accessId }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null);
  const onToggleClick = (e: any) => {
    setIsOpen((prev) => !prev)
    setAnchorEl(e.currentTarget)
  }
  const blockRef = useOnClickOutside(() => {
    // setIsOpen(false)
  }, undefined, anchorEl)  

  useEffect(() => {
    console.warn = () => {};
  }, []);

  const flexItems = items?.filter((item: any) => item?.text === "Перезагрузить")
  // console.log("filexItems", flexItems)

  const itemOn = items?.filter((item: any) => item?.text === "Включить")
  const itemOff = items?.filter((item: any) => item?.text === "Выключить")

  return (
    <div
      style={{
        // position: 'sticky',
        // width: '75px',
        // right: whichTable && whichTable === "device" ? "30px" : "0px",
        // zIndex: 1,
        // height: '100%',
        background: 'white',
      }}
      className={classNames(styles.el, className, {
        [styles.el_open]: isOpen
      })}
      data-dropdown-id={id}
      ref={blockRef}
    >
      <button
        type="button"
        aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
        onClick={onToggleClick}
        className={styles.toggle}
      >
        <IconMoreVertical width={20} height={20} />
        {title && title}
      </button>
      <Menu
          open={isOpen}
          anchorEl={anchorEl}
          onClose={() => setIsOpen(false)}
          MenuListProps={{ sx: { py: 0 } }}
          slotProps={{
            paper: {
              style: {
                maxHeight: 250,
                borderRadius: '9px',
              },
            },
          }}
        >
          {items.length === 0 
            ? <MenuItem disabled className={styles.item}>
            Нет доступных действий
        </MenuItem>
            : <div>
              <div className={styles.flexMenu}>
            {items.length !== 0 && <IconButton 
              icon={<IconPlay height={20} width={20} />}
              className={classNames(styles.itemFlex, itemOn.length !== 0 ? styles.itemFlexActiveOn : styles.itemFlexBlock)}
              disabled={itemOn.length !== 0 ? false : true}
              onClick={itemOn.length !== 0 ? () => {
                itemOn[0].onClick(id)
                setIsOpen(false)
              } : () => {}}
            />}
            {items.length !== 0 && flexItems.map((item: any, key: any) => {
              return <IconButton 
                icon={<IconRefresh width={20} height={20} />} 
                className={styles.itemFlex} 
                key={`${flexItems}${key}`}
                onClick={() => {
                  item.onClick(id)
                  setIsOpen(false)
                }}
              />
            })}
            {items.length !== 0 && <IconButton 
              icon={<IconPower height={20} width={20} />}
              className={classNames(styles.itemFlex, itemOff.length !== 0 ? styles.itemFlexActiveOff : styles.itemFlexBlock)}
              disabled={itemOff.length !== 0 ? false : true}
              onClick={itemOff.length !== 0 ? () => {
                itemOff[0].onClick(id)
                setIsOpen(false)
              } : () => {}}
            />}
          </div>
          <div className={styles.divider} />
          {items
            .filter((item: any) => item?.text === "Редактировать доступ")
            .map((item: any, key) => {
              const handleClick = () => {
  
                item.onClick(accessId)
                setIsOpen(false)
              }
              return (
                <MenuItem
                  onClick={handleClick}
                  key={key}
                  className={classNames(styles.item, {
                    [styles.item_red]: item?.mod === 'red'
                  })}
                >
                  {item?.icon}
                  <span>{item?.text}</span>
                </MenuItem>
              )
            })  
          }
          {items
          .filter((item: any) => item?.text !== "Перезагрузить" && item?.text !== "Выключить" && item?.text !== "Включить" && item?.text !== "Редактировать доступ")
          .map((item: any, key) => {
            const handleClick = () => {

              item.onClick(id)
              setIsOpen(false)
            }
            return (
              <MenuItem
                onClick={handleClick}
                key={key}
                className={classNames(styles.item, {
                  [styles.item_red]: item?.mod === 'red'
                })}
              >
                {item?.icon}
                <span>{item?.text}</span>
              </MenuItem>
            )
          })}
          </div> 
          }
        </Menu>
    </div>
  )
}

export default memo(DropdownTest)
