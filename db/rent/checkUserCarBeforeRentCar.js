async function checkUserBeforeRentCar(knex, email) {
  try {
    //get id of user
    const getId = await knex("users").select("id").where({ email: email });
    // check is there such the user in table Rentals_Currently
    const checkUserInRentalsCurrently = await knex("rentals_currently").select("*").where({ user_id: getId[0]["id"] });
    if (checkUserInRentalsCurrently.length > 0) throw new Error("you can not have 2 rentals at the same time");
    return getId[0]["id"];
  } catch (error) {
    throw error;
  }
}

module.exports = {
  checkUserBeforeRentCar,
};
