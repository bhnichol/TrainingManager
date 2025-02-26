import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link, useNavigate } from 'react-router';
import { Avatar, Menu, ThemeProvider, createTheme } from '@mui/material';
import HouseOutlinedIcon from '@mui/icons-material/HouseOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import PeopleAlt from '@mui/icons-material/PeopleAlt';
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';
import useLogout from '../hooks/useLogout';
const navItems = [{ text: 'Home', path: '/', icon: <HouseOutlinedIcon /> },
{ text: 'Training Plan', path: 'plan', icon: <MenuBookOutlinedIcon /> },
// { text: 'Contingency', path: 'contingency', icon: <AttachMoneyOutlinedIcon /> },
{ text: 'Courses', path: 'course', icon: <BookOutlinedIcon /> },
{ text: 'Employees', path: 'employee', icon: <PeopleAlt /> },
{ text: 'Organizations', path: 'org', icon: <AccountTreeOutlinedIcon /> },
{ text: 'Admin', path: 'users', icon: <AdminPanelSettingsOutlinedIcon /> },
{ text: 'About/Contact', path: 'about', icon: <InfoOutlinedIcon /> }
];
const accountItems = [{ text: 'Profile', path: 'profile' }, { text: 'My Account', path: 'account' }, { text: 'Logout', path: 'login' }];
const theme = createTheme({
  palette: {
    primary: {
      main: "#FA7070",
      contrastText: "#FFFFFF",
    },
  },
});


function TopBar() {

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [accountOpen, setAccountOpen] = React.useState(false);
  const [menuPos, setMenuPos] = React.useState(null);
  const logout = useLogout();
  const navigate = useNavigate();
  const signOut = async () => {
    await logout();
    navigate('/login')

  };
  document.body.style = 'background-image: #FFFFFF;'
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleAccountToggle = (e) => {
    setAccountOpen(!accountOpen);
    setMenuPos(e.currentTarget);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textalign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 , textAlign: 'center'}}>
        Train
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={Link} to={item.path}>
              {item.icon}
              <ListItemText primary={item.text} sx={{ paddingLeft: '5%' }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const menu = (
    <Box>
      <List>
        {accountItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            {item.text === 'Logout' ?
              <ListItemButton onClick={signOut}>
                <ListItemText primary={item.text} />
              </ListItemButton> :
              <ListItemButton component={Link} to={item.path}>
              <ListItemText primary={item.text} />
            </ListItemButton>
            }

          </ListItem>
        ))}
      </List>
    </Box>
  );


  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="sticky" >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="menu"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' }, paddingLeft: '2%'}}
            >
              Train
            </Typography>
            <IconButton
              color="inherit"
              aria-label="account-menu"
              edge="start"
              onClick={handleAccountToggle}
              textalign="right">
              <Avatar />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          PaperProps={{
            sx: { width: "15%" },
          }}
        >
          {drawer}
        </Drawer>
        <Menu
          variant='menu'
          id="menu"
          open={accountOpen}
          onClose={handleAccountToggle}
          anchorEl={menuPos}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
          {menu}
        </Menu>
      </Box>
    </ThemeProvider>
  );
}

export default TopBar;