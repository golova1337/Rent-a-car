const mysql = require('mysql2/promise')
const {development} = require('../knexfile');


async function InsertUser(name,lastName,email,password,role){
    const connectionTest = await mysql.createConnection(development.connection);
    try {
        await connectionTest.beginTransaction()
        const queryInsertBody = 'INSERT INTO Users (name, lastName, email,role) VALUES (?, ?, ?, ?)'
        const [resultInsertBody] = await connectionTest.execute(queryInsertBody, [name, lastName, email,role]);
        const user_id = resultInsertBody.insertId
        //
        const queryInsertPassword = 'INSERT INTO user_passwords (user_id, password_hash) VALUES (?, ?)';
        const [resultInsertPassword] = await connectionTest.execute(queryInsertPassword, [user_id, password]);
        await connectionTest.commit();
    } catch (error) {
        await connectionTest.rollback();
        throw new Error ('insertion was failed')
    }finally{
        await connectionTest.end();
    }
}


module.exports = {
    "InsertUser" : InsertUser
}