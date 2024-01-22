const mysql = require('mysql2/promise');
const {development} = require('../knexfile');


async function returnCarBd(number,endTime) {
    const connectionTest = await mysql.createConnection(development.connection);
    try {
        await connectionTest.beginTransaction(); 
        const querySelect = 'SELECT * FROM rentals WHERE car_number = ?';
        const [resultSelect] = await connectionTest.execute(querySelect,[number]);
        if (resultSelect.length === 0) {
            throw new Error('No rental found for this car number');
        }

        const queryInsert = 'INSERT INTO Archive_lease (email,car_number,start_date,end_date) VALUES(?,?,?,?)';
        const resultInRenting = await connectionTest.execute(queryInsert,[
            resultSelect[0].user_email
            ,resultSelect[0].car_number,
            resultSelect[0].start_date,
            endTime
        ]);
        if (resultInRenting.affectedRows === 0) {
            throw new Error('Failed to archive the rental');
        }

        const queryDeleteRental = 'DELETE FROM rentals WHERE  car_number = ?';
        const resultDeleted = await connectionTest.execute(queryDeleteRental,[number]);
        if (resultDeleted.affectedRows === 0) {
            throw new Error('Failed to delete rental');
        }

        const queryInRenting = 'UPDATE cars SET in_renting = false WHERE number = ?';
        const resultReturnInRenting = await connectionTest.execute(queryInRenting,[number]);
        if (resultReturnInRenting.affectedRows === 0) {
            throw new Error('Failed to update car status');
        }


        await connectionTest.commit();
        return 'Car rental successfully returned';
    } catch (error) {
        await connectionTest.rollback(); // Откат транзакции при ошибке
        throw new Error(`Failed to return car: ${error.message}`);
    }
}

module.exports={
    "returnCarBd":returnCarBd
}