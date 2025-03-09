import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'
import authRoutes from "./routes/authRoutes.js"
dotenv.config();
connectDB();

const app= express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use("/api/v1/auth",authRoutes);


const PORT= process.env.PORT || 4000;
app.listen(PORT,()=> console.log(` Server running on port ${PORT}`))