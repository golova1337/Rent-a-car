const mysql = require('mysql2/promise');
const {development} = require('../knexfile');


async function getAllUsersBd(params) {
    const connectionTest = await mysql.createConnection(development.connection);
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