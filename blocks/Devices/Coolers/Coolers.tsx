import { IconAperture } from "@/icons";
import styles from "./Coolers.module.scss"
import { FC, useId } from "react";

// const fans = [
//     { id: 1, value: 4440 },
//     { id: 2, value: 8000 },
//     { id: 3, value: 5300 },
//     { id: 4, value: 0 },
// ];

const MAX_RPM = 7800;
const HIGH_RPM_THRESHOLD = 5200;

const CoolersBlock: FC<any> = ({
    fans
}) => {
    return (
        <div className={styles["fan-container"]}>
            {fans.map((fan: any, key: any) => {
                const percentage = (fan.value / MAX_RPM) * 100;
                // const id = useId();

                let fanIconColor = "var(--color-default)";
                let barContainerClass = styles["bar-container"];
                let barColor = "var(--color-brand)";
                
                if (fan.value === 0) {
                    fanIconColor = "var(--color-off)";
                    // barContainerClass = styles["bar-empty"];
                    barColor = "var(--color-off)";
                } else if (fan.value > MAX_RPM) {
                    fanIconColor = "var(--color-error)";
                    barColor = "var(--color-error)";
                } else if (fan.value > HIGH_RPM_THRESHOLD) {
                    fanIconColor = "var(--color-info)";
                    barColor = "var(--color-error)";
                }

                return (
                    <div key={key} className={styles["fan"]}>
                        <div className={fan.value !== 0 
                            ? fan.value > MAX_RPM
                                ? styles["fan-wrapper-empty"]
                                : styles["fan-wrapper"]
                            : styles["fan-wrapper-empty"]
                        }>
                            <div className={styles["fan-header"]}>
                                <p>Кулер {key + 1}</p>
                                <p>{fan.value} RPM</p>
                            </div>
                            <IconAperture width={20} height={20} />
                        </div>
                        <div className={barContainerClass}>
                            <div className={styles["bar"]} style={{ width: `${percentage}%`, background: barColor }}></div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default CoolersBlock;