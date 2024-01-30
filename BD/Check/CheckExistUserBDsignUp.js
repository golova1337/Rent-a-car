async function CheckExistUserBDsignUp(knex,email) {
   try {
    const rowsUser = await knex.select('*')
                                .from('users')
                                .where({'email':email});
    if (rowsUser.length>0) throw new Error('You exist');
   } catch (error) {
        throw error;
   }
}

module.exports = {
    CheckExistUserBDsignUp
}