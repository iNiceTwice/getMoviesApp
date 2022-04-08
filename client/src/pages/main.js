import React from 'react';
import { Button, Grid, Typography } from "@mui/material"
import { PlayArrow } from "@mui/icons-material"
import { Link } from 'react-router-dom';

const Main = () => {
    return ( 
        <div className='center' style={{height:"100vh"}}> 
           
            
            <video style={{overflow:"hidden", margin:0,backgroundColor:"black",position:"fixed",minHeight:"calc(100vh)",minWidth:"100%",zIndex:0}} src="img/webassets/main-background.mp4" loop muted autoPlay></video>
    
            <Grid sx={{maxWidth:"40rem", backgroundColor:"rgba(0,0,0,0.2)", borderRadius:"10px" ,py:"5rem", p:{md:"5rem"},zIndex:20}} className='center' container spacing={2}>
                <Grid item xs={12} sx={{display:"flex",justifyContent:"center"}}>
                      <Typography
                        className="bold"
                        variant="h3"
                        noWrap
                        component="div"
                        sx={{ color:"white" ,alignItems:"center", display:"flex"}}
                    >
                        getMovies!
                        <PlayArrow fontSize="large"/>
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="span" sx={{fontSize:"1.2rem",color:"white"}}>create, update and get your favorite movies!</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Link to="/register">
                        <Button fullWidth variant="outlined" color="primary">Register</Button>
                    </Link>
                </Grid>
                <Grid item xs={12}>
                    <Link to="/login">
                        <Button fullWidth variant="outlined" >Login</Button>
                    </Link>
                </Grid>
            </Grid>
        </div>
     );
}
 
export default Main;