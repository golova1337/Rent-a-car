const mysql = require('mysql2/promise');
const {Config_Test} = require('./config')


async function InsertNewAutoBD(Brand,Model,Number,Price,Year) {
    const connectionTest = await mysql.createConnection(Config_Test);
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