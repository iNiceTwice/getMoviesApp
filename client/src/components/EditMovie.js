import React, { useState } from 'react';
import { Stack, Chip, Button, TextField, Grid, FormHelperText, Typography } from "@mui/material";
import { Add, ArrowBackIosNew } from "@mui/icons-material";
import { styled } from '@mui/material/styles';
import { useFormik } from "formik";
import GenreSelect from "./GenreSelect";
import FormData from "form-data";
import * as yup from "yup";
import axios from "axios";

const today = new Date()
const year = today.getFullYear()

const validationSchema = yup.object().shape({
    title:yup.string().required("This field is required"),
    synopsis:yup.string().required("This field is required"),
    year:yup.number().typeError('You must specify a number').min(1800, 'Min value 1800.').max(year, `Max value ${year}.`).required("This field is required"),
    rating:yup.number().typeError('You must specify a number').min(0, 'Min value 0.').max(5, 'Max value 5.').required("This field is required"),
})

const Input = styled('input')({
  display: 'none',
});

const EditMovie = ({ openEdit, id, title, image, year, rating, characters, genres, synopsis }) => {

    const token = localStorage.getItem("token")

    //flags for input validation
    const [actorFieldError, setActorFieldError] = useState(false)
    const [genreFieldError, setGenreFieldError] = useState(false)
    
    const [movieGenres,setMovieGenres] = useState([])
    const [cast,setCast] = useState(characters)  //actors array
    const [actor,setActor] = useState("") //single actor for "cast"
    const [imgURL,setImgURL] = useState(image)
    const [imgName,setImgName] = useState("")
    
    const formik = useFormik({
        initialValues:{
            title,
            synopsis,
            year,
            rating,
            characters:cast
        },
        onSubmit:(values)=>{

            if(!movieGenres.length ){
                setGenreFieldError(true)
            }else if(!cast.length){
                setActorFieldError(true)
            }else if( (genreFieldError && actorFieldError) == false ){
                try {
                    axios.put(`http://localhost:3001/movies/${ id }`,{
                        title:values.title,
                        synopsis:values.synopsis,
                        rating:values.rating,
                        characters:cast,
                        genres:movieGenres,
                        date_of:values.year, 
                        image:imgURL   
                    },{
                        headers:{
                            Authorization:`Bearer ${ token }`
                        }
                    }).then(data=>{
                        window.location.reload(true) //reload data
                    }) 
                } catch (error) {
                    console.log(error)
                }
            }
        },validationSchema: validationSchema
    })

    const handleUpload = (e) => { // upload image

        const newImage = e.target.files[0]
        let data = new FormData();
        data.append('oldImageUrl', imgURL); // this will delete the old image on update
        data.append('image', newImage);

        try {
            axios.post("http://localhost:3001/images/upload",data,{
                    headers:{
                        Authorization:`Bearer ${token}`
                    }}).then(data=>{
                        setImgURL(`img/${data.data.filename}`)  
                        setImgName(data.data.originalname)   
                    })    
        } catch (error) {
            console.log(error)
        }    
    }
    
    const handleClose = () =>{
        openEdit(false)
    }

    const handleDelete = (character) =>{

        const result = cast.filter((element)=>{
            return element != character
        })

        setCast(result)
        formik.initialValues.characters = cast
    }

    const handleSelect = (values) =>{
        setMovieGenres(values)
    }

    return ( 
        <div style={{minHeight: "calc(100vh)",display:"flex", justifyContent:"center",marginTop:"5rem"}}>
                <form encType="multipart/form-data" onSubmit={formik.handleSubmit}>
                    <Grid sx={{marginTop:"1rem",backgroundColor:"rgba(29,29,40,255)", maxWidth:"35rem", p:2}} container spacing={2}>
                        <Grid item xs={12} sx={{display:"flex", alginItems:"start"}}>
                            <Button sx={{px:3, py:2}} color="inherit" startIcon={< ArrowBackIosNew/>} onClick={handleClose}>back</Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant='h3'>Edit a movie</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth  
                                label="Title" 
                                name="title"
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.title && Boolean(formik.errors.title)}
                                helperText={formik.touched.title && formik.errors.title}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                type="number"
                                fullWidth 
                                label="Year" 
                                name="year"
                                value={formik.values.year}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.year && Boolean(formik.errors.year)}
                                helperText={formik.touched.year && formik.errors.year}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                fullWidth  
                                type="number"
                                label="Rating" 
                                name="rating"
                                value={formik.values.rating}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.rating && Boolean(formik.errors.rating)}
                                helperText={formik.touched.rating && formik.errors.rating}
                            />
                        </Grid>
                            <Grid item xs={12}>
                                <TextField 
                                    fullWidth
                                    multiline 
                                    minRows={4}
                                    type="text"
                                    label="Synopsis" 
                                    name="synopsis"
                                    value={formik.values.synopsis}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.synopsis && Boolean(formik.errors.synopsis)}
                                    helperText={formik.touched.synopsis && formik.errors.synopsis}
                                />
                            </Grid>
                        <Grid item xs={12}>
                            <GenreSelect isError={genreFieldError} toEditGenres={genres} selectedValues={handleSelect}/>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={10}>
                                    <TextField
                                        fullWidth
                                        id="actorInput"  
                                        label="Actors" 
                                        error={actorFieldError}
                                        onChange={e=>{
                                            setActor(e.target.value) 
                                            setActorFieldError(false) 
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <Button 
                                        sx={{py:"16.5px"}} 
                                        component="span" 
                                        variant="contained" 
                                        onClick={()=>{
                                            if(!actor == ""){
                                                setCast([...cast,actor])
                                                setActor("")
                                            }else{
                                                setActorFieldError(true)
                                            }
                                            let actorField = document.querySelector("#actorInput")
                                            actorField.value=""
                                        }} 
                                        >
                                    <Add/>
                                    </Button>
                                </Grid>
                            </Grid> 
                            {
                                actorFieldError ? <FormHelperText error={actorFieldError}>This field is required.</FormHelperText> : null
                            }
                        </Grid>
                        <Grid item xs={12}>
                            <Stack alignItems="center" justifyContent="center" sx={{flexWrap:"wrap"}} direction="row">
                                {
                                    cast.map((char,i)=>(
                                        <Chip color='secondary' key={i} sx={{color:"white", my:1,mr:1}} label={char} onDelete={()=>handleDelete(char)} />
                                    ))
                                }
        
                            </Stack>
                        </Grid>
                        <Grid item xs={12}>
                            <label htmlFor="contained-button-file">
                                <Grid container alignItems="center" justifyContent="center">
                                    <Grid item xs={6}>
                                        <Input onChange={handleUpload} name="image" accept="image/*" id="contained-button-file" multiple type="file" />
                                        <p>
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
                                variant="contained" color="primary">
                                    Send
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </div>
     );
}
 
export default EditMovie;