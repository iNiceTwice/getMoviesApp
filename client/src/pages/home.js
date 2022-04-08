import React,{ useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Character from "../components/Character"
import { Grid, Button, Tabs, Tab, Typography } from "@mui/material"
import Item from "../components/Item"
import Movie from "../components/Movie"
import Nav from "../components/Nav"
import { axiosInstance } from '../config/config';

const Home = () => {

    const token = localStorage.getItem("token")

    const redirect = useNavigate()
    
    const [selectedTab,setSelectedTab] = useState(0)
    const [render, setRender] = useState("")
    const [data, setData] = useState([])
    const [characters,setCharacters] = useState([])
    const [movies,setMovies] = useState([])
    const [character,setCharacter] = useState({
        id:"",
        name:"",
        age:"",
        biography:"",
        movies:[],
        image:""
    })
    const [movie,setMovie] = useState({
        id:"",
        title:"",
        synopsis:"",
        date_of:0,
        rating:0,
        genres:[],
        characters:[],
        image:""
    })

    const getOneCharacter = (character) => {

        let selectedCharacter = characters.filter(char=> char.name == character)
      
        if(selectedCharacter.length){
            setCharacter({
                id:selectedCharacter[0]._id,
                name:selectedCharacter[0].name,
                age:selectedCharacter[0].age,
                biography:selectedCharacter[0].biography,
                movies:selectedCharacter[0].movies,
                image:selectedCharacter[0].image
            })
            setRender("character")
        }else{
            let info = {
                character:character,
                movie: movie.title
            }
            redirect("/addCharacter",{state:info})
        }
    }

    const getOneMovie = (movie) => {

        let selectedMovie = movies.filter(film=> film.title == movie)
        
        if(selectedMovie.length){
            setMovie({
                id:selectedMovie[0].id,
                genres:selectedMovie[0].genres,
                title:selectedMovie[0].title,
                synopsis:selectedMovie[0].synopsis,
                date_of:selectedMovie[0].date_of,
                rating:selectedMovie[0].rating,
                characters:selectedMovie[0].characters,
                image:selectedMovie[0].image
            })
            setRender("movie")
        }else{
            let info = {
                movie:movie,
                character:character.name
            }
            redirect("/addMovie",{state:info})
        }
    }

    const handleData = (dataFromSearch) => {
        setData(dataFromSearch)
        document.querySelector("#all").click()
    }

    useEffect(()=>{
        if(!token) redirect("/login")

        const getMovies = () => {
       
            try {
                axiosInstance.get("/movies",{
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                }).then(movies=>{
                    setMovies(movies.data)
                })
            } catch (error) {
                console.log(error)
                redirect("/login")
            }

        }
        const getCharacters = () => {
          
            try {
                axiosInstance.get("/characters",{
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                }).then(char=>{
                    setCharacters(char.data)
                })
            } catch (error) {
                console.log(error)
                redirect("/login")
            }
        }
        
        getMovies(token)
        getCharacters(token)
        
    },[])

    return ( 
        <div style={{height:"100%"}}>
            <Nav data={handleData}/>
            <Grid container justifyContent="center"sx={{minHeight:"calc(100vh)",backgroundColor:"rgba(29,29,40,255)"}}>
                <Grid xs={0} md={4} item >
                    {[
                        (render == "movie") ?       <Movie 
                                                        key="1"
                                                        id={movie.id} 
                                                        year={movie.date_of} 
                                                        synopsis={movie.synopsis} 
                                                        characters={movie.characters} 
                                                        rating={movie.rating}
                                                        genres={movie.genres} 
                                                        image={movie.image} 
                                                        title={movie.title}
                                                        selectedCharacter={getOneCharacter}
                                                    /> : null ,
                        (render == "character") ?   <Character 
                                                        key="2"
                                                        id={character.id}
                                                        name={character.name}
                                                        biography={character.biography}
                                                        image={character.image}
                                                        age={character.age}
                                                        movies={character.movies}
                                                        selectedMovie={getOneMovie}
                                                    /> : null                      
                    ]}
                </Grid>
                <Grid sx={{
                        paddingTop:"6rem",
                        backgroundColor:"rgba(29,29,40,255)",
                        borderRadius:{md:"40px 0px 0px 0px",xs:"20px 20px 0px 0px"}
                        }} 
                      item xs={12} 
                      md={8}
                >
                    <Tabs id="tabs"  sx={{mt:3}} centered value={selectedTab} onChange={(e,value)=>setSelectedTab(value)}>
                        <Tab label="Movies"/>
                        <Tab label="Characters"/>
                        <Tab id="all" label="All"/>
                    </Tabs>
                    {
                        selectedTab === 0 && movies.map((film)=>{
                            return(
                                <Button id={film._id} key={film._id} onClick={()=>{
                                    setMovie({
                                        id:film._id,
                                        title:film.title,
                                        synopsis:film.synopsis,
                                        date_of:film.date_of,
                                        rating:film.rating,
                                        genres:film.genres,
                                        characters:film.characters,
                                        image:film.image
                                    })
                                    setRender("movie")
                                    window.scrollTo(0, 0)             
                                }}>
                                    <Item image={film.image} title={film.title}/>        
                                </Button>
                            ) 
                        })
                    }
                    {
                        selectedTab === 1 && characters.map((character)=>{
                            return(
                                <Button id={character._id} key={character._id} onClick={()=>{
                                    setCharacter({
                                        id:character._id,
                                        name:character.name,
                                        age:character.age,
                                        biography:character.biography,
                                        movies:character.movies,
                                        image:character.image
                                    })
                                    setRender("character")
                                    window.scrollTo(0, 0)             
                                }}>
                                    <Item image={character.image} title={character.name}/>        
                                </Button>
                            ) 
                        })
                    }
                    {
                        selectedTab === 2 && data.map((item,i)=>{
                            if(item.name){
                                return(
                                      <Button id={item._id} key={item._id} onClick={()=>{
                                        setCharacter({
                                            id:item._id,
                                            name:item.name,
                                            age:item.age,
                                            biography:item.biography,
                                            movies:item.movies,
                                            image:item.image
                                        })
                                        setRender("character")
                                        window.scrollTo(0, 0)             
                                    }}>
                                        <Item image={item.image} title={item.name}/>        
                                    </Button>
                                )
                            }else{
                                return(
                                    <Button id={item._id} key={item._id} onClick={()=>{
                                        setMovie({
                                            id:item._id,
                                            title:item.title,
                                            synopsis:item.synopsis,
                                            date_of:item.date_of,
                                            rating:item.rating,
                                            genres:item.genres,
                                            characters:item.characters,
                                            image:item.image
                                        })
                                        setRender("movie") 
                                        window.scrollTo(0, 0)            
                                    }}>
                                        <Item image={item.image} title={item.title}/>        
                                    </Button>
                                ) 
                            }
                        })
                    }
                </Grid>
            </Grid>

        </div>
     );
}
 
export default Home;