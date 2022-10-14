import express from "express";
import { getStudents, StudentRegister, StudentLogin, StudentLogout } from "../controllers/Students.js";
import { StudentVerifyToken } from "../middleware/StudentVerifyToken.js";
import { StudentRefreshToken } from "../controllers/StudentRefreshToken.js";
 
const router = express.Router();
 


router.post('/register/student', StudentRegister);
router.post('/student', StudentLogin);
router.get('/student/token', StudentRefreshToken);
router.get('/student/home', StudentVerifyToken, getStudents);
router.delete('/student/logout', StudentLogout);
 


export default router;