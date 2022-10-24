import Admins from "../models/AdminModel.js";
import jwt from "jsonwebtoken";
 
export const AdminRefreshToken = async(req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(401);
        const admin = await Admins.findAll({
            where:{
                refresh_token: refreshToken
            }
        });
        if(!admin[0]) return res.sendStatus(403);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if(err) return res.sendStatus(403);
            const adminId = admin[0].admin_id;
            const first_name = admin[0].first_name;
            const last_name = admin[0].last_name;
            const email = admin[0].email;
            const accessToken = jwt.sign({adminId, first_name, last_name, email}, process.env.ACCESS_TOKEN_SECRET,{
                expiresIn: '15s'
            });
            res.json({ accessToken });
        });
    } catch (error) {
        console.log(error);
    }
}