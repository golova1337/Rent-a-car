const mysql = require('mysql2/promise');
const {development} = require('../knexfile');



async function GetAllCarsBd() {
    const connectionTest = await mysql.createConnection(development.connection);
    try {
        const queryGetAllCars = "SELECT * FROM cars Where in_renting = 0 AND is_deleted = 0"
        const [resultGetAllCars] = await connectionTest.execute(queryGetAllCars)
        console.log(resultGetAllCars);
        const newArray = resultGetAllCars.map(({brand,model,year,price})=>({brand,model,year,price}))
        return newArray
    } catch (error) {
        throw new Error('something went wrong');
    }
}

module.exports = {
    "GetAllCarsBd" : GetAllCarsBd
}