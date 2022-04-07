import React from 'react';
import { Paper } from "@mui/material"

const Item = ({title,image}) => {
    return ( 
        <div>
            <Paper elevation={8} sx={{
                m:2,
                display:"flex",
                alignItems:"end",
                justifyContent:"center",
                backgroundImage:`url(${image})`,
                backgroundPosition: "center center",
                backgroundSize:"cover",
                width:"10rem",
                height:"15rem"}}>
                <p style={{color:"white"}}>{title}</p>
            </Paper>
        </div>
     );
}
 
export default Item;