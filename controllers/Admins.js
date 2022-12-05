import Admins from "../models/AdminModel.js" 
import Announcements from "../models/AnnouncementModel.js" 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ScholarshipInfo from "../models/ScholarshipInfoModel.js";
import ReviewApplications from "../models/ReviewApplicationModel.js";
import ApprovedApplications from "../models/ApprovedApplications.js";
import RejectedApplications from "../models/RejectedApplicationModel.js";
import { Op, Sequelize } from "sequelize";
 
 
export const AdminRegister = async(req, res) => {
    const { last_name, first_name, middle_name, contact_no, email, admin_id, password, confPassword } = req.body;
    const isAdminUnique = await Admins.findOne({where: {admin_id: admin_id}});
    if (isAdminUnique !== null) return res.status(400).json({msg: "Student ID is already used"});
    if (admin_id.length < 5) return res.status(400).json({msg: "Enter a valid Admin ID"});
    if (last_name.length < 1) return res.status(400).json({msg: "Enter a valid last name"});
    if (first_name.length < 1) return res.status(400).json({msg: "Enter a valid first name"});
    if (middle_name.length < 1) return res.status(400).json({msg: "Enter a valid middle name"});
    if (contact_no.length < 11) return res.status(400).json({msg: "Enter a valid contact no"});
    if (!email.includes("@")) return res.status(400).json({msg: "Enter a valid email"});
    if(password !== confPassword) return res.status(400).json({msg: "Password and Confirm Password do not match"});
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        await Admins.create({
            last_name: last_name,
            first_name: first_name,
            middle_name: middle_name,
            contact_no: contact_no,
            email: email,
            admin_id: admin_id,
            password: hashPassword
        });
        res.json({msg: "Registration Success"});
    } catch (error) {
        console.log(error);
    }
}

export const AdminLogin = async(req, res) => {
    try {
        const admin = await Admins.findAll({
            where:{
                admin_id: req.body.admin_id
            }
        });
        const match = await bcrypt.compare(req.body.password, admin[0].password);
        if(!match) return res.status(400).json({msg: "Wrong Password"});
        const adminId = admin[0].admin_id;
        const first_name = admin[0].first_name;
        const last_name = admin[0].last_name;
        const email = admin[0].email;
        const accessToken = jwt.sign({adminId, first_name, last_name, email}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '15s'
        });
        const refreshToken = jwt.sign({adminId, first_name, last_name, email}, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: '1d'
        });
        await Admins.update({refresh_token: refreshToken},{
            where:{
                admin_id: adminId
            }
        });
        res.cookie('refreshToken', refreshToken,{
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({ accessToken });
    } catch (error) {
        res.status(404).json({msg:"Admin ID not found"});
    }
}


