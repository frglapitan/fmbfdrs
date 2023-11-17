import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../LogoutButton';

const drawerWidth = 260;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);


export default function Sidebar() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();
  let role = localStorage.getItem('role');

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Forest Fire Danger Rating System - Admin Panel
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />

        <List>
          
          <ListItem  disablePadding sx={{ display: 'block' }} onClick={()=>{navigate("/administration")}}>
            <ListItemButton
              sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5, }} >              
              <ListItemIcon
                sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center', }} >
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
      
          { role == 'sysadmin' &&
          <ListItem  disablePadding sx={{ display: 'block' }} onClick={()=>{navigate("/administration/mgmt_baseregion/uploadcsv")}}>
          <ListItemButton
            sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5, }} >              
            <ListItemIcon
              sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center', }} >
              <UploadFileIcon />
            </ListItemIcon>
            <ListItemText primary="Upload Region Data" sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
        }

          <ListItem  disablePadding sx={{ display: 'block' }} onClick={()=>{navigate("/administration/mgmt_fireindex/uploadcsv")}}>
            <ListItemButton
              sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5, }} >              
              <ListItemIcon
                sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center', }} >
                <FileUploadIcon />
              </ListItemIcon>
              <ListItemText primary="Upload Fire Index Data" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>

        { role !== 'user' &&
          <>
          <Divider />
          <ListItem  disablePadding sx={{ display: 'block' }} onClick={()=>{navigate("/administration/users")}}>
            <ListItemButton
              sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5, }} >
              <ListItemIcon
                sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center', }} >
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="View Users" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>

          <ListItem  disablePadding sx={{ display: 'block' }} onClick={()=>{navigate("/administration/users/add")}}>
            <ListItemButton
              sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5, }} >
              <ListItemIcon
                sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center', }} >
                <PersonAddIcon />
              </ListItemIcon>
              <ListItemText primary="Add User" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
          </>
        }
  
        </List>

        <Divider />

        <List>

          <ListItem  disablePadding sx={{ display: 'block' }} onClick={()=>{navigate("/administration/myprofile")}}>
            <ListItemButton
              sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5, }} >              
              <ListItemIcon
                sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center', }} >
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="My Profile" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>

          <ListItem  disablePadding sx={{ display: 'block' }} >
            <LogoutButton />            
          </ListItem>
        </List>
        
      </Drawer>
      
    </Box>
  );
}