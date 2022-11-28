import Deans from "../models/DeanModel.js";
import PendingDeans from "../models/PendingDeanModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import SubmittedApplications from "../models/SubmittedApplicationModel.js";
import ReviewApplications from "../models/ReviewApplicationModel.js";
import RejectedApplications from "../models/RejectedApplicationModel.js";
import { Op, Sequelize } from "sequelize";


export const getDeans = async(req, res) => {
    try {
        const dean = await Deans.findAll({
            attributes:['id','dean_id','last_name','middle_name', 'first_name', 'email', 'contact_no', 'department']
        });
        res.json(dean);
    } catch (error) {
        console.log(error);
    }
}

export const getPendingDeans = async(req, res) => {
    try {
        const dean = await PendingDeans.findAll({
            attributes:['id', 'dean_id','last_name','first_name','middle_name', 'contact_no', 'email', 'department', 'password']
        });
        res.json(dean);
    } catch (error) {
        console.log(error);
    }
}
 
export const DeanRegister = async(req, res) => {
    const { last_name, first_name, middle_name, contact_no, email, department, dean_id, password, confPassword } = req.body;
    const isDeanUnique = await Deans.findOne({where: {dean_id: dean_id}});
    if (isDeanUnique !== null) return res.status(400).json({msg: "Dean ID is already used"});
    if (dean_id.length < 5) return res.status(400).json({msg: "Enter a valid Dean ID"});
    if (last_name.length < 1) return res.status(400).json({msg: "Enter a valid last name"});
    if (first_name.length < 1) return res.status(400).json({msg: "Enter a valid first name"});
    if (middle_name.length < 1) return res.status(400).json({msg: "Enter a valid middle name"});
    if (contact_no.length < 11) return res.status(400).json({msg: "Enter a valid contact no"});
    if (!email.includes("@")) return res.status(400).json({msg: "Enter a valid email"});
    if (department.length < 1) return res.status(400).json({msg: "Enter a valid department"});
    
    if(password.length < 8) return res.status(400).json({msg: "Password must be at least 8 characters"});
    if(password !== confPassword) return res.status(400).json({msg: "Password and Confirm Password do not match"});
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        await PendingDeans.create({
            last_name: last_name,
            first_name: first_name,
            middle_name: middle_name,
            contact_no: contact_no,
            email: email,
            department: department,
            dean_id: dean_id,
            password: hashPassword
        });
        res.json({msg: "Registration sent for Approval"});
    } catch (error) {
        console.log(error);
    }
}

export const ApproveDeanRegister = async(req, res) => {
    const { last_name, first_name, middle_name, contact_no, email, department, dean_id, password} = req.body;
    const isDeanUnique = await Deans.findOne({where: {dean_id: dean_id}});
    if (isDeanUnique !== null) return res.status(400).json({msg: "Dean ID is already used"});
    try {
        await Deans.create({
            last_name: last_name,
            first_name: first_name,
            middle_name: middle_name,
            contact_no: contact_no,
            email: email,
            department: department,
            dean_id: dean_id,
            password: password
        });
        res.json({msg: "Registration Successful"});
    } catch (error) {
        console.log(error);
    }
}

export const RejectPendingDean = async (req, res) => {
    try {
        await PendingDeans.destroy({
            where: {
                id: req.params.id
            }
        });
        res.json({
            "msg": "Pending Dean Rejected"
        });
    } catch (error) {
        res.json({ message: error.message });
    }  
}

 
export const DeanLogin = async(req, res) => {
    try {
        const dean = await Deans.findAll({
            where:{
                dean_id: req.body.dean_id
            }
        });
        const match = await bcrypt.compare(req.body.password, dean[0].password);
        if(!match) return res.status(400).json({msg: "Wrong Password"});
        const deanId = dean[0].dean_id;
        const first_name = dean[0].first_name;
        const last_name = dean[0].last_name;
        const email = dean[0].email;
        const accessToken = jwt.sign({deanId, first_name, last_name, email}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '15s'
        });
        const refreshToken = jwt.sign({deanId, first_name, last_name, email}, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: '1d'
        });
        await Deans.update({refresh_token: refreshToken},{
            where:{
                dean_id: deanId
            }
        });
        res.cookie('refreshToken', refreshToken,{
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({ accessToken });
    } catch (error) {
        res.status(404).json({msg:"Dean ID not found"});
    }
}

export const getDeanDetails = async(req, res) => {
    try {
        const dean = await Deans.findOne({ where: {dean_id : req.params.id}
        });
        res.json(dean);
    } catch (error) {
        console.log(error);
    }
}

export const EditDeanDetails = async (req, res) => {
    const {dean_id} = req.body;
    const isDeanUnique = await Deans.findAll({where: {dean_id: dean_id}});
    if (isDeanUnique.length !== 1) return res.status(400).json({msg: "Dean ID is already used"});
    try {
        await Deans.update(req.body, {
            where: {
                id: req.params.id
            }
        });
        res.json(req.body);
    } catch (error) {
        res.json({ msg: error.message });
    }  
}

export const UpdateDean = async (req, res) => {
    try {
        await Deans.update(req.body, {
            where: {
                id: req.params.id
            }
        });
        res.json(req.body);
    } catch (error) {
        res.json({ msg: error.message });
    }  
}

export const DeleteDean = async (req, res) => {
    try {
        await Deans.destroy({
            where: {
                id: req.params.id
            }
        });
        res.json({
            "message": "Dean Deleted"
        });
    } catch (error) {
        res.json({ message: error.message });
    }  
}
 
