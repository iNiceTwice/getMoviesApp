const express = require("express")
const router = express.Router()
const auth = require("../middlewares/auth")
const { getBySearch } = require("../controllers/searchAllControl")


router.get("/search/",auth, getBySearch)

module.exports = router