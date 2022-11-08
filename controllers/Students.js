import Students from "../models/StudentModel.js"
import PendingStudents from "../models/PendingStudentModel.js" 
import SubmittedApplications from "../models/SubmittedApplicationModel.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import RejectedApplications from "../models/RejectedApplicationModel.js";
import ApprovedApplications from "../models/ApprovedApplications.js";
import ReviewApplications from "../models/ReviewApplicationModel.js";
 
export const getStudents = async(req, res) => {
    try {
        const student = await Students.findAll({
            attributes:['id', 'student_id','last_name','first_name','middle_name', 'contact_no', 'email', 'department', 'course', 'year']
        });
        res.json(student);
    } catch (error) {
        console.log(error);
    }
}

export const getPendingStudents = async(req, res) => {
    try {
        const student = await PendingStudents.findAll({
            attributes:['id', 'student_id','last_name','first_name','middle_name', 'contact_no', 'email', 'department', 'course', 'year', 'password']
        });
        res.json(student);
    } catch (error) {
        console.log(error);
    }
}
 
export const StudentRegister = async(req, res) => {
    const { last_name, first_name, middle_name, contact_no, email, department, course, year, student_id, password, confPassword } = req.body;
    const isStudentUnique = await Students.findOne({where: {student_id: student_id}});
    if (isStudentUnique !== null) return res.status(400).json({msg: "Student ID is already used"});
    if (student_id.length < 5) return res.status(400).json({msg: "Enter a valid Student ID"});
    if (last_name.length < 1) return res.status(400).json({msg: "Enter a valid last name"});
    if (first_name.length < 1) return res.status(400).json({msg: "Enter a valid first name"});
    if (middle_name.length < 1) return res.status(400).json({msg: "Enter a valid middle name"});
    if (contact_no.length < 11) return res.status(400).json({msg: "Enter a valid contact no"});
    if (!email.includes("@")) return res.status(400).json({msg: "Enter a valid email"});
    if (department.length < 1) return res.status(400).json({msg: "Enter a valid department"});
    if (course.length < 1) return res.status(400).json({msg: "Enter a valid course"});
    if (year.length < 1) return res.status(400).json({msg: "Enter a valid year"});
    
    if(password.length < 8) return res.status(400).json({msg: "Password must be at least 8 characters"});
    if(password !== confPassword) return res.status(400).json({msg: "Password and Confirm Password do not match"});
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        await PendingStudents.create({
            last_name: last_name,
            first_name: first_name,
            middle_name: middle_name,
            contact_no: contact_no,
            email: email,
            department: department,
            course: course,
            year: year,
            student_id: student_id,
            password: hashPassword
        });
        res.json({msg: "Registration sent for Approval"});
    } catch (error) {
        console.log(error);
    }
}

export const ApproveStudentRegister = async(req, res) => {
    const { last_name, first_name, middle_name, contact_no, email, department, course, year, student_id, password} = req.body;
    const isStudentUnique = await Students.findOne({where: {student_id: student_id}});
    if (isStudentUnique !== null) return res.status(400).json({msg: "Student ID is already used"});
    try {
        await Students.create({
            last_name: last_name,
            first_name: first_name,
            middle_name: middle_name,
            contact_no: contact_no,
            email: email,
            department: department,
            course: course,
            year: year,
            student_id: student_id,
            password: password
        });
        res.json({msg: "Registration Successful"});
    } catch (error) {
        console.log(error);
    }
}


export const RejectPendingStudent = async (req, res) => {
    try {
        await PendingStudents.destroy({
            where: {
                id: req.params.id
            }
        });
        res.json({
            msg: "Pending Student Rejected"
        });
    } catch (error) {
        res.json({ message: error.message });
    }  
}

 
export const StudentLogin = async(req, res) => {
    try {
        const student = await Students.findAll({
            where:{
                student_id: req.body.student_id
            }
        });
        const match = await bcrypt.compare(req.body.password, student[0].password);
        if(!match) return res.status(400).json({msg: "Wrong Password"});
        const studentId = student[0].student_id;
        const first_name = student[0].first_name;
        const last_name = student[0].last_name;
        const email = student[0].email;
        const accessToken = jwt.sign({studentId, first_name, last_name, email}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '15s'
        });
        const refreshToken = jwt.sign({studentId, first_name, last_name, email}, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: '1d'
        });
        await Students.update({refresh_token: refreshToken},{
            where:{
                student_id: studentId
            }
        });
        res.cookie('refreshToken', refreshToken,{
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({ accessToken });
    } catch (error) {
        res.status(404).json({msg:"Student ID not found"});
    }
}

export const getStudentDetails = async(req, res) => {
    try {
        const student = await Students.findOne({ where: {student_id : req.params.id}
        });
        res.json(student);
    } catch (error) {
        console.log(error);
    }
}

