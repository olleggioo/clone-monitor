import { FC } from "react";
import styles from "./Boards.module.scss";
import { IconChip } from "@/icons";
import { Divider } from "@mui/material";
import { getHashRateUnit } from "@/helpers";
import classNames from "classnames";

const BoardsBlock: FC<any> = ({ data, algorithm }) => {
    const fullData = [...data, ...Array(3 - data.length).fill(null)].map((item, index) =>
        item || {
            sn: null,
            freq: "N/A",
            tempChip: "N/A",
            tempOutlet: "N/A",
            chipNum: "N/A",
            rateReal: "N/A",
        }
    );

    return (
        <div className={styles["boards-container"]}>
            {fullData.map((item: any, key: number) => {
                const hashrateBlock =
                    item.sn !== null
                        ? getHashRateUnit(
                              Number(item.rateReal),
                              "GH",
                              algorithm === "sha256"
                                  ? "TH"
                                  : algorithm === "scrypt"
                                  ? "MH"
                                  : algorithm === "ethash"
                                  ? "GH"
                                  : algorithm === "equihash" || algorithm === "Antminer Z15 Pro"
                                  ? "KH"
                                  : algorithm === "Antminer Z15"
                                  ? "KH"
                                  : "TH"
                          )
                        : { value: "N/A", unit: "" };

                const hashrateValue = hashrateBlock.value;
                const hashrateUnit = hashrateBlock.unit;

                return (
                    <div className={styles["board-card"]} key={key}>
                        <div className={styles["board-title"]}>
                            <span>Плата {key + 1}</span>
                        </div>
                        <Divider />
                        <div className={classNames(styles.sn, { [styles.errorSn]: item.sn === null })}>
                            <IconChip width={20} height={20} />
                            <span>{item.sn || "N/A"}</span>
                        </div>
                        <Divider />
                        <div className={styles["board-info"]}>
                            <div className={styles.flex}>
                                <div className={classNames(styles["board-flex"], { [styles.errorNA]: item.sn === null })}>
                                    <div>Хешрейт</div>
                                    <span>
                                        {hashrateValue} {hashrateUnit}
                                    </span>
                                </div>
                                <Divider />
                                <div className={classNames(styles.board, { [styles.errorNA]: item.sn === null })}>
                                    <div>Temp IN</div>
                                    <span>{item.tempOutlet} C°</span>
                                </div>
                            </div>
                            <div className={styles.flex}>
                                <div className={classNames(styles["board-flex"], { [styles.errorNA]: item.sn === null })}>
                                    <div>Частота</div>
                                    <span>{item.freq} MHZ</span>
                                </div>
                                <Divider />
                                <div className={classNames(styles.board, { [styles.errorNA]: item.sn === null })}>
                                    <div>Temp OUT</div>
                                    <span>{item.tempChip} C°</span>
                                </div>
                            </div>
                            <div className={styles.flex}>
                                <div className={classNames(styles["board-flex"], { [styles.errorNA]: item.sn === null })}>
                                    <div>Чипы</div>
                                    <span>{item.chipNum}</span>
                                </div>
                                <Divider />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default BoardsBlock;