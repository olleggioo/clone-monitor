import { FC } from "react";
import { 
  // Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle 
} from "@mui/material";
import styles from "./Alert.module.scss"
import { Button } from "@/ui";

const Alert: FC<{title: string, content: string, open: boolean, setOpen: any, handleDeleteClick?: any}> = ({title, content, open, setOpen, handleDeleteClick}) => {
    
    const handleClose = () => {
      setOpen(false);
    };

    return (
        <>
          <Dialog
            maxWidth="sm"
            fullWidth
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title" className={styles.title}>
              {title}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description" className={styles.text}>
                {content}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button 
              title="Отменить"
              className={styles.errorBtn}
              onClick={handleClose}
            />
            <Button 
              title="Потвердить"
              className={styles.successBtn}
              onClick={() => {
                handleDeleteClick()
                handleClose()
              }}
            />
            {/* <Button variant="contained" color="error" className={styles.cancel} onClick={handleClose}>Отменить</Button>
            <Button variant="contained" color="success" className={styles.save} onClick={handleDeleteClick} autoFocus>
                Потвердить
            </Button> */}
            </DialogActions>
          </Dialog>
        </>
      );
}

export default Alert