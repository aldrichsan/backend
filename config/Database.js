import { Sequelize } from "sequelize";
 
const db = new Sequelize('online_wup_scholar', 'root', '', {
    host: "localhost",
    dialect: "mysql",
    port: '3306'
    
});
 
export default db;