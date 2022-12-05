import { Sequelize } from "sequelize";
import db from "../config/Database.js";
 
const { DataTypes } = Sequelize;
 
const Announcements = db.define('announcements',{
    title:{
        type: DataTypes.STRING
    },
    body:{
        type: DataTypes.TEXT
    },
    image:{
        type: DataTypes.TEXT('medium')
    }
},{
    freezeTableName:true
});
 
(async () => {
    await db.sync();
})();
 
export default Announcements;