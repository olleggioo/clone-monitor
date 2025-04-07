import styles from "./UploadData.module.scss"
import { saveAs } from 'file-saver'; // Импорт для сохранения файла

const TableComponent = ({ initialData, blob }: any) => {

    const handleDownload = () => {
        saveAs(blob, "exported_table.xlsx"); 
    };
  
    return (
      <div>
        <div className="test">
            <h1>Таблица данных</h1>
            <button 
                onClick={handleDownload}
                className="el"
            >
                Скачать таблицу
            </button>
        </div>
        <table>
          <tbody>
            {initialData && initialData.length !== 0 && initialData.map((row: any, rowIndex: any) => (
              <tr key={rowIndex}>
                {row.map((cell: any, cellIndex: any) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

export default TableComponent;