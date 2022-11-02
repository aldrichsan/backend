import { Sequelize } from "sequelize";
import db from "../config/Database.js";
 
const { DataTypes } = Sequelize;
 
const ScholarshipInfo = db.define('scholarships',{
    scholarship_name:{
        type: DataTypes.STRING
    },
    description:{
        type: DataTypes.TEXT
    },
    requirements:{
        type: DataTypes.TEXT
    }
},{
    freezeTableName:true
});
 
(async () => {
    await db.sync();
})();
 
export default ScholarshipInfo;