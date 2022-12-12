import { Sequelize } from "sequelize";
 
const db = new Sequelize('wup_scholar_db', 'root', 'aldrich123', {
    host: "localhost",
    dialect: "mysql",
    port: '3306'
    
});
 
export default db;