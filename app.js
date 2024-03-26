import express from "express";
import connectDB from "./configs/postgresql.js";
import cors from 'cors'
import userRouter from "./routes/user.route.js";
import categoryRouter from "./routes/category.route.js";
import expenseRouter from "./routes/expense.route.js";
import budgetRouter from "./routes/budget.route.js";
import collaboratorRouter from "./routes/collaborator.route.js";

const app=express()
const PORT=3333
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())

app.use('/api/user/',userRouter)
app.use('/api/category/',categoryRouter)
app.use('/api/expense/',expenseRouter)
app.use('/api/budget/',budgetRouter)
app.use('/api/collaborator/',collaboratorRouter)

app.listen(PORT,()=>{
    console.log(`Server Running Successfully on ${PORT}`);
    connectDB()
})