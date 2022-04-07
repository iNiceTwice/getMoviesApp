import React ,{ useState,useEffect }from 'react';
import { InputBase } from "@mui/material"
import { useNavigate, Link } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from "@mui/icons-material/Search"
import axios from "axios"

const SearchBar = ({data}) => {

    const [query,setQuery] = useState("")
    const redirect = useNavigate()

    const Search = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        display:"flex",
        marginLeft: 10,
        width: '100%',
        [theme.breakpoints.up('md')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
        },
    }));

    const SearchIconWrapper = styled('div')(({ theme }) => ({
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }));

    const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: 'inherit',
        '& .MuiInputBase-input': {
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        
            width: '100%',
        
        },
    }));

    useEffect(()=>{
        const token = localStorage.getItem("token")
        const fetchData = async (token) => {
        if(token){
            try {
            await axios.get(`http://localhost:3001/search/?q=${query}`,{
                headers:{
                Authorization: `Bearer ${token}`
                }
            }).then(res=>{
                data(res.data)
            })
            } catch (error) {
            console.log(error)
            }
        }else{
            redirect("/login")
        }
        }
        if(query.length > 2) fetchData(token)
    },[query])

    return ( 
       <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
                autoFocus
                value={query}
                onChange={e=>{ setQuery(e.target.value) }} 
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
            />
        </Search>
     );
}
 
export default SearchBar;