require("dotenv").config();
const jwt = require("jsonwebtoken");
class JwtHelper {
  async createJwt(id, role) {
    const payload = {
      id: id,
      role: role,
    };
    return jwt.sign(payload, process.env.SECRET_KEY_FOR_JWT, { expiresIn: "1h", algorithm: "HS256" });
  }

  verifyJwt(token) {
    const decoded = jwt.verify(token, SecretKey);
    return decoded;
  }
}

module.exports = new JwtHelper();
