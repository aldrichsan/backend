import Deans from "../models/DeanModel.js";
import jwt from "jsonwebtoken";
 
export const DeanRefreshToken = async(req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(401);
        const dean = await Deans.findAll({
            where:{
                refresh_token: refreshToken
            }
        });
        if(!dean[0]) return res.sendStatus(403);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if(err) return res.sendStatus(403);
            const deanId = dean[0].dean_id;
            const first_name = dean[0].first_name;
            const last_name = dean[0].last_name;
            const email = dean[0].email;
            const accessToken = jwt.sign({deanId, first_name, last_name, email}, process.env.ACCESS_TOKEN_SECRET,{
                expiresIn: '15s'
            });
            res.json({ accessToken });
        });
    } catch (error) {
        console.log(error);
    }
}