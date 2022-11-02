import express from "express";
import { getPendingStudents, getStudents, StudentRegister, ApproveStudentRegister, StudentLogin, UpdateStudent, DeleteStudent, StudentLogout, RejectPendingStudent, getStudentDetails, EditStudentDetails, StudentChangePassword } from "../controllers/Students.js";
import { StudentVerifyToken } from "../middleware/StudentVerifyToken.js";
import { StudentRefreshToken } from "../controllers/StudentRefreshToken.js";

import { getPendingDeans, getDeans, DeanRegister, ApproveDeanRegister, DeanLogin, UpdateDean, DeleteDean, DeanLogout, RejectPendingDean, getDeanDetails, EditDeanDetails, DeanChangePassword } from "../controllers/Deans.js";
import { DeanVerifyToken } from "../middleware/DeanVerifyToken.js";
import { DeanRefreshToken } from "../controllers/DeanRefreshToken.js";

import { AddAnnouncements, DeleteAnnouncement, GetAnnouncements, UpdateAnnouncement, AddScholarships, DeleteScholarship, GetScholarships, UpdateScholarship, AdminRegister, AdminLogin, AdminLogout, GetScholarship } from "../controllers/Admins.js";
import { AdminRefreshToken } from "../controllers/AdminRefreshToken.js";


 
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json())


// Student
router.post('/register/student', StudentRegister);
router.post('/student', StudentLogin);
router.get('/student/token', StudentRefreshToken);
router.get('/scholarships/get/:id', GetScholarship);
router.get('/student/details/:id', StudentVerifyToken, getStudentDetails);
router.patch('/update/student/details/:id', EditStudentDetails);
router.patch('/change/student/password/:id', StudentChangePassword);
router.delete('/student/logout', StudentLogout);


// Dean
router.post('/register/dean', DeanRegister);
router.post('/dean', DeanLogin);
router.get('/dean/details/:id', getDeanDetails);
router.patch('/update/dean/details/:id', EditDeanDetails);
router.patch('/change/dean/password/:id', DeanChangePassword);
router.get('/dean/token', DeanRefreshToken);
router.delete('/dean/logout', DeanLogout);


// Admin
router.post('/register/admin', AdminRegister);
router.post('/admin', AdminLogin);
router.get('/admin/token', AdminRefreshToken);
router.delete('/admin/logout', AdminLogout);
//CRUD FOR STUDENTS AND DEANS
router.get('/students/get', getStudents);
router.get('/pendingstudents/get', getPendingStudents);
router.post('/approve/registration/student', ApproveStudentRegister);
router.delete('/reject/registration/student/:id', RejectPendingStudent);
router.patch('/update/student/:id', UpdateStudent);
router.delete('/delete/student/:id', DeleteStudent);

router.get('/deans/get', getDeans);
router.get('/pendingdeans/get', getPendingDeans);
router.post('/approve/registration/dean', ApproveDeanRegister);
router.delete('/reject/registration/dean/:id', RejectPendingDean);
router.patch('/update/dean/:id', UpdateDean);
router.delete('/delete/dean/:id', DeleteDean);
// CRUD Announcements
router.post('/announcements/add', AddAnnouncements);
router.get('/announcements/get', GetAnnouncements);
router.patch('/announcements/update/:id', UpdateAnnouncement);
router.delete('/announcements/delete/:id', DeleteAnnouncement);
// CRUD Scholarship Info
router.post('/scholarships/add', AddScholarships);
router.get('/scholarships/get', GetScholarships);
router.patch('/scholarships/update/:id', UpdateScholarship);
router.delete('/scholarships/delete/:id', DeleteScholarship);

 

export default router;