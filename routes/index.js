import express from "express";

import { getPendingStudents,
        getStudents,
        StudentRegister,
        ApproveStudentRegister,
        StudentLogin,
        UpdateStudent,
        DeleteStudent,
        StudentLogout,
        RejectPendingStudent,
        getStudentDetails,
        EditStudentDetails,
        StudentChangePassword,
        CreateScholarshipApplication,
        IsScholarshipRejected,
        IsScholarshipApproved,
        IsScholarshipUnderReview,
        IsScholarshipSubmitted, 
        getSearchedStudents,
        isOnSubmitted} from "../controllers/Students.js";
import { StudentVerifyToken } from "../middleware/StudentVerifyToken.js";
import { StudentRefreshToken } from "../controllers/StudentRefreshToken.js";

import { getPendingDeans,
     getDeans,
      DeanRegister,
      ApproveDeanRegister,
      DeanLogin,
      UpdateDean,
      DeleteDean,
      DeanLogout,
      RejectPendingDean,
      getDeanDetails,
      EditDeanDetails,
      DeanChangePassword,
      GetSubmittedApplications,
      GetFilteredSubmittedApplications,
      GetSpecificApplication,
      CreateReviewApplication,
      DeleteSubmittedApplication,
      CreateRejectedApplication,
      GetDeanApprovedApplications,
      GetSpecificDeanApprovedApplication, 
      GetSearchedSubmittedApplications,
      GetNamedFilterSubmittedApplications,
      GetNamedFilterReviewedApplications,
      GetSearchedReviewedApplications,
      DeanDetailsChangePassword} from "../controllers/Deans.js";
import { DeanVerifyToken } from "../middleware/DeanVerifyToken.js";
import { DeanRefreshToken } from "../controllers/DeanRefreshToken.js";

import { AddAnnouncements,
     DeleteAnnouncement,
     GetAnnouncements,
     UpdateAnnouncement,
     AddScholarships,
     DeleteScholarship,
     GetScholarships,
     UpdateScholarship,
     AdminRegister,
     AdminLogin,
     AdminLogout,
     GetScholarship,
     GetReviewedApplications,
     GetDepartmentFilteredReviewedApplications,
     GetCourseFilteredReviewedApplications,
     GetSpecificReviewedApplication,
     DeleteReviewedApplication,
     CreateApprovedApplication,
     GetApprovedApplications,
     GetDepartmentFilteredApprovedApplications,
     GetCourseFilteredApprovedApplications,
     GetSpecificApprovedApplication,
     DeleteApprovedApplication,
     AdminCreateRejectedApplication,
     GetRejectedApplications,
     GetDepartmentFilteredRejectedApplications,
     GetCourseFilteredRejectedApplications,
     DeleteRejectedApplication,
     GetSpecificRejectedApplication,
     GetSearchedScholarships,
     GetReviewedSearchedApplications,
     GetApprovedSearchedApplications, 
     GetMultipleFilteredReviewedApplications,
     GetNameDeptFilteredReviewedApplications,
     GetNameDeptFilteredApprovedApplications,
     GetMultipleFilteredApprovedApplications} from "../controllers/Admins.js";
import { AdminRefreshToken } from "../controllers/AdminRefreshToken.js";
import { AdminVerifyToken } from "../middleware/AdminVerifyToken.js";


 
const router = express.Router();


// Student
router.post('/register/student', StudentRegister);
router.post('/student', StudentLogin);
router.get('/student/token', StudentRefreshToken);
router.get('/scholarships/get/:id', GetScholarship);
router.get('/student/details/:id', StudentVerifyToken, getStudentDetails);
router.patch('/update/student/details/:id',StudentVerifyToken, EditStudentDetails);
router.patch('/change/student/details/password',StudentVerifyToken, StudentChangePassword);
router.get('/already/submitted/:id', StudentVerifyToken, isOnSubmitted)
router.post('/submit/student/application', CreateScholarshipApplication);
router.delete('/student/logout', StudentLogout);
// Check Application Status
router.get('/student/application/rejected/:id',StudentVerifyToken, IsScholarshipRejected);
router.get('/student/application/approved/:id',StudentVerifyToken, IsScholarshipApproved);
router.get('/student/application/review/:id',StudentVerifyToken, IsScholarshipUnderReview);
router.get('/student/application/submitted/:id',StudentVerifyToken, IsScholarshipSubmitted);


// Dean
router.post('/register/dean', DeanRegister);
router.post('/dean', DeanLogin);
router.get('/dean/token', DeanRefreshToken);
router.get('/dean/details/:id',DeanVerifyToken, getDeanDetails);
router.patch('/update/dean/details/:id',DeanVerifyToken, EditDeanDetails);
router.patch('/change/dean/details/password',DeanVerifyToken, DeanDetailsChangePassword);
router.get('/dean/view/applications/dept/:id',DeanVerifyToken, GetSubmittedApplications);
router.get('/dean/view/applications/course/:id',DeanVerifyToken, GetFilteredSubmittedApplications);
router.get('/dean/view/applications/name/:id',DeanVerifyToken, GetSearchedSubmittedApplications);
router.get('/dean/view/applications/filter/:id/:course',DeanVerifyToken, GetNamedFilterSubmittedApplications);
router.get('/dean/view/applications/approved/name/:id',DeanVerifyToken, GetSearchedReviewedApplications);
router.get('/dean/view/applications/approved/filter/:id/:course',DeanVerifyToken, GetNamedFilterReviewedApplications);
router.get('/dean/view/approved/applications/dept/:id',DeanVerifyToken, GetDeanApprovedApplications);
router.get('/dean/view/approved/applications/course/:id', DeanVerifyToken, GetCourseFilteredReviewedApplications);
router.get('/dean/applications/review/:id',DeanVerifyToken, GetSpecificApplication);
router.get('/dean/view/approved/application/:id',DeanVerifyToken, GetSpecificDeanApprovedApplication);
router.post('/create/review/application',DeanVerifyToken, CreateReviewApplication);
router.post('/create/rejected/application',DeanVerifyToken, CreateRejectedApplication);
router.delete('/delete/submitted/application/:id',DeanVerifyToken, DeleteSubmittedApplication);
router.delete('/dean/logout', DeanLogout);


