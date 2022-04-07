import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, Chip, Stack, Typography, IconButton } from "@mui/material"
import { Star, Edit, Delete, StarBorderOutlined } from "@mui/icons-material"
import EditMovie from "./EditMovie"
import axios from "axios"

const Movie = ({ id, title, year, rating, image, characters, genres, synopsis ,selectedCharacter }) => {
    const stars = []
    const greyStars = []
    const [isEditMovie,setIsEditMovie] = useState(false)
    const [token,setToken] = useState("")

    for(let i=1;i<=rating;i++){
        stars.push([<Star key={i} sx={{color:"#E4D34E"}}/>])
    }
    for(let i=1;i<=5-rating;i++){
        greyStars.push(<Star key={i} sx={{color:"gray"}}/>)
    }    

    const handleDelete = async () =>{
        try {
            axios.delete(`https://getmoviesapp.herokuapp.com/movies/${ id }`,{
                headers:{
                    Authorization: `Bearer ${ token }`
                }    
            }).then(window.location.reload(true))    
        } catch (error) {
            console.log(error)
        }
    }

    const handleEdit = () => {
        setIsEditMovie(true)
    }
    useEffect(()=>{
        setToken(localStorage.getItem("token"))
    },[])

    return ( 
        <div style={{color:"white"}}>
            {   
                isEditMovie ?   <EditMovie
                                    openEdit={setIsEditMovie}  
                                    id={id} 
                                    year={year} 
                                    synopsis={synopsis} 
                                    characters={characters}
                                    genres={genres} 
                                    rating={rating} 
                                    image={image} 
                                    title={title}
                                />
                :

                <Box>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <div style={{
                                    paddingTop:"7rem",
                                    display:"flex",
                                    alignItems:"flex-end", 
                                    backgroundSize:"cover", 
                                    backgroundPosition:"center",
                                    backgroundRepeat:"no-repeat",
                                    backgroundImage:`linear-gradient(to bottom, rgba(0,0,0,0), rgba(29,29,40,255)),url(${image})` ,height:"40rem",
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
                                    <Typography sx={{mr:2}} variant='h4'>{ title } </Typography>
                                    <span>({year})</span>
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
                            </div>
                            <Stack justifyContent="start" sx={{mt:-5,ml:4, flexWrap:"wrap"}} direction="row">
                                {

                                    genres.map((genre,i)=>(
                                        <Chip variant='outlined' key={i} sx={{color:"white", my:1,mr:1}} label={genre} />
                                    ))

                                }
                            </Stack>                   
                        </Grid>
                        <Grid item xs={12}>
                            <hr style={{opacity:"0.1", width:"90%"}}/>
                            <div style={{display:"flex", justifyContent:"space-around", margin:"2rem"}}>
                                <div>
                                    <Typography
                                        className="bold"
                                        variant="h4"
                                        noWrap
                                        component="div"
                                    >
                                        gM!
                                    </Typography>
                                    <Typography>
                                        score
                                    </Typography>
                                </div>
                                <div>
                                    <Star sx={{color:"#E4D34E"}} fontSize="large"/>
                                    <Typography>{rating}/5</Typography>
                                </div>
                                <div>
                                    <StarBorderOutlined fontSize='large'/>
                                    <Typography>Rate this</Typography>
                                </div>
                            </div>
                            <hr style={{opacity:"0.1", width:"90%"}}/>
                        </Grid>
                        <Grid item xs={12} sx={{mx:2}}>
                            <div>
                                <Typography variant="h5"sx={{textAlign:"justify"}}>Synopsis:</Typography>
                                <p style={{textAlign:"justify", opacity:"0.5"}}>{synopsis}</p>
                            </div>
                        </Grid>
                        <Grid item xs={12} sx={{mx:2,pb:5}}>
                            <Typography sx={{textAlign:"justify"}} variant="h6">Cast:</Typography>
                            <div>
                                {

                                    characters.map((char,i)=>(
                                        <Button onClick={()=>{selectedCharacter(char)}} key={i} sx={{color:"white"}}>{char}</Button>
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
 
export default Movie;