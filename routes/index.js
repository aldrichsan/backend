import express from "express";
import { getPendingStudents, getStudents, StudentRegister, StudentLogin, UpdateStudent, DeleteStudent, StudentLogout } from "../controllers/Students.js";
import { StudentVerifyToken } from "../middleware/StudentVerifyToken.js";
import { StudentRefreshToken } from "../controllers/StudentRefreshToken.js";

import { getPendingDeans, getDeans, DeanRegister, DeanLogin, UpdateDean, DeleteDean, DeanLogout } from "../controllers/Deans.js";
import { DeanVerifyToken } from "../middleware/DeanVerifyToken.js";
import { DeanRefreshToken } from "../controllers/DeanRefreshToken.js";


 
const router = express.Router();

// Student
router.post('/register/student', StudentRegister);
router.post('/student', StudentLogin);
router.get('/student/token', StudentRefreshToken);
router.delete('/student/logout', StudentLogout);

// Dean
router.post('/register/dean', DeanRegister);
router.post('/dean', DeanLogin);
router.get('/dean/token', DeanRefreshToken);
router.delete('/dean/logout', DeanLogout);

// Admin
router.get('/students/get', getStudents);
router.get('/pendingstudents/get', getPendingStudents);
router.patch('/update/student/:id', UpdateStudent);
router.delete('/delete/student/:id', DeleteStudent);

router.get('/deans/get', getDeans);
router.get('/pendingdeans/get', getPendingDeans);
router.patch('/update/dean/:id', UpdateDean);
router.delete('/delete/dean/:id', DeleteDean);


 



export default router;