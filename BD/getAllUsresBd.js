const mysql = require('mysql2/promise');
const {Config_Test} = require('./config');


async function getAllUsersBd(params) {
    const connectionTest = await mysql.createConnection(Config_Test);
    try {
        const query = 'SELECT * FROM users WHERE is_deleted = 0 AND role = "user" ';
        const [rows] = await connectionTest.execute(query);
        return rows;
    } catch (error) {
        throw error
    }finally{
        await connectionTest.end();
    }
}

module.exports = {
    "getAllUsersBd":getAllUsersBd
}