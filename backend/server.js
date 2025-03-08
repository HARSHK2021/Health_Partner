import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'

dotenv.config();
connectDB();

const app= express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.send("✅ Server is working!");
  });
const PORT= process.env.PORT || 4000;
app.listen(PORT,()=> console.log(` Server running on port ${PORT}`))