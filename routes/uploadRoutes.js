const express = require("express")
const router = express.Router()
const auth = require("../middlewares/auth")
const { uploadImage, upload } = require("../controllers/ImageControl")

router.post("/images/upload", auth, upload.single("image"),uploadImage)

module.exports = router