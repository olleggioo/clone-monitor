import styles from "./Load.module.scss"

const Load = () => {
    return (
        <div className={styles["loading-container"]}>
            <div className={styles["loading-spinner"]} />
        </div>
    )
}

export default Load