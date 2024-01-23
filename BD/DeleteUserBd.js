const mysql = require('mysql2/promise');
const {development} = require('../knexfile');


async function DeleteUserBD(email) {
    const connectionTest = await mysql.createConnection(development.connection);
    try {
        const query = `UPDATE Cars SET is_deleted = TRUE WHERE number = ?`
        const result = await connectionTest.execute(query,[number]);
        return result;
    } catch (error) {
        throw new Error('Failed to delete car');
    }finally{
        await connectionTest.end();
    }
}


module.exports = {
    'DeleteAutoBD':DeleteAutoBD
}