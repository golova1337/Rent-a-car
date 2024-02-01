const bcrypt = require("bcrypt");

async function HashingPassword(password) {
  const result = await bcrypt.hash(password, 10);
  return result;
}

module.exports = {
  HashingPassword,
};
