import express from 'express'
import { createExpense, getExpensesByCategory, getUserExpenses, recurringPayment } from '../controllers/expense.controller.js'
const expenseRouter=express.Router()

expenseRouter.get('/all',(req,res)=>getUserExpenses(req,res))
expenseRouter.post('/add',(req,res)=>createExpense(req,res))
expenseRouter.patch('/update-payment',(req,res)=>recurringPayment(req,res))
expenseRouter.get('/category-analyse',(req,res)=>getExpensesByCategory(req,res))

export default expenseRouter