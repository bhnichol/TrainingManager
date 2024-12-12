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
import { Link } from 'react-router';
import { Avatar, Menu, ThemeProvider, createTheme } from '@mui/material';
import HouseOutlinedIcon from '@mui/icons-material/HouseOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
const navItems = [{text:'Home', path:'/', icon: <HouseOutlinedIcon/>},
   {text:'Training Plan', path:'plan', icon: <MenuBookOutlinedIcon/>}, 
   {text:'Contingency', path:'contingency', icon: <AttachMoneyOutlinedIcon/>}, 
   {text:'About', path:'about', icon: <InfoOutlinedIcon/>}, 
   {text:'Contact',path:'contact', icon: <MailOutlinedIcon/>}];
const accountItems = [{text:'Profile', path:'profile'}, {text:'My Account', path:'account'}, {text:'Logout',path:'/'}];
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
    document.body.style = 'background-image: #FFFFFF;'
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
      };
    const handleAccountToggle = (e) => {
      setAccountOpen(!accountOpen);
      setMenuPos(e.currentTarget);
    };
    
      const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ my: 2 }}>
            Train
          </Typography>
          <Divider />
          <List>
            {navItems.map((item) => (
              <ListItem key={item} disablePadding>
                <ListItemButton component={Link} to={item.path}>
                  {item.icon}
                  <ListItemText primary={item.text} sx={{paddingLeft:'5%'}}/>
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
            <ListItem key={item} disablePadding>
              <ListItemButton component={Link} to ={item.path}>
                <ListItemText primary={item.text}/>
              </ListItemButton>
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
            <MenuIcon/>
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' },paddingLeft:'2%' }}
          >
            Train
          </Typography>
          <IconButton
          color="inherit"
          aria-label="account-menu"
          edge="start"
          onClick={handleAccountToggle}
          textAlign="right">
            <Avatar/>
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
        variant='temporary'
        id="menu"
        open={accountOpen}
        onClose={handleAccountToggle}
        anchorEl={menuPos}
        anchorOrigin={{vertical:"bottom"}}>
          {menu}
        </Menu>
    </Box>
    </ThemeProvider>
  );
}

export default TopBar;