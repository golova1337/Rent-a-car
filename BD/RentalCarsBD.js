const mysql = require('mysql2/promise');
const {development} = require('../knexfile');

async function RentalCarsBD() {
    const connectionTest = await mysql.createConnection(development.connection);
    try {
        const query = 'SELECT * FROM `Cars` WHERE  in_renting = 1'
        const [rows, fields] = await connectionTest.execute(query);
        const newArray = rows.map(({Brand,Model,Year,Price})=>({Brand,Model,Year,Price}))
        return newArray
    } catch (error) {
        throw new Error('something went wrong')
    }finally{
        await connectionTest.end()
    }
}

module.exports ={
    "RentalCarsBD":RentalCarsBD
}