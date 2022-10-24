import Admins from "../models/AdminModel.js" 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
 
 
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
    
    if(password.length < 8) return res.status(400).json({msg: "Password must be at least 8 characters"});
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