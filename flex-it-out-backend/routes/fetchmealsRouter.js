const express = require("express")
const authMiddleware = require('../Middleware/authMiddleware')
const { getMeals } = require('../controllers/fetchMealsController')

const router = express.Router()

router.get("/", authMiddleware, getMeals)

module.exports = router