import express from "express";
import { getPendingStudents, getStudents, StudentRegister, ApproveStudentRegister, StudentLogin, UpdateStudent, DeleteStudent, StudentLogout, RejectPendingStudent, getStudentDetails, EditStudentDetails, StudentChangePassword, CreateScholarshipApplication, IsScholarshipRejected, IsScholarshipApproved, IsScholarshipUnderReview, IsScholarshipSubmitted } from "../controllers/Students.js";
import { StudentVerifyToken } from "../middleware/StudentVerifyToken.js";
import { StudentRefreshToken } from "../controllers/StudentRefreshToken.js";

import { getPendingDeans, getDeans, DeanRegister, ApproveDeanRegister, DeanLogin, UpdateDean, DeleteDean, DeanLogout, RejectPendingDean, getDeanDetails, EditDeanDetails, DeanChangePassword, GetSubmittedApplications, GetFilteredSubmittedApplications, GetSpecificApplication, CreateReviewApplication, DeleteSubmittedApplication, CreateRejectedApplication } from "../controllers/Deans.js";
import { DeanVerifyToken } from "../middleware/DeanVerifyToken.js";
import { DeanRefreshToken } from "../controllers/DeanRefreshToken.js";

import { AddAnnouncements, DeleteAnnouncement, GetAnnouncements, UpdateAnnouncement, AddScholarships, DeleteScholarship, GetScholarships, UpdateScholarship, AdminRegister, AdminLogin, AdminLogout, GetScholarship, GetReviewedApplications, GetDepartmentFilteredReviewedApplications, GetCourseFilteredReviewedApplications, GetSpecificReviewedApplication, DeleteReviewedApplication, CreateApprovedApplication, GetApprovedApplications, GetDepartmentFilteredApprovedApplications, GetCourseFilteredApprovedApplications, GetSpecificApprovedApplication, DeleteApprovedApplication, AdminCreateRejectedApplication, GetRejectedApplications, GetDepartmentFilteredRejectedApplications, GetCourseFilteredRejectedApplications, DeleteRejectedApplication, GetSpecificRejectedApplication } from "../controllers/Admins.js";
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
router.post('/submit/student/application', CreateScholarshipApplication);
router.patch('/change/student/password', StudentChangePassword);
router.delete('/student/logout', StudentLogout);
// Check Application Status
router.get('/student/application/rejected/:id', IsScholarshipRejected);
router.get('/student/application/approved/:id', IsScholarshipApproved);
router.get('/student/application/review/:id', IsScholarshipUnderReview);
router.get('/student/application/submitted/:id', IsScholarshipSubmitted);


// Dean
router.post('/register/dean', DeanRegister);
router.post('/dean', DeanLogin);
router.get('/dean/details/:id', getDeanDetails);
router.patch('/update/dean/details/:id', EditDeanDetails);
router.patch('/change/dean/password/:id', DeanChangePassword);
router.get('/dean/view/applications/:id', GetSubmittedApplications);
router.get('/dean/view/applications/course/:id', GetFilteredSubmittedApplications);
router.get('/dean/applications/review/:id', GetSpecificApplication);
router.post('/create/review/application', CreateReviewApplication);
router.post('/create/rejected/application', CreateRejectedApplication);
router.delete('/delete/submitted/application/:id', DeleteSubmittedApplication);
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

//Accepting, Rejecting, Viewing Scholarship Application
router.get('/admin/view/applications', GetReviewedApplications);
router.get('/admin/view/applications/department/:id', GetDepartmentFilteredReviewedApplications);
router.get('/admin/view/applications/course/:id', GetCourseFilteredReviewedApplications);
router.get('/admin/view/application/:id', GetSpecificReviewedApplication);
router.post('/admin/approve/application', CreateApprovedApplication);
router.delete('/admin/delete/application/:id', DeleteReviewedApplication);

router.get('/admin/view/approved/applications', GetApprovedApplications);
router.get('/admin/view/approved/applications/department/:id', GetDepartmentFilteredApprovedApplications);
router.get('/admin/view/approved/applications/course/:id', GetCourseFilteredApprovedApplications);
router.get('/admin/view/approved/application/:id', GetSpecificApprovedApplication);
router.delete('/admin/delete/approved/application/:id', DeleteApprovedApplication);

router.post('/admin/create/rejected/application', AdminCreateRejectedApplication);
router.get('/admin/view/rejected/applications', GetRejectedApplications);
router.get('/admin/view/rejected/applications/department/:id', GetDepartmentFilteredRejectedApplications);
router.get('/admin/view/rejected/application/:id', GetSpecificRejectedApplication);
router.delete('/admin/delete/rejected/application/:id', DeleteRejectedApplication);

 

export default router;