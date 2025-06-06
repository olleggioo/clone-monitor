import { Dashboard, ErrorPopup } from "@/components"
import { Button, Field } from "@/ui"
import styles from "./SendData.module.scss"
import { useState } from "react"
import { deviceAPI, userAPI } from "@/api"
import FieldFile from "@/ui/Field/FieldFile"
import { IconUpload } from "@/icons"

const SendData = () => {
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [isSuccess, setIsSucess] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const onSubmit = async (e: any) => {
        e.preventDefault()
        console.log("e.target.elements", selectedFile)
        // const selectedFile = e.target.elements.file.files[0];
        if(!selectedFile) {
            setError('Выберите файл формата .csv')
            return;
        }
        setLoading(true)
        const formData = new FormData();
        formData.append('payload_file', selectedFile);
        await userAPI.uploadUserDevice({
            file: selectedFile
        })
        .then(res => {
            setIsSucess(true)
            setTimeout(() => {
                window.location.reload()
            }, 3000)
        })
        .catch(err => setError(err.message))
        .finally(() => {
            setLoading(false)
            // setIsSucess(false)
        })   
    }


    const handleFileChange = (file: File) => {
        setSelectedFile(file);
        setError(''); // Убираем ошибку, если файл выбран
    };

    return <Dashboard title="Импорт данных" description="Файл формата .csv" style={{width: "100%"}}>
        <form onSubmit={onSubmit} className={styles.fields}>
            <div className={styles.field}>
            <FieldFile
                label="Загрузите файл формата .csv"
                name="uploadFile"
                accept=".csv"
                onChange={handleFileChange} // Передаем обработчик
            />
            </div>
            <div>
            <Button
                loading={loading}
                type="submit"
                title="Импорт"
                className={styles.btn}
            />
            </div>
        </form>
        {error && <ErrorPopup text={error} />}
        {isSuccess && <ErrorPopup text={"Файл добавлен в очередь"} isSuccess={isSuccess} />}
    </Dashboard>
}

export default SendData