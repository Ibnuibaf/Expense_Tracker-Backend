import express from 'express'
import { getAllUsers, getUser, userLogin, userRegister } from '../controllers/user.controller.js'
import { isLoggedIn, isNotLoggedIn } from '../middlewares/auth.middleware.js'

const userRouter=express.Router()

userRouter.get('/',(req,res,next)=>isLoggedIn(req,res,next),(req,res)=>getUser(req,res))
userRouter.get('/all',(req,res,next)=>isLoggedIn(req,res,next),(req,res)=>getAllUsers(req,res))
userRouter.post('/register',(req,res,next)=>isNotLoggedIn(req,res,next),(req,res)=>userRegister(req,res))
userRouter.post('/login',(req,res,next)=>isNotLoggedIn(req,res,next),(req,res)=>userLogin(req,res))

export default userRouter