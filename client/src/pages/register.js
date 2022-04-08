import React , { useState } from 'react';
import { Button, Paper, TextField, Grid, Typography, InputLabel, OutlinedInput, InputAdornment, IconButton } from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { useFormik } from "formik"
import { useNavigate, Link } from "react-router-dom"
import { axiosInstance } from "../config/config"
import * as yup from "yup"

const validationSchema = yup.object().shape({
    email:yup.string().email("Ingresa un e-mail válido").required("This field is required"),
    password:yup.string().required("Este campo es obligatorio").min(8,"Contain at least 8 characters").max(16,"Contain at least 16 characters")
})

const Register = () => {
    
    let redirect = useNavigate()

    const [showPassword, setShowPassword] = useState(false)

    const formik = useFormik({
        initialValues:{
            email:"",
            password:""
        },
        onSubmit:(values)=>{
            try {
                axiosInstance.post(`/auth/register`,{
                    email:values.email,
                    password:values.password    
                }).then( data => {
                    //store token in localstorage
                    localStorage.setItem("token",data.data)
                    redirect("/home")
                })
            } catch (error) {
                console.log(error)
            }
        },validationSchema: validationSchema
    })

     const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return ( 
        <div className='center' style={{backgroundColor:"rgba(29,29,40,255)",height:"100vh"}}>
            <Paper style={{backgroundColor:"rgba(29,29,40,255)",padding:"5rem"}} variant="outlined">
                <form onSubmit={formik.handleSubmit}>
                    <Grid className='center' style={{width:"30rem"}} container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h2">Register</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth  
                                label="Email" 
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            />
                        </Grid>
                        <Grid item xs={12}>
                           <TextField
                                fullWidth
                                label="Password"
                                id="outlined-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">   <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                    >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton></InputAdornment>,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button 
                                type="submit" 
                                fullWidth 
                                variant="contained" color="primary">
                                    Send
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <span>You already have an account? </span>
                            <span><Link to="/login" style={{color:"lightblue"}} >Sign in here!</Link></span>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
            </div>
     );
}
 
export default Register;