export const AdminLogout = async(req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const admin = await Admins.findAll({
        where:{
            refresh_token: refreshToken
        }
    });
    if(!admin[0]) return res.sendStatus(204);
    const adminId = admin[0].admin_id;
    await Admins.update({refresh_token: null},{
        where:{
            admin_id: adminId
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}


// Announcements

export const AddAnnouncements = async(req, res) => {
    const {title, body, image} = req.body;
    try {
        await Announcements.create({
            title: title,
            body: body,
            image: image
        });
        res.json({msg: "Added an announcements"});
    } catch (error) {
        console.log(error);
    }
}

export const GetAnnouncements = async(req, res) => {
    try {
        const announcements = await Announcements.findAll({
            attributes:['id', 'title','body', 'image']
        });
        res.json(announcements).status(200)
    } catch (error) {
        console.log(error);
    }
}

export const UpdateAnnouncement = async (req, res) => {
    try {
        await Announcements.update(req.body, {
            where: {
                id: req.params.id
            }
        });
        res.json(req.body);
    } catch (error) {
        res.json({ msg: error.message });
    }  
}

export const DeleteAnnouncement = async (req, res) => {
    try {
        await Announcements.destroy({
            where: {
                id: req.params.id
            }
        });
        res.json({
            "message": "Announcement Deleted"
        });
    } catch (error) {
        res.json({ msg: error.message });
    }  
}


// Scholarship Informations

export const AddScholarships = async(req, res) => {
    const {scholarship_name, description, requirements} = req.body;
    try {
        await ScholarshipInfo.create({
            scholarship_name: scholarship_name,
            description: description,
            requirements: requirements
        });
        res.json({msg: "Added an announcements"});
    } catch (error) {
        console.log(error);
    }
}

export const GetScholarships = async(req, res) => {
    try {
        const scholarships = await ScholarshipInfo.findAll({
            attributes:['id', 'scholarship_name', 'description', 'requirements']
        });
        res.json(scholarships).status(200)
    } catch (error) {
        console.log(error);
    }
}
export const GetSearchedScholarships = async(req, res) => {
    try {
        const scholarships = await ScholarshipInfo.findAll({
            attributes:['id', 'scholarship_name', 'description', 'requirements'],
            where:{ 
                scholarship_name:{
                    [Op.like]: '%' + req.params.id + '%'
                } 
            }
        });
        res.json(scholarships).status(200)
    } catch (error) {
        console.log(error);
    }
}

export const GetScholarship = async(req, res) => {
    try {
        const scholarships = await ScholarshipInfo.findOne({
            attributes:['id', 'scholarship_name', 'description', 'requirements'],
            where:{
                scholarship_name: req.params.id
            }
        });
        res.json(scholarships).status(200)
    } catch (error) {
        console.log(error);
    }
}

export const UpdateScholarship = async (req, res) => {
    try {
        await ScholarshipInfo.update(req.body, {
            where: {
                id: req.params.id
            }
        });
        res.json(req.body);
    } catch (error) {
        res.json({ msg: error.message });
    }  
}

export const DeleteScholarship = async (req, res) => {
    try {
        await ScholarshipInfo.destroy({
            where: {
                id: req.params.id
            }
        });
        res.json({
            msg: "Scholarship Deleted"
        });
    } catch (error) {
        res.json({ message: error.message });
    }  
}


//Accepting and Rejecting Student's Scholarship Applications

export const GetReviewedApplications = async (req, res) => {
    const reviewed_applications = await ReviewApplications.findAll({
    });
    res.json(reviewed_applications);
}
export const GetReviewedSearchedApplications = async (req, res) => {
    const reviewed_applications = await ReviewApplications.findAll({
        where:{
            [Op.or]:[
                {student_id:{[Op.like]: '%' + req.params.id + '%'}},
                {first_name: {[Op.like]: '%' + req.params.id + '%'}},
                {last_name: {[Op.like]: '%' + req.params.id + '%'}},
                Sequelize.where(Sequelize.fn('concat', Sequelize.col('first_name'), ' ', Sequelize.col('last_name')), {
                    [Op.like]: '%' + req.params.id + '%'
                }),
                Sequelize.where(Sequelize.fn('concat', Sequelize.col('last_name'), ' ', Sequelize.col('first_name')), {
                    [Op.like]: '%' + req.params.id + '%'
                })
            ]
        }
    });
    res.json(reviewed_applications);
}

export const GetDepartmentFilteredReviewedApplications = async (req, res) => {
    const reviewed_applications = await ReviewApplications.findAll({
        where:{
            department: req.params.id
        }
    });
    res.json(reviewed_applications);
}

export const GetCourseFilteredReviewedApplications = async (req, res) => {
    const reviewed_applications = await ReviewApplications.findAll({
        where:{
            course: req.params.id
        }
    });
    res.json(reviewed_applications);
}

export const GetMultipleFilteredReviewedApplications = async (req, res) => {
    const reviewed_applications = await ReviewApplications.findAll({
        where:{
            department: req.params.dept,
            course: req.params.course,
            [Op.or]:[
                {student_id:{[Op.like]: '%' + req.params.id + '%'}},
                {first_name: {[Op.like]: '%' + req.params.id + '%'}},
                {last_name: {[Op.like]: '%' + req.params.id + '%'}},
                Sequelize.where(Sequelize.fn('concat', Sequelize.col('first_name'), ' ', Sequelize.col('last_name')), {
                    [Op.like]: '%' + req.params.id + '%'
                }),
                Sequelize.where(Sequelize.fn('concat', Sequelize.col('last_name'), ' ', Sequelize.col('first_name')), {
                    [Op.like]: '%' + req.params.id + '%'
                })
            ]
            
        }
    });
    res.json(reviewed_applications);
}
export const GetNameDeptFilteredReviewedApplications = async (req, res) => {
    const reviewed_applications = await ReviewApplications.findAll({
        where:{
            department: req.params.dept,
            [Op.or]:[
                {student_id:{[Op.like]: '%' + req.params.id + '%'}},
                {first_name: {[Op.like]: '%' + req.params.id + '%'}},
                {last_name: {[Op.like]: '%' + req.params.id + '%'}},
                Sequelize.where(Sequelize.fn('concat', Sequelize.col('first_name'), ' ', Sequelize.col('last_name')), {
                    [Op.like]: '%' + req.params.id + '%'
                }),
                Sequelize.where(Sequelize.fn('concat', Sequelize.col('last_name'), ' ', Sequelize.col('first_name')), {
                    [Op.like]: '%' + req.params.id + '%'
                })
            ]
            
        }
    });
    res.json(reviewed_applications);
}

export const GetMultipleFilteredApprovedApplications = async (req, res) => {
    const reviewed_applications = await ApprovedApplications.findAll({
        where:{
            department: req.params.dept,
            course: req.params.course,
            [Op.or]:[
                {student_id:{[Op.like]: '%' + req.params.id + '%'}},
                {first_name: {[Op.like]: '%' + req.params.id + '%'}},
                {last_name: {[Op.like]: '%' + req.params.id + '%'}},
                Sequelize.where(Sequelize.fn('concat', Sequelize.col('first_name'), ' ', Sequelize.col('last_name')), {
                    [Op.like]: '%' + req.params.id + '%'
                }),
                Sequelize.where(Sequelize.fn('concat', Sequelize.col('last_name'), ' ', Sequelize.col('first_name')), {
                    [Op.like]: '%' + req.params.id + '%'
                })
            ]
            
        }
    });
    res.json(reviewed_applications);
}
export const GetNameDeptFilteredApprovedApplications = async (req, res) => {
    const reviewed_applications = await ApprovedApplications.findAll({
        where:{
            department: req.params.dept,
            [Op.or]:[
                {student_id:{[Op.like]: '%' + req.params.id + '%'}},
                {first_name: {[Op.like]: '%' + req.params.id + '%'}},
                {last_name: {[Op.like]: '%' + req.params.id + '%'}},
                Sequelize.where(Sequelize.fn('concat', Sequelize.col('first_name'), ' ', Sequelize.col('last_name')), {
                    [Op.like]: '%' + req.params.id + '%'
                }),
                Sequelize.where(Sequelize.fn('concat', Sequelize.col('last_name'), ' ', Sequelize.col('first_name')), {
                    [Op.like]: '%' + req.params.id + '%'
                })
            ]
            
        }
    });
    res.json(reviewed_applications);
}

export const GetSpecificReviewedApplication = async (req, res) => {
    const specific_application = await ReviewApplications.findOne({
        where:{
            id: req.params.id
        }
    });
    res.json(specific_application);
}

export const DeleteReviewedApplication = async (req, res) => {
    try {
        await ReviewApplications.destroy({
            where: {
                id: req.params.id
            }
        });
        res.json({
            msg: "Application Deleted"
        });
    } catch (error) {
        res.json({ message: error.message });
    }  
}


export const CreateApprovedApplication = async (req, res) => {
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
        admin_sign,
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
        await ApprovedApplications.create({
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
            admin_sign: admin_sign,
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


export const GetApprovedApplications = async (req, res) => {
    const reviewed_applications = await ApprovedApplications.findAll({
    });
    res.json(reviewed_applications);
}

export const GetApprovedSearchedApplications = async (req, res) => {
    const reviewed_applications = await ApprovedApplications.findAll({
        where:{

            [Op.or]:[
                {student_id:{[Op.like]: '%' + req.params.id + '%'}},
                {first_name: {[Op.like]: '%' + req.params.id + '%'}},
                {last_name: {[Op.like]: '%' + req.params.id + '%'}},
                Sequelize.where(Sequelize.fn('concat', Sequelize.col('first_name'), ' ', Sequelize.col('last_name')), {
                    [Op.like]: '%' + req.params.id + '%'
                }),
                Sequelize.where(Sequelize.fn('concat', Sequelize.col('last_name'), ' ', Sequelize.col('first_name')), {
                    [Op.like]: '%' + req.params.id + '%'
                })
            ]
        }
    });
    res.json(reviewed_applications);
}

export const GetDepartmentFilteredApprovedApplications = async (req, res) => {
    const reviewed_applications = await ApprovedApplications.findAll({
        where:{
            department: req.params.id
        }
    });
    res.json(reviewed_applications);
}


export const GetCourseFilteredApprovedApplications = async (req, res) => {
    const reviewed_applications = await ApprovedApplications.findAll({
        where:{
            course: req.params.id
        }
    });
    res.json(reviewed_applications);
}

export const GetSpecificApprovedApplication = async (req, res) => {
    const specific_application = await ApprovedApplications.findOne({
        where:{
            id: req.params.id
        }
    });
    res.json(specific_application);
}

export const DeleteApprovedApplication = async (req, res) => {
    try {
        await ApprovedApplications.destroy({
            where: {
                id: req.params.id
            }
        });
        res.json({
            msg: "Application Deleted"
        });
    } catch (error) {
        res.json({ message: error.message });
    }  
}

export const AdminCreateRejectedApplication = async (req, res) => {
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


export const GetRejectedApplications = async (req, res) => {
    const reviewed_applications = await RejectedApplications.findAll({
    });
    res.json(reviewed_applications);
}

export const GetDepartmentFilteredRejectedApplications = async (req, res) => {
    const reviewed_applications = await RejectedApplications.findAll({
        where:{
            department: req.params.id
        }
    });
    res.json(reviewed_applications);
}

export const GetCourseFilteredRejectedApplications = async (req, res) => {
    const reviewed_applications = await RejectedApplications.findAll({
        where:{
            course: req.params.id
        }
    });
    res.json(reviewed_applications);
}

export const GetSpecificRejectedApplication = async (req, res) => {
    const specific_application = await RejectedApplications.findOne({
        where:{
            id: req.params.id
        }
    });
    res.json(specific_application);
}

export const DeleteRejectedApplication = async (req, res) => {
    try {
        await RejectedApplications.destroy({
            where: {
                id: req.params.id
            }
        });
        res.json({
            msg: "Application Deleted"
        });
    } catch (error) {
        res.json({ message: error.message });
    }  
}