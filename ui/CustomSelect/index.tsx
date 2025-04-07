import { FC, useEffect, useState } from 'react'
import { OptionItemI, SelectI } from './CustomSelect'
import styles from './CustomSelect.module.scss'
import classNames from 'classnames'
import ChevronDown from '@/icons/ChevronDown'
import { useOnClickOutside } from '@/hooks'

const CustomSelect: FC<SelectI> = ({
  type,
  label,
  options,
  selectedOption,
  placeholder,
  description,
  onChange,
  disabled = false,
  className,
  required = false,
  handleSearchValue
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('');
  const availableOptions = options.filter((option: any) => option !== selectedOption && option.label.toLowerCase().includes(searchValue.toLowerCase()));
  const isPlaceholderSelected = placeholder && placeholder === selectedOption;

  const onSelectClick = () => {
    setIsOpen((prev) => !prev)
  }

  const onItemClick = (option: OptionItemI) => {
    setIsOpen(false)
    onChange && onChange(option)
  }

  const blockRef = useOnClickOutside(() => {
    setIsOpen(false)
  })


  const renderSelect = () => (
    <div
      className={classNames(
        className,
        styles.el,
        type && styles[`el_${type}`],
        {
          [styles.el_open]: isOpen,
          [styles.el_disabled]: disabled,
        }
      )}
      ref={blockRef}
    >
      {required && <input
          type="text"
          style={{
            borderRadius: '20px',
            padding: '20px 12px',
          }}
          placeholder="Поиск"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            handleSearchValue && handleSearchValue(e.target.value);
          }}
        />}
      <button className={styles.select} disabled={disabled} onClick={onSelectClick}>
        <p className={styles.inner}>
          <span
            className={classNames(styles.value, {
              [styles.value__placeholder]: isPlaceholderSelected
            })}
          >
            {selectedOption?.label}
          </span>
          {description && <span className={styles.desc}>{description}</span>}
        </p>
        <div className={styles.icon}>
          <ChevronDown width={20} height={20} />
        </div>
      </button>
      {isOpen && (
        <div className={styles.menu}>
          {placeholder && placeholder !== selectedOption && (
            <button
              onClick={() => onItemClick(placeholder)}
              key={placeholder.value}
              className={classNames(styles.option, styles.option_placeholder)}
            >
              {placeholder.label}
            </button>
          )}
          {availableOptions.map((option: any) => (
            <button
              onClick={() => onItemClick(option)}
              key={option.value}
              className={styles.option}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )

  return label ? (
    <div className={styles.wrapper}>
      <p className={styles.label}>{label}</p>
      {renderSelect()}
    </div>
  ) : (
    renderSelect()
  )
}

export default CustomSelect
