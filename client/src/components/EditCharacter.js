import React, { useState, useEffect } from 'react';
import { Stack, Chip, Button, TextField, Grid, FormHelperText, Typography } from "@mui/material"
import { Add, ArrowBackIosNew } from "@mui/icons-material"
import { styled } from '@mui/material/styles';
import { useFormik } from "formik"
import FormData from "form-data"
import * as yup from "yup" 
import axios from "axios"

const validationSchema = yup.object().shape({
    name:yup.string().required("This field is required"),
    age:yup.number().typeError('You must specify a number').min(1, 'Min value 1 year old.').max(99, "Max value 99 years old.").required("This field is required"),
    biography:yup.string().required("This field is required"),
})


const Input = styled('input')({
  display: 'none',
});

const EditCharacter = ({ openEdit, name, image, age, movies, biography }) => {

    const [movieFieldError, setMovieFieldError] = useState(false)
    const [movie,setMovie] = useState("") //single movie from films array
    const [films,setFilms] = useState(movies) // films are the updated array with movies.param by default 
    const [imgName,setImgName] = useState("")   // show the img name when the file is selected
    const [imgURL,setImgURL] = useState(image)
    const [token,setToken] = useState("")

    const formik = useFormik({
        initialValues:{
            name,
            age,
            biography,
            movies:films
        },
        onSubmit:(values)=>{
            if(!films.length){
                setMovieFieldError(true)
            }else if( movieFieldError == false ){
                try {
                    axios.put(`http://localhost:3001/characters/${name}`,{
                        name:values.name,
                        age:values.age,
                        biography:values.biography,
                        movies:films, 
                        image:imgURL   
                    },{
                        headers:{
                            Authorization:`Bearer ${token}`
                        }
                    }).then(window.location.reload(true)) //reload data
                } catch (error) {
                    console.log(error)
                }
            }
        },validationSchema: validationSchema
    })
    const handleUpload = (e) => { //upload image

        const newImage = e.target.files[0]
        let data = new FormData();
        data.append('oldImageUrl', imgURL); // this will delete the old image on update
        data.append('image', newImage);
        
        try {
            axios.post("http://localhost:3001/images/upload",data,{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }).then(data=>{
                setImgURL(`img/${data.data.filename}`)  
                setImgName(data.data.originalname)   
            })    
        } catch (error) {
            console.log(error)
        }    
    }

    const handleClose = () =>{
        openEdit(false) //close EditCharacter component 
    }

    const handleDelete = (movie) =>{

        const result = films.filter((element)=>{
            return element != movie
        })

        setFilms(result)
        formik.initialValues.movies = films // set the new movies array 
    }

    useEffect(()=>{
        setToken(localStorage.getItem("token"))
    },[])

    return ( 
        <div style={{minHeight: "calc(100vh)",display:"flex",justifyContent:"center",marginTop:"5rem"}}>
                <form encType="multipart/form-data" onSubmit={formik.handleSubmit}>
                    <Grid sx={{marginTop:"1rem",backgroundColor:"rgba(29,29,40,255)", maxWidth:"35rem",p:2}} container spacing={2}>
                        <Grid item xs={12} sx={{display:"flex", alginItems:"start"}}>
                            <Button sx={{px:3, py:2}} color="inherit" startIcon={< ArrowBackIosNew/>} onClick={handleClose}>back</Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography sx={{my:3}} variant='h3'>Edit a character</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth  
                                label="Name" 
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                type="number"
                                fullWidth 
                                label="Age" 
                                name="age"
                                value={formik.values.age}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.age && Boolean(formik.errors.age)}
                                helperText={formik.touched.age && formik.errors.age}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                fullWidth
                                multiline 
                                minRows={4}
                                type="text"
                                label="Biography" 
                                name="biography"
                                value={formik.values.biography}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.biography && Boolean(formik.errors.biography)}
                                helperText={formik.touched.biography && formik.errors.biography}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={10}>
                                    <TextField
                                        fullWidth
                                        id="movieInput"  
                                        label="Movies" 
                                        error={movieFieldError}
                                        onChange={e=>{
                                            setMovie(e.target.value) 
                                            setMovieFieldError(false) 
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <Button 
                                        sx={{py:"16.5px"}} 
                                        component="span" 
                                        variant="contained" 
                                        onClick={()=>{
                                            if(!movie == ""){
                                                setFilms([...films,movie])
                                                setMovie("")
                                            }else{
                                                setMovieFieldError(true)
                                            }
                                            let movieField = document.querySelector("#movieInput")
                                            movieField.value=""
                                        }} 
                                        >
                                    <Add/>
                                    </Button>
                                </Grid>
                            </Grid> 
                            {
                                movieFieldError ? <FormHelperText error={movieFieldError}>This field is required.</FormHelperText> : null
                            }
                        </Grid>
                        <Grid item xs={12}>
                            <Stack alignItems="center" justifyContent="center" sx={{flexWrap:"wrap"}} direction="row">
                                {
                                    films.map((film,i)=>(
                                        <Chip color='error' key={i} sx={{color:"white", my:1,mr:1}} label={film} onDelete={()=>handleDelete(film)} />
                                    ))
                                }
        
                            </Stack>
                        </Grid>
                        <Grid item xs={12}>
                            <label htmlFor="contained-button-file">
                                <Grid container alignItems="center" justifyContent="center">
                                    <Grid item xs={6}>
                                        <Input onChange={handleUpload} name="image" accept="image/*" id="contained-button-file" multiple type="file" />
                                        <p style={{textAlign:"center"}}>
                                            {
                                                (imgName == "") ? <span style={{margin:"1rem"}}><em>{image}</em></span> :
                                                <span style={{marginRight:"1rem"}}><em>{imgName}</em></span>
                                            }
                                        </p>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Button size='large' variant="contained" component="span">
                                            Upload
                                        </Button>
                                    </Grid>
                                </Grid>
                            </label>
                        </Grid>
                        <Grid item xs={12}>
                            <Button 
                                type="submit" 
                                fullWidth 
                                variant="contained">
                                    Send
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </div>
     );
}
 
export default EditCharacter;