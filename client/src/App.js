import React from 'react';
import { Routes, Route, BrowserRouter } from "react-router-dom"
import Main from "./components/Main"
import Login from './components/Login';
import Register from "./components/Register"
import Home from "./components/Home"
import AddMovie from "./components/AddMovie"
import AddCharacter from "./components/AddCharacter"
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
 typography: {
    fontFamily: 'Nunito',
    color:"white"
  },
  palette: {
    mode: 'dark',
    primary:{
      main: "#469B9B"
    },
    secondary:{
      main:"#AA6373"
    },
    error:{
      main:"#9b1d20"
    }
  },
});

const App = () => {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Main/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/home" element={<Home/>}/>
            <Route path="/addMovie" element={<AddMovie/>}/>
            <Route path="/addCharacter" element={<AddCharacter/>}/>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
