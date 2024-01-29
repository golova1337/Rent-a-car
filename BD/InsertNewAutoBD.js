

async function InsertNewAutoBD(knex,brand,model,number_plate,price,year) {
    try {
        const resultInsertBody = await knex('cars').insert({
            'brand': brand,
            'model':model,
            'year':year,
            'number_plate': number_plate,
            'price':price
          });
        return;
    } catch (error) {
        throw  (error)
    }
}

module.exports = {
    InsertNewAutoBD
}