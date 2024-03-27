import express from 'express'
import { createCategory, getCategories, updateCategory } from '../controllers/category.controller.js'
const categoryRouter=express.Router()

categoryRouter.get("/all",(req,res)=>getCategories(req,res))
categoryRouter.post("/add",(req,res)=>createCategory(req,res))
categoryRouter.patch("/update",(req,res)=>updateCategory(req,res))

export default categoryRouter