import express from 'express'
import { createCollab, getUsersCollabs } from '../controllers/collaborator.controller.js'
const collaboratorRouter=express.Router()

collaboratorRouter.get('/all',(req,res)=>getUsersCollabs(req,res))
collaboratorRouter.post('/add',(req,res)=>createCollab(req,res))

export default collaboratorRouter