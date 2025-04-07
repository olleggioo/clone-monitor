import { Dialog } from "@/components"
import { Box, Modal } from "@mui/material"
import { FC } from "react"

interface ModalInfoOptions {
    open: boolean
    onClose: any
    status: string
    action: string
    textInAction: string
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

const ModalInfo: FC<ModalInfoOptions> = ({open, status, onClose, action, textInAction}) => {
    return <Dialog 
        // open={open}
        title={action}
        onClose={onClose}
        closeBtn
    >
        <Box sx={{marginTop: 2}}>
            <p>{status}</p>
            <p>{textInAction}</p>
        </Box>
    </Dialog>
    
}

export default ModalInfo