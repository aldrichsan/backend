import Students from "../models/StudentModel.js";
import PendingStudents from "../models/PendingStudentModel.js" 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
 
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
            "message": "Pending Student Rejected"
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


export const UpdateStudent = async (req, res) => {
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