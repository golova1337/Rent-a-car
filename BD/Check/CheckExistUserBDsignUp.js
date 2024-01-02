const mysql = require('mysql2/promise')
const {Config_Test} = require('../config')


async function CheckExistUserBDsignUp(email) {
    const connectionTest = await mysql.createConnection(Config_Test);
try {
    const [rowsUser, fieldsUser] = await connectionTest.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (rowsUser.length>0) {
        throw new Error('You exist')
    }
    return;
} catch (error) {
    throw error.message;
}finally{
    await connectionTest.end();
}
}

module.exports = {
    "CheckExistUserBDsignUp":CheckExistUserBDsignUp
}