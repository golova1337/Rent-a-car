const mysql = require('mysql2/promise');
const {Config_Test} = require('../config');


async function RentCar(number,email) {
    const connectionTest = await mysql.createConnection(Config_Test);
    try {
       await  connectionTest.beginTransaction();

       //проверяем если пользователь уже в таблицы аренды (имеет ли аренду)
       const queryCheckUser = 'SELECT * FROM rentals WHERE user_email = ?';
       const [rowsCheckUser, fieldsCheckUser] = await connectionTest.execute(queryCheckUser,[email]);
       if (rowsCheckUser.length !== 0) {
        throw new Error("you can not have two cars in rental")
       }

       //проверяем если машина уже в таблицы аренды (в аренде чы не)
       const queryCheckCar = 'SELECT * FROM rentals WHERE car_number = ?';
       const [rowsCheckCar, fieldsCheckCar] = await connectionTest.execute(queryCheckCar,[number]);
       if (rowsCheckCar.length !== 0) {
        throw new Error("you can not rent this car");
       }
        //проверяем не удаленная ли машина 
        const queryCheckCarDelet = 'SELECT * FROM cars WHERE number = ?';
        const [rowsCheckCarDelet,fieldsCheckCarDelet] = await connectionTest.execute(queryCheckCarDelet,[number]);
        if (rowsCheckCarDelet.length === 0 || rowsCheckCarDelet[0]['is_deleted'] === 1) {
            throw new Error("you can not rent this car");
        }

        await connectionTest.commit();

       
    } catch (error) {
        await connectionTest.rollback();
        throw new Error(`Failed to rent car: ${error.message}`);
    }finally{
        await connectionTest.end();
    }
}

module.exports = {
    "RentCar":RentCar
}