import express from "express";
import { getStudents, StudentRegister, StudentLogin, StudentLogout } from "../controllers/Students.js";
import { StudentVerifyToken } from "../middleware/StudentVerifyToken.js";
import { StudentRefreshToken } from "../controllers/StudentRefreshToken.js";

import { getDeans, DeanRegister, DeanLogin, DeanLogout } from "../controllers/Deans.js";
import { DeanVerifyToken } from "../middleware/DeanVerifyToken.js";
import { DeanRefreshToken } from "../controllers/DeanRefreshToken.js";
 
const router = express.Router();

// Student
router.post('/register/student', StudentRegister);
router.post('/student', StudentLogin);
router.get('/student/token', StudentRefreshToken);
router.get('/student/home', getStudents);
router.delete('/student/logout', StudentLogout);

// Dean
router.post('/register/dean', DeanRegister);
router.post('/dean', DeanLogin);
router.get('/dean/token', DeanRefreshToken);
router.get('/dean/home', DeanVerifyToken, getDeans);
router.delete('/dean/logout', DeanLogout);
 


export default router;