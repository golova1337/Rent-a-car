const bcrypt = require("bcrypt");

async function comparePassword(myPlaintextPassword, hash) {
  const result = await bcrypt.compare(myPlaintextPassword, hash);
  if (!result) throw new Error("Password is wrong");
}

async function hashingPassword(password) {
  const result = await bcrypt.hash(password, 10);
  return result;
}

module.exports = { comparePassword, hashingPassword };
