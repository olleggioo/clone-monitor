import { Dashboard } from "@/components"
import { Layout } from ".."
import AccordionComponent from "@/components/Accordion"
import { useState } from "react"
import styles from "./Boxes.module.scss"
import TechInfoBox from "./TechInfoBox"

const randomArray = Array.from({ length: 10 })

const BoxesContainer = () => {
    const [editArea, setEditArea] = useState({
        flag: false,
        value: ""
    })

    console.log(randomArray)
    return <Layout pageTitle="Коробки">
        <Dashboard>
            {randomArray && randomArray.map((item, key) => {
                return <div key={key} style={{marginTop: "1rem"}}>
                    <AccordionComponent title={`item.name-${key}`} editable={false} onChange={setEditArea}>
                        <div className={styles.combineBlock}>
                            <TechInfoBox />
                            <div className={styles.divider} />
                            <p>SPAN</p>
                        </div>
                    </AccordionComponent>
                </div>
            })}
        </Dashboard>
    </Layout>
}

export default BoxesContainer