const jwt = require("jsonwebtoken");
const SecretKey = require("./secretKeyJwt");

async function createJwt(id, role) {
  try {
    const payload = {
      id: id,
      role: role,
    };
    const token = await jwt.sign(payload, SecretKey, { expiresIn: "1h" });
    return token;
  } catch (error) {
    throw new Error("Failed to create JWT"); // Пример обработки ошибки
  }
}

module.exports = {
  createJwt,
};
