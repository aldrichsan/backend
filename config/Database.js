import { Sequelize } from "sequelize";
 
const db = new Sequelize('wup_scholar_db', 'root', '', {
    host: "localhost",
    dialect: "mysql"
});
 
export default db;