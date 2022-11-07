import { INTEGER, Sequelize, STRING, TEXT } from "sequelize";
import db from "../config/Database.js";
 
const { DataTypes } = Sequelize;
 
const RejectedApplications = db.define('rejected_applications',{
    id:{
        type: INTEGER,
        primaryKey: true
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
    contact_no:{
        type: DataTypes.STRING
    },
    email:{
        type: DataTypes.STRING
    },
    department:{
        type: DataTypes.STRING
    },
    rejected_by:{
        type: DataTypes.STRING
    },
    reason_of_rejection:{
        type: DataTypes.TEXT
    }
},{
    freezeTableName:true
});
 
(async () => {
    await db.authenticate();
})();
 
export default RejectedApplications;