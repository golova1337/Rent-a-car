const mysql = require('mysql2/promise')
const {development} = require('../../knexfile');


async function CheckExistUserBDlogin(email) {
    const connectionTest = await mysql.createConnection(development.connection);
    try {
        const [rowsUser, fieldsUser] = await connectionTest.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (rowsUser.length === 0) {
            throw new Error('you dont exist') // Користувача не знайденно 
        }
        //
        if (rowsUser[0]['is_deleted'] === 1) {
            throw new Error('you can not log up')
        }
        //
        const [rowsPassword, fieldsPassword] = await connectionTest.execute('SELECT * FROM user_passwords WHERE user_id = ?', [rowsUser[0].id]);
        console.log(rowsPassword);
        if (rowsPassword.length === 0) {
            throw new Error('Password could not be found'); // Пароль для цього користувача не знайдено
        };
        //
        const data = {
            emailUser: rowsUser[0].email,
            roleUser: rowsUser[0].role,
            passwordUser: rowsPassword[0].password_hash
        }
        //
        return data ;
    } catch (error) {
        throw new Error(error.message); 
    }finally{
        await connectionTest.end();
    }
     
}



module.exports = {
    "CheckExistUserBDlogin" : CheckExistUserBDlogin
}