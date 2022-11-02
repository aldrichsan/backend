import Admins from "../models/AdminModel.js" 
import Announcements from "../models/AnnouncementModel.js" 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ScholarshipInfo from "../models/ScholarshipInfoModel.js";
 
 
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
    const {title, body} = req.body;
    try {
        await Announcements.create({
            title: title,
            body: body
        });
        res.json({msg: "Added an announcements"});
    } catch (error) {
        console.log(error);
    }
}

export const GetAnnouncements = async(req, res) => {
    try {
        const announcements = await Announcements.findAll({
            attributes:['id', 'title','body']
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
        res.json({ message: error.message });
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
            "message": "Scholarship Deleted"
        });
    } catch (error) {
        res.json({ message: error.message });
    }  
}