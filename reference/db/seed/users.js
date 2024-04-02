/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("users").del();
  await knex("users").insert([
    {
      id: 1,
      name: "Bob",
      lastname: "Sponge",
      email: "bobSponge@gmail.com",
      password_hash: "$2b$10$YsvddHMrHPirB2OVK.ALRehhyeDrfZF/QGf.QzpjOru6gJ3yMp3Wy",
      role: "superadmin",
    },
    {
      id: 2,
      name: "Patrick",
      lastname: "Star",
      email: "patrickstar@gmail.com",
      password_hash: "$2b$10$Pit98I09AjUMLYYMS9VoQORxK7a3xCYN54Hvdj2xAnqyES.4B/wJO",
      role: "user",
    },
    {
      id: 3,
      name: "Fiona",
      lastname: "Princess",
      email: "fionaprincess@gmail.com",
      password_hash: "$2b$10$Et7.aZiAw.KeLHnsI8nGSO5dBjzuqmEtKffyf6hPkl.EdDRnZnW1S",
      role: "user",
    },
    {
      id: 4,
      name: "Mickey",
      lastname: "Mouse",
      email: "mickeymouse@gmail.com",
      password_hash: "$2b$10$dSnIx8LI9OO2BengMZjCvOB9k55Lzdmkstoufi4vqbhkL2aG93orK",
      role: "user",
    },
    {
      id: 5,
      name: "Bugs",
      lastname: "Bunny",
      email: "bugsbunny@gmail.com",
      password_hash: "$2b$10$XOhMceri.Jkx7eoWCzFLye.jFSciIirzimFD6v2V59qRpuhQbGoNu",
      role: "admin",
    },
  ]);
};
