import { ChildProcessWithoutNullStreams } from "child_process";
import { FC, ReactNode, useRef, useState } from "react"
import styles from "./Accordion.module.scss"
import Accordion from '@mui/material/Accordion';
import { AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Field, IconButton } from "@/ui";
import { IconEdit, IconEdit2 } from "@/icons";

const AccordionComponent: FC<{title: string, onChange?: any, editable?: boolean, children: ReactNode}> = ({
    title,
    onChange,
    children,
    editable = true
}) => {
    const [active, setActive] = useState(false);
    const content = useRef<HTMLDivElement | null>(null);
    const [height, setHeight] = useState("0px");

    function toggleAccordion() {
        setActive(!active);
        if (content.current) {
            setHeight(active ? "0px" : `${content.current.scrollHeight}px`);
        }
    }

    return (
        <Accordion className={styles.box} sx={{
            boxShadow: "none",
            "&.MuiAccordion-root:before": { // Переопределяем стили ::before для Accordion
                display: "none",
            },
        }}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
                sx={{
                borderBottom: "1px solid #DFDFDF"

                }}
            >
                <div style={{display: "flex", alignItems: "center", gap: "10px", }}>
                    <p>{title}</p>
                    {editable && <IconEdit2 width={20} height={20} />}
                </div>
            </AccordionSummary>
            <AccordionDetails>
                {children}
            </AccordionDetails>
        </Accordion>
    )
}

export default AccordionComponent