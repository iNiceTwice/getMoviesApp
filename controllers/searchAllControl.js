const MOVIES_DB = require("../models/movies.js")
const CHARACTERS_DB = require("../models/characters")

exports.getBySearch = async (req,res,next) => {
    const { q } = req.query
    const movies = await MOVIES_DB.find({  
        $or:[
            {characters: { $regex: `${q}`, $options: 'i' } },
            {genres: { $regex: `${q}`, $options: 'i' } },
            {title: { $regex: `${q}`, $options: 'i' } }
        ]
        
    })
    const characters = await CHARACTERS_DB.find({  
        $or:[
            {name: { $regex: `${q}`, $options: 'i' } },
            {movies: { $regex: `${q}`, $options: 'i' } }
        ]
    })
    let all = movies.concat(characters)
    res.send(all)
} 