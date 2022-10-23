import Students from "../models/StudentModel.js";
import jwt from "jsonwebtoken";
 
export const StudentRefreshToken = async(req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(401);
        const student = await Students.findAll({
            where:{
                refresh_token: refreshToken
            }
        });
        if(!student[0]) return res.sendStatus(403);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if(err) return res.sendStatus(403);
            
            const studentId = student[0].student_id;
            const first_name = student[0].first_name;
            const last_name = student[0].last_name;
            const email = student[0].email;
            const accessToken = jwt.sign({studentId, first_name, last_name, email}, process.env.ACCESS_TOKEN_SECRET,{
                expiresIn: '15s'
            });
            res.json({ accessToken });
        });
    } catch (error) {
        console.log(error);
    }
}