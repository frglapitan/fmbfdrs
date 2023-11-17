
import { Dialog, DialogContent, DialogActions, DialogContentText, DialogTitle, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function ExpiredTokenAlert() {
    const navigate = useNavigate();

    const handleOk = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('role');
        navigate('/login');
    };

    return (
        <Dialog
            open={true}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Session Expired"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Your session has expired. You will be redirected to the login page.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleOk} color="primary" autoFocus>
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    );
}
