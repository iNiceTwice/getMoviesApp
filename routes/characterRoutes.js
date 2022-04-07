const express = require("express")
const router = express.Router()
const auth = require("../middlewares/auth")
const { createCharacter, getCharacters, getOneCharacter, updateCharacter, deleteCharacter } = require("../controllers/charactersControl")
const { deleteImage } = require("../controllers/imageControl")
const { check, param } = require("express-validator")
const { isArray } = require("util")

router.delete("/characters/:id", auth, deleteImage, deleteCharacter)

router.get("/characters", auth, getCharacters)

router.get("/characters/:name", auth, getOneCharacter)

router.post("/characters", auth, [
    check("name", "Name is required").notEmpty(),
    check("biography", "Biography is required").notEmpty(),
    check("movies", "Movies is required ").isArray().notEmpty(),
    check("age", "Age is required").notEmpty(),
    check("image", "Image url is required").notEmpty()
],createCharacter)

router.put("/characters/:name", auth, [
    check("name", "Name is required").notEmpty(),
    check("biography", "Biography is required").notEmpty(),
    check("movies", "Movies is required ").isArray().notEmpty(),
    check("age", "Age is required").notEmpty(),
    check("image", "Image url is required").notEmpty()
], updateCharacter)


module.exports = router