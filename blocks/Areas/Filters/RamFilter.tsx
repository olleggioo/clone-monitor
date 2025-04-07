import { FC } from "react";
import styles from "./Filterts.module.scss"
import { Checkbox } from "@/ui";

const RamFilter: FC<any> = ({
    filter,
    onChange
}) => {
    return <div className={styles.flex}>
        {Object.keys(filter).map(param => (
            <label key={param} className={styles.flexCheckbox}>
                <Checkbox 
                    label={param.toUpperCase()}
                    name={param.toUpperCase()}
                    isChecked={filter[param as keyof typeof filter]}
                    onChange={() => onChange(param as keyof typeof filter)}
                    value=""
                    className={styles.checkboxRam}
                />
            </label>
        ))}
    </div>
}

export default RamFilter;