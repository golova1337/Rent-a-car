const bcrypt = require("bcrypt");

async function HashingPassword(password) {
  return await bcrypt.hash(password, 10);
}

module.exports = {
  HashingPassword,
};
