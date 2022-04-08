import React, { useState } from 'react';
import { Button, Paper, TextField, Grid, Alert, Typography } from "@mui/material"
import { useFormik } from "formik"
import { useNavigate, Link } from "react-router-dom"
import { axiosInstance } from "../config/config"
import * as yup from "yup"

const validationSchema = yup.object().shape({
    email:yup.string().email("Please enter a valid email").required("This field is required"),
    password:yup.string().required("This field is required").min(8,"Contain at least 8 characters").max(16,"Contain at least 16 characters")
})

const Login = () => {

    let redirect = useNavigate()
    const [badCredentials,setBadCredentials] = useState(false)

    const formik = useFormik({
        initialValues:{
            email:"",
            password:""
        },
        onSubmit:(values)=>{
            try {
                axiosInstance.post(`/auth/login`,{
                    email:values.email,
                    password:values.password    
                }).then( data => {
            
                    if(data.data.status == 401){
                        setBadCredentials(true)
                    }else{
                        localStorage.setItem("token",data.data)
                        redirect("/home")
                    }
                    //store token in localstorage
                    console.log(data.data.status)
                })
            } catch (error) {
                console.log(error)
            }
        },validationSchema: validationSchema
    })
    return ( 
        <div className='center' style={{backgroundColor:"rgba(29,29,40,255)",height:"100vh"}}>
            <Paper style={{backgroundColor:"rgba(29,29,40,255)",padding:"5rem"}} variant="outlined">
                <form onSubmit={formik.handleSubmit}>
                    <Grid className='center' style={{width:"30rem"}} container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h2">Login</Typography>
                        </Grid>
                        {
                            badCredentials ? <Grid item xs={12}><Alert fullWidth severity='error'>Incorrect credentials.</Alert></Grid> : null
                        }
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
                            <TextField fullWidth  
                                type="password"
                                label="Password" 
                                name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button 
                                type="submit" 
                                fullWidth 
                                variant="contained">
                                    Send
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <span>You haven't an account yet? </span>
                            <span><Link to="/register" style={{color:"lightblue"}} >Sign up here!</Link></span>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
            </div>
     );
}
 
export default Login;