import express from 'express'
import { createCategory, getCategories } from '../controllers/category.controller.js'
const categoryRouter=express.Router()

categoryRouter.get("/all",(req,res)=>getCategories(req,res))
categoryRouter.post("/add",(req,res)=>createCategory(req,res))

export default categoryRouter