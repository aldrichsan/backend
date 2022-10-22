import { Sequelize } from "sequelize";
import db from "../config/Database.js";
 
const { DataTypes } = Sequelize;
 
const PendingDeans = db.define('pending_reg_deans',{
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
    dean_id:{
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
 
export default PendingDeans;