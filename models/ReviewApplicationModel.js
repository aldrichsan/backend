import { INTEGER, Sequelize, STRING, TEXT } from "sequelize";
import db from "../config/Database.js";
 
const { DataTypes } = Sequelize;
 
const ReviewApplications = db.define('review_applications',{
    id:{
        type: INTEGER,
        primaryKey: true
    },
    date_submitted:{
        type: DataTypes.STRING
    },
    student_id:{
        type: DataTypes.STRING
    },
    first_name:{
        type: DataTypes.STRING
    },
    last_name:{
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
        type: DataTypes.STRING
    },
    semester:{
        type: DataTypes.STRING
    },
    school_year:{
        type: DataTypes.STRING
    },
    student_sign:{
        type: DataTypes.TEXT('medium')
    },
    dean_sign:{
        type: DataTypes.TEXT('medium')
    },
    admin_sign:{
        type: DataTypes.TEXT('medium')
    },
    scholarship_type:{
        type: DataTypes.STRING
    },
    subj_1:{
        type: DataTypes.STRING
    },
    subj_2:{
        type: DataTypes.STRING
    },
    subj_3:{
        type: DataTypes.STRING
    },
    subj_4:{
        type: DataTypes.STRING
    },
    subj_5:{
        type: DataTypes.STRING
    },
    subj_6:{
        type: DataTypes.STRING
    },
    subj_7:{
        type: DataTypes.STRING
    },
    subj_8:{
        type: DataTypes.STRING
    },
    subj_9:{
        type: DataTypes.STRING
    },
    subj_10:{
        type: DataTypes.STRING
    },
    subj_11:{
        type: DataTypes.STRING
    },
    subj_12:{
        type: DataTypes.STRING
    },
    units_1:{
        type: DataTypes.INTEGER
    },
    units_2:{
        type: DataTypes.INTEGER
    },
    units_3:{
        type: DataTypes.INTEGER
    },
    units_4:{
        type: DataTypes.INTEGER
    },
    units_5:{
        type: DataTypes.INTEGER
    },
    units_6:{
        type: DataTypes.INTEGER
    },
    units_7:{
        type: DataTypes.INTEGER
    },
    units_8:{
        type: DataTypes.INTEGER
    },
    units_9:{
        type: DataTypes.INTEGER
    },
    units_10:{
        type: DataTypes.INTEGER
    },
    units_11:{
        type: DataTypes.INTEGER
    },
    units_12:{
        type: DataTypes.INTEGER
    },
    req_1:{
        type: DataTypes.TEXT('medium')
    },
    req_2:{
        type: DataTypes.TEXT('medium')
    },
    req_3:{
        type: DataTypes.TEXT('medium')
    },
    req_4:{
        type: DataTypes.TEXT('medium')
    },
    req_5:{
        type: DataTypes.TEXT('medium')
    },
    req_6:{
        type: DataTypes.TEXT('medium')
    },
    req_7:{
        type: DataTypes.TEXT('medium')
    },
    req_8:{
        type: DataTypes.TEXT('medium')
    },
    req_9:{
        type: DataTypes.TEXT('medium')
    },
    req_10:{
        type: DataTypes.TEXT('medium')
    },
},{
    freezeTableName:true
});
 
(async () => {
    await db.authenticate();
})();
 
export default ReviewApplications;