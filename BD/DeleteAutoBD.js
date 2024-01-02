const mysql = require('mysql2/promise');
const {Config_Test} = require('./config')


async function DeleteAutoBD(number) {
    const connectionTest = await mysql.createConnection(Config_Test);
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