import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoute.js";
import authRoutes from "./routes/authRoute.js";
import fireIndexEntryRoute from "./routes/fireIndexEntryRoute.js";
import baseRegionRoute from "./routes/baseRegionRoute.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


const PORT = process.env.PORT || 5555;

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/fire_index', fireIndexEntryRoute);
app.use('/api/region', baseRegionRoute);


mongoose
    .connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{
        
        app.listen(PORT, () => {
            console.log(`FDRS Server is connected to the DB and listening on port: ${PORT}`)
        });
    })
    .catch((error) => {
        console.log(error)
    });