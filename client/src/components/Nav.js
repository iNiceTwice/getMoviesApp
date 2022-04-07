import React , { useState } from 'react';
import { Grid, Box, Toolbar, IconButton, Typography, Menu, Button, MenuItem, } from '@mui/material';
import MenuIcon from "@mui/icons-material/Menu"
import { Add,PlayArrow,Logout } from "@mui/icons-material"
import { useNavigate, Link } from 'react-router-dom';
import SearchBar from "./SearchBar"

const ResponsiveAppBar = ({data}) => {

  const redirect = useNavigate()

  const [anchorElNav, setAnchorElNav] = useState(null);


  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const logout = () =>{
    localStorage.setItem("token","")
    redirect("/")
  }

  const handleData = (dataFromSearch) => {
    data(dataFromSearch)
  } 

  return (
    <div style={{zIndex:100, width:"100%", paddingTop:"2rem", paddingBottom:"2rem", boxShadow:"none", position:"fixed" }} >
      <Toolbar disableGutters>
        <Grid container direction="row">
          <Grid item xs={0} md={4} sx={{display:"flex",justifyContent:"center"}}>
            <Typography
              className="bold"
              variant="h4"
              noWrap
              component="div"
              sx={{opacity:0.7, alignItems:"center" ,mr: 2, display: { xs: 'none', md: 'flex' } }}
            >
              getMovies!
              <PlayArrow fontSize="large"/>
            </Typography>
          </Grid>
          <Grid item xs={12} md={8} sx={{pr:{ xs: 1, md:5 }, pl:{ xs:1 }, display:"flex",flexDirection:"row", justifyContent:"end"}}>
            <SearchBar data={handleData}/>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                <MenuItem onClick={handleCloseNavMenu}>
                  
                  <Link to="/addMovie">
                    <Button
                      startIcon={<Add/>}
                      onClick={handleCloseNavMenu}
                      sx={{ mx: 2, color: 'white', display: 'flex' }}
                    >
                      Movie
                    </Button>
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleCloseNavMenu}>
                    <Button
                      startIcon={<Logout/>}
                      onClick={logout}
                      sx={{ color:"white", mx: 2, display: 'flex' }}
                    >
                      Logout
                    </Button>
                </MenuItem>
              </Menu>
            </Box>
            <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>
                <Link to="/addMovie">
                  <Button
                    startIcon={<Add/>}
                    onClick={handleCloseNavMenu}
                    sx={{p:2, mx: 2, color: 'white', display: 'flex' }}
                  >
                    Movie
                  </Button>
                </Link>
              <Button
                startIcon={<Logout/>}
                onClick={logout}
                variant="contained"
                color="inherit"
                sx={{ mx: 2, color: 'black', display: 'block' ,display:"flex"}}
              >
                Logout
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Toolbar>
    </div>
  );
};
export default ResponsiveAppBar;
