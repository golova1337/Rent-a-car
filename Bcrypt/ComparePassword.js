const bcrypt = require("bcrypt");

async function ComparePassword(myPlaintextPassword, hash) {
  const result = await bcrypt.compare(myPlaintextPassword, hash);
  return result;
}
module.exports = {
  ComparePassword,
};
