import { Sequelize } from "sequelize";
import db from "../config/Database.js";
 
const { DataTypes } = Sequelize;
 
const PendingStudents = db.define('pending_reg_students',{
    last_name:{
        type: DataTypes.STRING
    },
    first_name:{
        type: DataTypes.STRING
    },
    middle_name:{
        type: DataTypes.STRING
    },
    contact_no:{
        type: DataTypes.STRING
    },
    email:{
        type: DataTypes.STRING
    },
    department:{
        type: DataTypes.STRING
    },
    course:{
        type: DataTypes.STRING
    },
    year:{
        type: DataTypes.INTEGER
    },
    student_id:{
        type: DataTypes.STRING
    },
    password:{
        type: DataTypes.STRING
    }
},{
    freezeTableName:true
});
 
(async () => {
    await db.sync();
})();
 
export default PendingStudents;