require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthHelpers {
  static async comparePassword(myPlaintextPassword, hash) {
    return bcrypt.compare(myPlaintextPassword, hash);
  }

  static async hash(password) {
    if (!password) throw new Error();
    return bcrypt.hash(password, 10);
  }

  static async createJwt(id, role) {
    const payload = {
      id: id,
      role: role,
    };
    return jwt.sign(payload, process.env.SECRET_KEY_FOR_JWT, { expiresIn: "1h", algorithm: "HS256" });
  }

  static verifyJwt(token) {
    return jwt.verify(token, process.env.SECRET_KEY_FOR_JWT);
  }
}
module.exports = AuthHelpers;
