import React, { useState, useEffect } from 'react';
import { Button, Alert, Paper, TextField, Grid, Stack, Chip, Typography, FormHelperText } from "@mui/material"
import { useFormik } from "formik"
import { useLocation, useNavigate } from "react-router-dom"
import { styled } from '@mui/material/styles';
import { Add } from "@mui/icons-material"
import axios from "axios"
import FormData from "form-data"
import * as yup from "yup"


const validationSchema = yup.object().shape({
    name:yup.string().required("This field is required"),
    age:yup.number().typeError('You must specify a number').min(1, 'Min value 1 year old.').max(99, "Max value 99 years old.").required("This field is required"),
    biography:yup.string().required("This field is required"),
})

const Input = styled('input')({
    display: 'none',
});


const AddCharacter = () => {
    
    const token = localStorage.getItem("token")

    let { state } = useLocation()

    //Flags for input validation
    const [imgFieldError, setImgFieldError] = useState(false) 
    const [movieFieldError, setMovieFieldError] = useState(false)

    const [movie,setMovie] = useState("") //single movie from "movies" 
    const [movies,setMovies] = useState([])

    const [imgURL,setImgURL] = useState("")
    const [imgName,setImgName] = useState("")

    let redirect = useNavigate()

    const formik = useFormik({
        initialValues:{
            name:"",
            age:"",
            biography:"",
            movies:[]
        },
        onSubmit:(values)=>{
            if(!movies.length){
                setMovieFieldError(true)
            }else if(imgURL == ""){ 
                setImgFieldError(true)
            }else if( (movieFieldError && imgFieldError) == false ){
                try {
                    axios.post(`https://getmoviesapp.herokuapp.com/characters`,{
                        name:values.name,
                        age:values.age,
                        biography:values.biography,
                        movies, 
                        image:imgURL   
                    },{
                        headers:{
                            Authorization:`Bearer ${ token }`
                        }
                    }).then(redirect("/home"))
                } catch (error) {
                    console.log(error)
                }
            }
        },validationSchema: validationSchema
    })

    const handleUpload = async (e) => {
        const image = e.target.files[0]
        let data = new FormData();
        data.append('image', image);
        try {
            await axios.post("https://getmoviesapp.herokuapp.com/images/upload",data,{
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

    const handleDelete = (movie) =>{

        const result = movies.filter((element)=>{
            return element !== movie
        })

        setMovies(result)
    }

    useEffect(()=>{
        if(!token) redirect("/login")
        if(state){ //set data if is recived by useNavigation "state"
            formik.initialValues.name = state.character
            setMovies([...movies,state.movie])
        }
    },[])
    return ( 
        <div className='center' style={{backgroundColor:"rgba(29,29,40,255)",minHeight: "calc(100vh)"}}>
            <Paper style={{maxWidth:"30rem", padding:"3rem",backgroundColor:"rgba(29,29,40,255)"}} variant="outlined">
                <form encType="multipart/form-data" onSubmit={formik.handleSubmit}>
                    <Grid container  className='center' spacing={2}>
                        <Grid item sx={{display:"flex",justifyContent:"center",alignItems:"center"}} xs={12}>
                            <Typography variant='h3'>Add a character</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                fullWidth  
                                label="Name" 
                                name="name"
                                disabled
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                fullWidth 
                                type="number"
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
                                            if(!movie==""){
                                                setMovies([...movies,movie])
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
                                 {
                                        movieFieldError ? <FormHelperText error={movieFieldError}>This field is required.</FormHelperText> : null
                                }
                            </Grid>
                        </Grid>
                        <Stack alignItems="center" justifyContent="center" sx={{flexWrap:"wrap"}} direction="row">
                            {
                                movies ? movies.map((movie,i)=>(
                                    <Chip color='secondary' key={i} sx={{color:"white", my:3,mr:1}} label={movie} onDelete={()=>handleDelete(movie)} />
                                )) : null
                            }
                        </Stack>
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
                                variant="contained"
                            >
                                    Send
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
            </div>
     );
}
 
export default AddCharacter;