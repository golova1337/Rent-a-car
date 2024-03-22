const bcrypt = require("bcrypt");

async function comparePassword(myPlaintextPassword, hash) {
  const result = await bcrypt.compare(myPlaintextPassword, hash);
  if (!result) throw new Error("Password is incorrect");
}

async function hashingPassword(password) {
  if (!password) throw new Error("Error hashing password");
  return bcrypt.hash(password, 10);
}
module.exports = { comparePassword, hashingPassword };
