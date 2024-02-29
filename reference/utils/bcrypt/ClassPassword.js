const bcrypt = require("bcrypt");

class PasswordManaged {
  async comparePassword(myPlaintextPassword, hash) {
    const result = await bcrypt.compare(myPlaintextPassword, hash);
    if (result !== true) throw new Error("Password is wrong");
  }

  async hashingPassword(password) {
    const result = await bcrypt.hash(password, 10);
    return result;
  }
}

module.exports = new PasswordManaged();
