import styles from "./Checkbox.module.scss"

const Checkbox = ({
    value,
    checked,
    onChange,
    keys,
    style = {},
    dataIndex,
}: any) => {
    return <>
        <input 
            type="checkbox"
            style={style}
            className={styles['custom-checkbox']}
            id={`happy${keys}`}
            name={`happy${keys}`}
            value={value}
            checked={checked}
            onChange={onChange}
            data-index={dataIndex}
        />
        <label htmlFor={`happy${keys}`}></label>
    </>

}

export default Checkbox