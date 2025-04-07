import React, { useState, useRef, useEffect } from 'react';
import { Autocomplete, TextField, MenuItem, Box, TextareaAutosize } from '@mui/material';
import { makeStyles } from '@mui/styles';
import styles from "./MassField.module.scss"
import OtherField from './OtherField';
import Field from '../Field';
import DialogField from './DialogField';
import Button from '../Button';
import IconArchive from '@/icons/Archive';
import { IconClose } from '@/icons';

const useStyles = makeStyles((theme: any) => ({
    listBox: {
      maxHeight: '300px',
      overflowY: 'auto',
      border: '1px solid #DFDFDF',
      borderRadius: '9px',
      padding: '8px',
      position: 'absolute',
      background: '#fff',
      zIndex: 10,
      width: '100%',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    },
    item: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '6px 12px',
      borderBottom: '1px solid #EFEFEF',
      '&:last-child': {
        borderBottom: 'none',
      },
    },
}));

const MassField = ({
    label,
    onChange,
    value,
    onMassSearchChange
}: any) => {
  const [snList, setSnList] = useState<any[]>([]);
  const [currentSN, setCurrentSN] = useState(value);
  const [isExpanded, setIsExpanded] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);
  const classes = useStyles();

//   useEffect(() => {
//     onMassSearchChange(snList);
//   }, [snList, onMassSearchChange]);

  const handleAddSN = () => {
    if (currentSN.trim() && !snList.includes(currentSN.trim())) {
      setSnList([...snList, currentSN.trim()]);
      setCurrentSN('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleAddSN();
    }
  };

  const handleRemoveSN = (sn: string) => {
    setSnList(snList.filter((item) => item !== sn));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const [massSnInput, setMassSnInput] = useState<any>(value);
  const handleMassSearch = () => {
    const serialNumbers = massSnInput
      .split("\n")
      .map((sn: any) => sn.trim())
      .filter((sn: any) => sn)
      .map((sn: any) => ({ label: sn, value: sn }));

    onMassSearchChange({target: {value: serialNumbers}});
    setMassSnInput(""); // Очистка текстового поля
    setDialogFlag(false); // Закрытие окна
  };

  const [dialogFlag, setDialogFlag] = useState(false)

  const handleOpenModal = () => {
    setDialogFlag(true)
    // onChange({target: {value: ''}})
  }

  console.log("value", value)

  const closeIconButton = () => {
    setMassSnInput("")
    onChange({target: {value: ''}})
  }

  return (
    <Box ref={componentRef} position="relative">
        <Field
            // label="SN"
            type="text"
            placeholder={label}
            onKeyPress={handleKeyPress}
            autoComplete='off'
            value={value && Array.isArray(value) ? `Выбрано ${value.length}` : value}
            onFocus={() => setIsExpanded(true)}
            onChange={onChange}
            closeIcon={<IconClose width={20} height={20} />}
            closeIconButton={closeIconButton}
        />
        {dialogFlag && <DialogField 
            title="Массовый поиск"
            closeBtn
            onClose={() => setDialogFlag(false)}
        >
            <div className={styles.modalContent}>
                <textarea
                    className={styles.textArea}
                    placeholder={label}
                      value={Array.isArray(massSnInput) ? massSnInput.map((item: any) => item.value).join("\n") : massSnInput}
                      onChange={(e) => setMassSnInput(e.target.value)}
                />
                <div className={styles.modalActions}>
                    <Button 
                        title="Поиск"
                        className={styles.btn}
                        onClick={handleMassSearch}
                    />
                </div>
          </div>
        </DialogField>}
    
      {isExpanded && (
        <Box 
            className={classes.listBox}
            sx={{
                cursor: "pointer"
            }}
            onClick={handleOpenModal}
        >
            <Box 
                textAlign="center" 
                color="gray"
            >
              Массовый поиск
            </Box>
        </Box>
      )}
    </Box>
  );
};

export default MassField;