export const DeanLogout = async(req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const dean = await Deans.findAll({
        where:{
            refresh_token: refreshToken
        }
    });
    if(!dean[0]) return res.sendStatus(204);
    const deanId = dean[0].dean_id;
    await Deans.update({refresh_token: null},{
        where:{
            dean_id: deanId
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}

export const DeanChangePassword = async (req, res) => {
    const {password, confPassword} = req.body
    if(password !== confPassword) return res.status(400).json({msg: "Password and Confirm Password do not match"});
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        await Deans.update({password: hashPassword}, {
            where: {
                dean_id: req.params.id
            }
        });
        res.json(req.body);
    } catch (error) {
        res.json({ msg: error.message });
    }  
}

export const GetSubmittedApplications = async (req, res) => {
    const submitted_applications = await SubmittedApplications.findAll({
        where:{
            department: req.params.id
        }
    });
    res.json(submitted_applications);
}

export const GetFilteredSubmittedApplications = async (req, res) => {
    const submitted_applications = await SubmittedApplications.findAll({
        where:{
            course: req.params.id
        }
    });
    res.json(submitted_applications);
}

export const GetSearchedSubmittedApplications = async (req, res) => {
    const submitted_applications = await SubmittedApplications.findAll({
        where:{
            [Op.or]:[
                {student_id:{[Op.like]: '%' + req.params.id + '%'}},
                {first_name: {[Op.like]: '%' + req.params.id + '%'}},
                {last_name: {[Op.like]: '%' + req.params.id + '%'}},
                Sequelize.where(Sequelize.fn('concat', Sequelize.col('first_name'), ' ', Sequelize.col('last_name')), {
                    [Op.like]: '%' + req.params.id + '%'
                })
            ]
        }
    });
    res.json(submitted_applications);
}

export const GetNamedFilterSubmittedApplications = async (req, res) => {
    const submitted_applications = await SubmittedApplications.findAll({
        where:{
            course: req.params.course,
            [Op.or]:[
                {student_id:{[Op.like]: '%' + req.params.id + '%'}},
                {first_name: {[Op.like]: '%' + req.params.id + '%'}},
                {last_name: {[Op.like]: '%' + req.params.id + '%'}},
                Sequelize.where(Sequelize.fn('concat', Sequelize.col('first_name'), ' ', Sequelize.col('last_name')), {
                    [Op.like]: '%' + req.params.id + '%'
                })
            ]
        }
    });
    res.json(submitted_applications);
}

export const GetSearchedReviewedApplications = async (req, res) => {
    const submitted_applications = await ReviewApplications.findAll({
        where:{
            [Op.or]:[
                {student_id:{[Op.like]: '%' + req.params.id + '%'}},
                {first_name: {[Op.like]: '%' + req.params.id + '%'}},
                {last_name: {[Op.like]: '%' + req.params.id + '%'}},
                Sequelize.where(Sequelize.fn('concat', Sequelize.col('first_name'), ' ', Sequelize.col('last_name')), {
                    [Op.like]: '%' + req.params.id + '%'
                })
            ]
        }
    });
    res.json(submitted_applications);
}

export const GetNamedFilterReviewedApplications = async (req, res) => {
    const submitted_applications = await ReviewApplications.findAll({
        where:{
            course: req.params.course,
            [Op.or]:[
                {student_id:{[Op.like]: '%' + req.params.id + '%'}},
                {first_name: {[Op.like]: '%' + req.params.id + '%'}},
                {last_name: {[Op.like]: '%' + req.params.id + '%'}},
                Sequelize.where(Sequelize.fn('concat', Sequelize.col('first_name'), ' ', Sequelize.col('last_name')), {
                    [Op.like]: '%' + req.params.id + '%'
                })
            ]
        }
    });
    res.json(submitted_applications);
}

export const GetSpecificApplication = async (req, res) => {
    const specific_application = await SubmittedApplications.findOne({
        where:{
            id: req.params.id
        }
    });
    res.json(specific_application);
}


export const GetDeanApprovedApplications = async (req, res) => {
    const reviewed_applications = await ReviewApplications.findAll({
        where:{
            department: req.params.id
        }
    });
    res.json(reviewed_applications);
}

export const GetSpecificDeanApprovedApplication = async (req, res) => {
    const reviewed_applications = await ReviewApplications.findOne({
        where:{
            id: req.params.id
        }
    });
    res.json(reviewed_applications);
}


export const CreateReviewApplication = async (req, res) => {
    const { 
        id,
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
        dean_sign,
        date_submitted,
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
        await ReviewApplications.create({
            id: id, 
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
            dean_sign: dean_sign,
            date_submitted: date_submitted,
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
        res.json({msg: "Application has been Accepted"});
    } catch (error) {
        res.json({ msg: error.message });
    }  
}

export const CreateRejectedApplication = async (req, res) => {
    const { 
        id,
        last_name, 
        first_name, 
        contact_no, 
        email, 
        department,
        date_submitted,
        scholarship_type,
        rejected_by,
        reason_of_rejection,
        student_id
    } = req.body;
    
    try {
        await RejectedApplications.create({
            id: id, 
            student_id: student_id,
            last_name: last_name, 
            first_name: first_name, 
            contact_no: contact_no, 
            email: email, 
            department: department, 
            date_submitted: date_submitted,
            scholarship_type: scholarship_type,
            rejected_by: rejected_by,
            reason_of_rejection: reason_of_rejection
        });
        res.json({msg: "Application has been Rejected"});
    } catch (error) {
        res.json({ msg: error.message });
    }  
}


export const DeleteSubmittedApplication = async (req, res) => {
    try {
        await SubmittedApplications.destroy({
            where: {
                id: req.params.id
            }
        });
        res.json({
            "message": "Application Deleted"
        });
    } catch (error) {
        res.json({ message: error.message });
    }  
}