// Admin
router.post('/register/admin', AdminRegister);
router.post('/admin', AdminLogin);
router.get('/admin/token', AdminRefreshToken);
router.delete('/admin/logout', AdminLogout);

//CRUD FOR STUDENTS AND DEANS
router.get('/students/get',AdminVerifyToken, getStudents);
router.get('/students/get/:id',AdminVerifyToken, getSearchedStudents);
router.get('/pendingstudents/get',AdminVerifyToken, getPendingStudents);
router.post('/approve/registration/student',AdminVerifyToken, ApproveStudentRegister);
router.delete('/reject/registration/student/:id',AdminVerifyToken, RejectPendingStudent);
router.patch('/update/student/:id',AdminVerifyToken, UpdateStudent);
router.patch('/change/student/password',AdminVerifyToken, StudentChangePassword);
router.delete('/delete/student/:id',AdminVerifyToken, DeleteStudent);

router.get('/deans/get',AdminVerifyToken, getDeans);
router.get('/pendingdeans/get',AdminVerifyToken, getPendingDeans);
router.post('/approve/registration/dean',AdminVerifyToken, ApproveDeanRegister);
router.delete('/reject/registration/dean/:id',AdminVerifyToken, RejectPendingDean);
router.patch('/update/dean/:id',AdminVerifyToken, UpdateDean);
router.patch('/change/dean/password/:id',AdminVerifyToken, DeanChangePassword);
router.delete('/delete/dean/:id',AdminVerifyToken, DeleteDean);

// CRUD Announcements
router.post('/announcements/add',AdminVerifyToken, AddAnnouncements);
router.get('/announcements/get', GetAnnouncements);
router.patch('/announcements/update/:id',AdminVerifyToken, UpdateAnnouncement);
router.delete('/announcements/delete/:id',AdminVerifyToken, DeleteAnnouncement);

// CRUD Scholarship Info
router.post('/scholarships/add',AdminVerifyToken, AddScholarships);
router.get('/scholarships/get', GetScholarships);
router.get('/scholarships/search/:id', GetSearchedScholarships);
router.patch('/scholarships/update/:id',AdminVerifyToken, UpdateScholarship);
router.delete('/scholarships/delete/:id',AdminVerifyToken, DeleteScholarship);

//Accepting, Rejecting, Viewing Scholarship Application
router.get('/admin/view/applications', AdminVerifyToken, GetReviewedApplications);
router.get('/admin/search/applications/:id', AdminVerifyToken, GetReviewedSearchedApplications);
router.get('/admin/view/applications/department/:id', AdminVerifyToken, GetDepartmentFilteredReviewedApplications);
router.get('/admin/view/applications/course/:id', AdminVerifyToken, GetCourseFilteredReviewedApplications);
router.get('/admin/name/dept/filter/:id/:dept', AdminVerifyToken, GetNameDeptFilteredReviewedApplications);
router.get('/admin/view/applications/:id/:dept/:course', AdminVerifyToken, GetMultipleFilteredReviewedApplications);
router.get('/admin/view/application/:id', DeanVerifyToken, GetSpecificReviewedApplication);
router.post('/admin/approve/application', AdminVerifyToken, CreateApprovedApplication);
router.delete('/admin/delete/application/:id', AdminVerifyToken, DeleteReviewedApplication);

router.get('/admin/view/approved/applications',AdminVerifyToken,  GetApprovedApplications);
router.get('/admin/search/approved/applications/:id',AdminVerifyToken,  GetApprovedSearchedApplications);
router.get('/admin/view/approved/applications/department/:id',AdminVerifyToken,  GetDepartmentFilteredApprovedApplications);
router.get('/admin/view/approved/applications/course/:id',AdminVerifyToken,  GetCourseFilteredApprovedApplications);

router.get('/admin/name/dept/filter/approved/:id/:dept', AdminVerifyToken, GetNameDeptFilteredApprovedApplications);
router.get('/admin/view/applications/approved/:id/:dept/:course', AdminVerifyToken, GetMultipleFilteredApprovedApplications);

router.get('/admin/view/approved/application/:id',AdminVerifyToken,  GetSpecificApprovedApplication);
router.delete('/admin/delete/approved/application/:id',AdminVerifyToken,  DeleteApprovedApplication);

router.post('/admin/create/rejected/application',AdminVerifyToken, AdminCreateRejectedApplication);
router.get('/admin/view/rejected/applications',AdminVerifyToken, GetRejectedApplications);
router.get('/admin/view/rejected/applications/department/:id',AdminVerifyToken, GetDepartmentFilteredRejectedApplications);
router.get('/admin/view/rejected/application/:id',AdminVerifyToken, GetSpecificRejectedApplication);
router.delete('/admin/delete/rejected/application/:id',AdminVerifyToken, DeleteRejectedApplication);

 

export default router;