import { INTEGER, Sequelize, STRING, TEXT } from "sequelize";
import db from "../config/Database.js";
 
const { DataTypes } = Sequelize;
 
const SubmittedApplications = db.define('submitted_applications',{
    student_id:{
        type: DataTypes.STRING
    },
    first_name:{
        type: DataTypes.STRING
    },
    last_name:{
        type: DataTypes.STRING
    },
    student_sign:{
        type: DataTypes.TEXT
    },
    dean_sign:{
        type: DataTypes.TEXT
    },
    admin_sign:{
        type: DataTypes.TEXT
    },
    scholarship_name:{
        type: DataTypes.STRING
    },
    subj_codes:{
        type: DataTypes.ARRAY(STRING)
    },
    subj_units:{
        type: DataTypes.ARRAY(INTEGER)
    },
    req_1:{
        type: DataTypes.TEXT
    },
    req_2:{
        type: DataTypes.TEXT
    },
    req_3:{
        type: DataTypes.TEXT
    },
    req_4:{
        type: DataTypes.TEXT
    },
    req_5:{
        type: DataTypes.TEXT
    },
},{
    freezeTableName:true
});
 
(async () => {
    await db.sync();
})();
 
export default SubmittedApplications;