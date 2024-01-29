async function IncludeLettersBd(knex,params) {
    try {
        const query = knex('cars').select('brand', 'model', 'year', 'price');

        if (params.brand.trim().length !== 0) {
        query.whereILike('brand', `%${params.brand}%`);
        }

        if (params.model.trim().length !== 0) {
        query.andWhereILike('model', `%${params.model}%`);
        }
        const result = await query;
        return result
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {
    IncludeLettersBd
}