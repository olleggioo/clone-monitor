import { FC, useEffect, useId, useState } from 'react';
import classNames from 'classnames';
import styles from './Field.module.scss';
import { FieldFileI, FieldI } from '@/ui/Field/Field';
import { FileUploader } from 'react-drag-drop-files';

const FieldFile: FC<FieldFileI> = ({
  label,
  onChange,
  className,
  wrapClassname,
  error,
  ...props
}) => {
  const [fileName, setFileName] = useState('');
  const id = useId();

  const handleFileChange = (file: File) => {
    setFileName(file.name); // Устанавливаем имя файла
    if (onChange) {
      onChange(file); // Вызываем родительский обработчик, если он передан
    }
  };

  const wrapClass = classNames(styles.el, wrapClassname);

  useEffect(() => {
    const updateSuccessMessage = () => {
      const messageElement = document.querySelector(
        '#__next > div.Layout_container__pAjB_ > div.Layout_flexBox__dLPvo > main > div > div.Devices_actionsUser__oungP > div:nth-child(1) > form > div:nth-child(1) > div > label > div > span > span'
      );
      const parentElement = document.querySelector(
        '#__next > div.Layout_container__pAjB_ > div.Layout_flexBox__dLPvo > main > div > div.Devices_actionsUser__oungP > div:nth-child(1) > form > div:nth-child(1) > div > label > div > span'
      );

      if (parentElement) {
        // Ищем текстовую ноду, которая содержит "Upload another?"
        parentElement.childNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim() === "Upload another?") {
            node.textContent = " "; // Заменяем текст
          }
        });
      }

      if (messageElement && messageElement.textContent === 'Uploaded Successfully!') {
        messageElement.textContent = `Выбран файл: ${fileName}`;
      }
    };

    // Наблюдаем изменения в DOM
    const observer = new MutationObserver(() => {
      updateSuccessMessage();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Первоначальная проверка
    updateSuccessMessage();

    return () => observer.disconnect();
  }, [fileName]);

  return (
    <div className={wrapClass}>
      <FileUploader
        label={label || 'Загрузите файл формата .csv'}
        multiple={false}
        handleChange={handleFileChange}
        name="file"
        types={['csv']}
        {...props}
      />
      {fileName && <div className={styles.fileName}>Выбран файл: {fileName}</div>}
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default FieldFile;