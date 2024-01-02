const mysql = require('mysql2/promise');
const {Config_Test} = require('./config')


async function DeleteUserBD(email) {
    const connectionTest = await mysql.createConnection(Config_Test);
    try {
        const query = `UPDATE users SET is_deleted = TRUE WHERE email = ?`
        const result = await connectionTest.execute(query,[email]);
        return result;
    } catch (error) {
        throw new Error('Failed to delete car');
    }finally{
        await connectionTest.end();
    }
}









module.exports = {
    "DeleteUserBD":DeleteUserBD
}