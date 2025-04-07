import React, { useState, ReactNode, MouseEvent } from "react";
import styles from "./CustomTooltip.module.scss";

interface CustomTooltipProps {
  children: ReactNode;
  content: ReactNode;
  offset?: { x: number; y: number };
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
    children,
    content,
    offset = { x: 10, y: 10 },
}) => {
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseEnter = () => {
        setVisible(true);
    };

    const handleMouseLeave = () => {
        setVisible(false);
    };

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        setPosition({
        x: e.clientX + offset.x,
        y: e.clientY + offset.y,
        });
    };

    return (
        <div
            className={styles.tooltipWrapper}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            style={{ display: "inline-block" }}
        >
        {children}

        {visible && (
            <div
                className={styles.tooltip}
                style={{
                    top: position.y,
                    left: position.x,
                }}
            >
                {content}
                <div className={styles.tooltipArrow} />
            </div>
        )}
        </div>
    );
};

export default CustomTooltip;
