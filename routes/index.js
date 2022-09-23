import express from "express";
import { getStudents, StudentRegister, StudentLogin, StudentLogout } from "../controllers/Students.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { StudentRefreshToken } from "../controllers/StudentRefreshToken.js";
 
const router = express.Router();
 


router.get('/student/home', verifyToken, getStudents);
router.post('/register/student', StudentRegister);
router.post('/student', StudentLogin);
router.get('/token', StudentRefreshToken);
router.delete('/student/logout', StudentLogout);
 


export default router;