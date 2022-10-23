import Deans from "../models/DeanModel.js";
import PendingDeans from "../models/PendingDeanModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
 
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
            "message": "Pending Dean Rejected"
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