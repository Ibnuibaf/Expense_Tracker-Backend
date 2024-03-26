import express from 'express'
import { getUser, userLogin, userRegister, userSetBudget } from '../controllers/user.controller.js'

const userRouter=express.Router()

userRouter.get('/',(req,res)=>getUser(req,res))
userRouter.post('/register',(req,res)=>userRegister(req,res))
userRouter.post('/login',(req,res)=>userLogin(req,res))

export default userRouter