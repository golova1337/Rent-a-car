async function DeleteUserBD(knex,email) {
       try {
        const result = await knex('users')
                                .where({'email': email})
                                .update({'is_deleted':true});
        return;
       } catch (error) {
                throw new Error (error)
       }
}


module.exports = {
    DeleteUserBD
}