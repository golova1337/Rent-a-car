async function CheckExistUserBDsignUp(knex,email) {
    const rowsUser = await knex.select('*')
                                .from('users')
                                .where({'email':email});
    if (rowsUser.length>0) throw new Error('You exist');
}

module.exports = {
    CheckExistUserBDsignUp
}