import MultiSelect from "@/components/MultiSelect";
import { Field, Heading } from "@/ui";
import styles from "./PoolSettings.module.scss"

const Pooltem = ({
    keys, 
    items, 
    onChanges, 
    value,
    checkboxBool = true,
    workerBool = false,
}: any) => {
    console.log("value", value)
    const keyName = keys === 0 ? "first" : keys === 1 ? "second" : "third"
    const handleFirstSelectName = (e: any, newValue: any) => {
        const newVal = newValue?.value || null
        onChanges(keyName, 'name', newVal)
    }
    const handleFirstSelectUrl = (e: any, newValue: any) => {
        const newVal = newValue?.value || null
        onChanges(keyName, 'url', newVal)
    }

    const handleChangeChecked = (e: any) => {
        onChanges(keyName, 'flag', e.target.checked)
    }

    const handleFirstInputUrl = (e: any) => {
        onChanges(keyName, 'url', e.target.value)
    }

    const handleChangeUser = (e: any) => {  
        onChanges(keyName, 'user', e.target.value)
    }

    const handleChangePassword = (e: any) => {
        onChanges(keyName, 'password', e.target.value)
    }
    return <>
    <div className={styles.wrapperPool}>
        <div className={styles.testBox}>
            <Heading text={`Пул ${Number(keys) + 1}`} className={styles.headingItem} />
            {checkboxBool && <input 
                checked={value[keyName].flag}
                onChange={handleChangeChecked}
                type="checkbox"
            />}
        </div>
        <Field 
            disabled={!value[keyName].flag}
            value={value[keyName].url || ""}
            // items={items.url}
            onChange={handleFirstInputUrl}
            // label={`Url пула ${Number(keys) + 1}`}
            placeholder={`Url пула ${Number(keys) + 1}`}
        />
        {workerBool ? <Field
            disabled={!value[keyName].flag}
            value={value[keyName].user || ""}
            // label={"Воркер"}
            placeholder="Воркер"
            type="text"
            onChange={handleChangeUser}
        /> : <Field
            disabled={!value[keyName].flag}
            // value={value[keyName].user}
            // label={"Воркер"}
            placeholder="Воркер"
            type="text"
            onChange={handleChangeUser}
        />}
        <Field
            disabled={!value[keyName].flag}
            value={value[keyName].password || ""}
            // value={value[keyName].user}
            // label={"Пароль"}
            placeholder="Пароль"
            type="text"
            onChange={handleChangePassword}
        />
    </div>
    </>
}

export default Pooltem;