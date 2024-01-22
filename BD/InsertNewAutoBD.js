const mysql = require('mysql2/promise');
const {development} = require('../knexfile');


async function InsertNewAutoBD(Brand,Model,Number,Price,Year) {
    const connectionTest = await mysql.createConnection(development.connection);
    try {
        const query = 'Insert INTO Cars (Brand,Model,Number,Year,Price) VALUES (?,?,?,?,?)';
        const [result] = await connectionTest.execute(query,[Brand,Model,Number,Year,Price]);
        return result;
    } catch (error) {
        throw new Error (error)
    }finally{
        await connectionTest.end()
    }
}

module.exports = {
    "InsertNewAutoBD":InsertNewAutoBD
}