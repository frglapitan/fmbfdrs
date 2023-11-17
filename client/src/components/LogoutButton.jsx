import { useNavigate } from "react-router-dom";
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LogoutIcon from '@mui/icons-material/Logout';

const LogoutButton = () => {

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const res = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (res.ok) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('role');
                navigate('/login')
        
            } else {
                console.log('Failed to logout')
            }
            
        } catch (error) {
            console.log('Error: ', error)
        }
    }

    return (
        <ListItemButton
              sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5, }} onClick={handleLogout}>
              
              <ListItemIcon
                sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center', }} >

                <LogoutIcon />
                
              </ListItemIcon>
              
              <ListItemText primary="Logout" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
    )
}

export default LogoutButton;