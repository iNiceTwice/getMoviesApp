import React, { useState,useEffect } from 'react';
import { Button, Paper, Stack, Chip, TextField, Grid, Alert, FormHelperText, Typography } from "@mui/material"
import { useFormik } from "formik"
import { useNavigate, useLocation } from "react-router-dom"
import { styled } from '@mui/material/styles';
import { Add } from "@mui/icons-material"
import GenreSelect from "./GenreSelect"
import FormData from "form-data"
import axios from "axios"
import * as yup from "yup"

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

const AddMovie = () => {

    const token = localStorage.getItem("token")

    const [actorFieldError, setActorFieldError] = useState(false)
    const [imgFieldError, setImgFieldError] = useState(false)
    const [genreFieldError, setGenreFieldError] = useState(false)
    const [cast,setCast] = useState([]) //actors array
    const [actor,setActor] = useState("") //single actor for "cast"
    const [imgURL,setImgURL] = useState("")
    const [imgName,setImgName] = useState("")
    const [genres,setGenres] = useState([])

    let redirect = useNavigate()
    let { state } = useLocation()
    
    const formik = useFormik({
        initialValues:{
            title:"",
            synopsis:"",
            year:"",
            rating:"",
            characters:[],
            genres:[]
        },
        onSubmit:(values)=>{ 

            if(!genres.length){
                setGenreFieldError(true)
            }else if(!cast.length){
                setActorFieldError(true)
            }
            else if(imgURL == ""){
                setImgFieldError(true)
            }else if((genreFieldError  && actorFieldError && imgFieldError) == false){

                try {
                    axios.post(`http://localhost:3001/movies`,{
                        title:values.title,
                        synopsis:values.synopsis,
                        rating:values.rating,
                        characters:cast,
                        genres,
                        date_of:values.year, 
                        image:imgURL   
                    },{
                        headers:{
                            Authorization:`Bearer ${token}`
                        }
                    }).then(data=>{
                        redirect("/home")
                    })
                } catch (error) {
                    console.log(error)
                }
            }
        },validationSchema: validationSchema
    })
    const handleUpload = async (e) => { //upload selected image
        const image = e.target.files[0]
        let data = new FormData();
        data.append('image', image);
        try {
            await axios.post("http://localhost:3001/images/upload",data,{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }).then(data=>{
                setImgURL(`img/${data.data.filename}`)  
                setImgName(data.data.originalname) 
                setImgFieldError(false)  
            })    
        } catch (error) {
            console.log(error)
        }    
    }
    const handleSelect = (values) =>{
        setGenres(values)
    }

     const handleDelete = (character) =>{ // delete selected character from cast array

        const result = cast.filter((element)=>{
            return element !== character
        })

        setCast(result)
        formik.initialValues.characters = cast
    }
    
    useEffect(()=>{
        if(!token) redirect("/login") 
        if(state){ //set data if is recived by useNavigation "state"
            formik.initialValues.title = state.movie
            setCast([...cast,state.character])
        }
    },[])
    
    return ( 
        <div className='center' style={{backgroundColor:"rgba(29,29,40,255)",minHeight: "calc(100vh)"}}>
            <Paper sx={{ p:{xs:"3rem",md:"5rem",backgroundColor:"rgba(29,29,40,255)"}}} variant="outlined">
                <form encType="multipart/form-data" onSubmit={formik.handleSubmit}>
                    <Grid className='center' style={{maxWidth:"30rem"}} container spacing={2}>
                           <Grid item sx={{display:"flex",justifyContent:"center",alignItems:"center"}} xs={12}>
                            <Typography variant='h3'>Add a movie</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth  
                                label="Title" 
                                name="title"
                                disabled={(state ? true: false)}
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.title && Boolean(formik.errors.title)}
                                helperText={formik.touched.title && formik.errors.title}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={1}>
                                <Grid item xs={12} md={6}>
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
                                <Grid item xs={12} md={6}>
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
                            </Grid>
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
                            <GenreSelect isError={genreFieldError} selectedValues={handleSelect}/>
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
                                    {
                                        actorFieldError ? <FormHelperText error={actorFieldError}>This field is required.</FormHelperText> : null
                                    }
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
                                            }else if(actor == "" && !cast.length){
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
                        </Grid>
                        <Grid item xs={12}>
                            <Stack alignItems="center" justifyContent="center" sx={{flexWrap:"wrap"}} direction="row">
                                {
                                    cast ? cast.map((char,i)=>(
                                        <Chip color='secondary' key={i} sx={{color:"white", my:1,mr:1}} label={char} onDelete={()=>handleDelete(char)} />
                                    )) : null
                                }
        
                            </Stack>
                        </Grid>
                        {
                            imgFieldError ? 
                            <Grid item xs={12}>
                                <Alert severity="error">Please select an image</Alert>
                            </Grid> : null

                        }
                        <Grid item xs={12}>
                            <label htmlFor="contained-button-file">
                                <Input onChange={handleUpload} name="image" accept="image/*" id="contained-button-file" multiple type="file" />
                                    {
                                        (imgName == "") ? <span style={{margin:"1rem"}}><em>Select an Image</em></span> :
                                        <span style={{marginRight:"1rem"}}><em>{imgName}</em></span>
                                    }
                                <Button size='large' variant="contained" component="span">
                                Upload
                                </Button>
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
            </Paper>
            </div>
     );
}
 
export default AddMovie;