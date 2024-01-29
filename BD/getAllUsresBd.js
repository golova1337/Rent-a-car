

async function getAllUsersBd(knex,role) {
        try {
            const getAllUsers = await knex.select('name','last_name','email')
                                            .from('users')
                                            .where({
                                                'role':role,
                                                'is_deleted':false
                                            });
            return getAllUsers
        } catch (error) {
            throw new Error (error)
        }

}

module.exports = {
    getAllUsersBd
}