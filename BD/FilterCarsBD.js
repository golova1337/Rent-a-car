const mysql = require('mysql2/promise');
const {Config_Test} = require('./config');

async function FilterCarsBD(query,params) {
    const connectionTest = await mysql.createConnection(Config_Test);
    try {
        const [rows, fields] = await connectionTest.execute(query,params);
        const newArray = rows.map(({Brand,Model,Year,Price})=>({Brand,Model,Year,Price}))
        return newArray
    } catch (error) {
        throw new Error('something went wrong')
    }finally{
        await connectionTest.end()
    }
}

module.exports ={
    "FilterCarsBD":FilterCarsBD
}