export const EditStudentDetails = async (req, res) => {
    const {student_id} = req.body;
    const isStudentUnique = await Students.findOne({where: {student_id: student_id}});
    if (isStudentUnique !== null) return res.status(400).json({msg: "Student ID is already used"});
    try {
        await Students.update(req.body, {
            where: {
                student_id: req.params.id
            }
        });
        res.json(req.body);
    } catch (error) {
        res.json({ msg: error.message });
    }  
}


export const UpdateStudent = async (req, res) => {
    const {student_id} = req.body;
    const isStudentUnique = await Students.findOne({where: {student_id: student_id}});
    if (isStudentUnique !== null) return res.status(400).json({msg: "Student ID is already used"});
    try {
        await Students.update(req.body, {
            where: {
                id: req.params.id
            }
        });
        res.json(req.body);
    } catch (error) {
        res.json({ msg: error.message });
    }  
}

export const DeleteStudent = async (req, res) => {
    try {
        await Students.destroy({
            where: {
                id: req.params.id
            }
        });
        res.json({
            "message": "Student Deleted"
        });
    } catch (error) {
        res.json({ message: error.message });
    }  
}

 
export const StudentLogout = async(req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const student = await Students.findAll({
        where:{
            refresh_token: refreshToken
        }
    });
    if(!student[0]) return res.sendStatus(204);
    const studentId = student[0].student_id;
    await Students.update({refresh_token: null},{
        where:{
            student_id: studentId
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}


export const StudentChangePassword = async (req, res) => {
    const {student_id, password, confPassword} = req.body
    if(password !== confPassword) return res.status(400).json({msg: "Password and Confirm Password do not match"});
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        await Students.update({password: hashPassword}, {
            where: {
                student_id: student_id
            }
        });
        res.json(req.body);
    } catch (error) {
        res.json({ msg: error.message });
    }  
}

export const CreateScholarshipApplication = async (req, res) => {
    const { 
        last_name, 
        first_name, 
        middle_name, 
        contact_no, 
        email, 
        department, 
        course, 
        year, 
        semester, 
        school_year, 
        student_id,
        student_sign,
        scholarship_type,
        subj_1,
        subj_2,
        subj_3,
        subj_4,
        subj_5,
        subj_6,
        subj_7,
        subj_8,
        subj_9,
        subj_10,
        subj_11,
        subj_12,
        units_1,
        units_2,
        units_3,
        units_4,
        units_5,
        units_6,
        units_7,
        units_8,
        units_9,
        units_10,
        units_11,
        units_12,
        req_1,
        req_2,
        req_3,
        req_4,
        req_5,
        req_6,
        req_7,
        req_8,
        req_9,
        req_10
    } = req.body;
    
    try {
        await SubmittedApplications.create({
            last_name: last_name, 
            first_name: first_name, 
            middle_name: middle_name, 
            contact_no: contact_no, 
            email: email, 
            department: department, 
            course: course, 
            year: year,
            semester: semester,
            school_year: school_year,
            student_id: student_id,
            student_sign: student_sign,
            scholarship_type: scholarship_type,
            subj_1: subj_1,
            subj_2: subj_2,
            subj_3: subj_3,
            subj_4: subj_4,
            subj_5: subj_5,
            subj_6: subj_6,
            subj_7: subj_7,
            subj_8: subj_8,
            subj_9: subj_9,
            subj_10: subj_10,
            subj_11: subj_11,
            subj_12: subj_12,
            units_1: units_1,
            units_2: units_2,
            units_3: units_3,
            units_4: units_4,
            units_5: units_5,
            units_6: units_6,
            units_7: units_7,
            units_8: units_8,
            units_9: units_9,
            units_10: units_10,
            units_11: units_11,
            units_12: units_12,
            req_1: req_1,
            req_2: req_2,
            req_3: req_3,
            req_4: req_4,
            req_5: req_5,
            req_6: req_6,
            req_7: req_7,
            req_8: req_8,
            req_9: req_9,
            req_10: req_10
        });
        res.json({msg: "Application has been submitted"});
    } catch (error) {
        res.json({ msg: error.message });
    }  
}


export const IsScholarshipRejected = async(req, res) => {
    try {
        const application = await RejectedApplications.findAll({
            where:{
                student_id: req.params.id
            }
        })
        res.json(application);
    } catch (error) {
        res.json({ msg: error.message });
        console.log(error)
    }
}
export const IsScholarshipApproved = async(req, res) => {
    try {
        const application = await ApprovedApplications.findAll({
            where:{
                student_id: req.params.id
            }
        })
        res.json(application);
    } catch (error) {
        res.json({ msg: error.message });
        console.log(error)
    }
}
export const IsScholarshipUnderReview = async(req, res) => {
    try {
        const application = await ReviewApplications.findAll({
            where:{
                student_id: req.params.id
            }
        })
        res.json(application);
    } catch (error) {
        res.json({ msg: error.message });
        console.log(error)
    }
}
export const IsScholarshipSubmitted = async(req, res) => {
    try {
        const application = await SubmittedApplications.findAll({
            where:{
                student_id: req.params.id
            }
        })
        res.json(application);
    } catch (error) {
        res.json({ msg: error.message });
        console.log(error)
    }
}