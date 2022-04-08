import React from 'react';
import { Routes, Route, BrowserRouter } from "react-router-dom"
import Main from "./pages/main"
import Login from './pages/login';
import Register from "./pages/register"
import Home from "./pages/home"
import AddMovie from "./pages/addMovie"
import AddCharacter from "./pages/addCharacter"
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
