const mysql = require('mysql2/promise');
const {Config_Test} = require('./config');



async function GetAllCarsBd() {
    const connectionTest = await mysql.createConnection(Config_Test);
    try {
        const queryGetAllCars = "SELECT * FROM cars Where in_renting = 0 AND is_deleted = 0"
        const [resultGetAllCars] = await connectionTest.execute(queryGetAllCars)
        const newArray = resultGetAllCars.map(({Brand,Model,Year,Price})=>({Brand,Model,Year,Price}))
        return newArray
    } catch (error) {
        throw new Error('something went wrong');
    }
}

module.exports = {
    "GetAllCarsBd" : GetAllCarsBd
}