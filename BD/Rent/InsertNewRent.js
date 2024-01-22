const mysql = require('mysql2/promise');
const {development} = require('../../knexfile');



async function InsertNewRent(data) {
    const connectionTest = await mysql.createConnection(development.connection);
    try {
        await connectionTest.beginTransaction(); // Начало транзакции
        const queryInsert = 'INSERT INTO rentals (user_email,car_number, start_date, end_date) VALUES (?, ?, ?, ?)';
        const resultInsert = await connectionTest.execute(queryInsert,data);

        const queryInRenting = 'UPDATE cars SET in_renting = true WHERE number = ?';
        const resultInRenting = await connectionTest.execute(queryInRenting,[data[1]]);
        await connectionTest.commit();
        return;
    } catch (error) {
        await connectionTest.rollback(); // Откат транзакции при ошибке
        throw new Error('Failed to rent car')
    }
}

module.exports = {
    "InsertNewRent":InsertNewRent
}