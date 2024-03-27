import express from 'express'
import { getUserBudgets, provideBudget } from '../controllers/budget.controller.js'
const budgetRouter=express.Router()

budgetRouter.get('/all',(req,res)=>getUserBudgets(req,res))
budgetRouter.post('/provide',(req,res)=>provideBudget(req,res))

export default budgetRouter