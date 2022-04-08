import React, { useState }from 'react';
import { Box, Grid, Button, Typography, IconButton } from "@mui/material"
import { Edit, Delete } from '@mui/icons-material';
import EditCharacter from "./EditCharacter"
import { axiosInstance } from '../config/config';


const Character = ({ id, name, age, biography, image, movies, selectedMovie }) => {

    const token = localStorage.getItem("token")

    const [isEdit, setIsEdit] = useState(false)

    const handleEdit = () => { //render edit character component
        setIsEdit(true)
    }

    const handleDelete = () =>{
        try { 
            axiosInstance.delete(`/characters/${ id }`,{
                headers:{
                    Authorization: `Bearer ${ token }`
                }    
            }).then(window.location.reload(true))    // reload data
        } catch (error) {
            console.log(error)
        }
    }

    return ( 
        <div>
            {
                isEdit ? <EditCharacter 
                            openEdit={setIsEdit} 
                            name={name} 
                            age={age} 
                            biography={biography} 
                            image={image} 
                            movies={movies}   
                        /> : 
            
                <Box>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Box sx={{
                                    paddingTop:"15rem",
                                    display:"flex",
                                    alignItems:"flex-end", 
                                    backgroundSize:"cover", 
                                    backgroundPosition:"center",
                                    backgroundRepeat:"no-repeat",
                                    backgroundImage:`linear-gradient(to bottom, rgba(0,0,0,0), rgba(29,29,40,255)),url(${image})` ,
                                    height:{xs:"25rem",md:"40rem"},
                                    width:"100%"
                            }}>
                                <div style={{
                                        display:"flex",
                                        flexGrow:2, 
                                        alignSelf:"flex-end", 
                                        marginLeft:"2rem", 
                                        marginBottom:"3rem", 
                                        alignItems:"center"
                                }}>
                                    <Typography sx={{mr:2, fontSize:"1.5rem"}} variant='h4'>{ name } </Typography>
                                    <span>({age})</span>
                                </div>
                                <div style={{
                                        display:"flex",
                                        flexDirection:"column", 
                                        alignSelf:"flex-end",
                                        marginTop:"5rem",
                                        marginRight:"1rem", 
                                        marginBottom:"25rem", 
                                        alignItems:"center"
                                }}>
                                    <IconButton onClick={handleDelete}>
                                        <Delete fontSize="large" sx={{color:"white",opacity:0.7}} />
                                    </IconButton>
                                    <IconButton onClick={handleEdit} sx={{ mt:2}}>
                                        <Edit fontSize="large" sx={{color:"white",opacity:0.7}} />
                                    </IconButton>
                                </div>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sx={{mx:2}}>
                            <div>
                                <Typography variant="h5"sx={{textAlign:"justify"}}>Biography:</Typography>
                                <p style={{textAlign:"justify", opacity:"0.5"}}>{biography}</p>
                            </div>
                        </Grid>
                        <Grid item xs={12} sx={{mx:2,pb:5}}>
                            <Typography sx={{textAlign:"justify"}} variant="h6">Movies:</Typography>
                            <div>
                                {

                                    movies.map((movie,i)=>(
                                        <Button onClick={()=>{
                                            selectedMovie(movie)
                                            window.scrollTo(0, 0)
                                        }} key={i} sx={{color:"white"}}>{movie}</Button>
                                    ))

                                }
                            </div>
                        </Grid>
                    </Grid>
                </Box>
            }
        </div>
     );
}
 
export default Character;