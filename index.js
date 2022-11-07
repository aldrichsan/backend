import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import db from "./config/Database.js";
import router from "./routes/index.js";
dotenv.config();
const app = express();
 
app.use(cors({ credentials:true, origin:'http://localhost:5173' }));
app.use(cookieParser());
app.use(express.json({limit: '70mb'}));
app.use(bodyParser.json({ limit: '70mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '70mb' }));
app.use(router);
 
app.listen(5000, ()=> console.log('Server running at port 5000'));