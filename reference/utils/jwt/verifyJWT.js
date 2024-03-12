const jwt = require("jsonwebtoken");
const secretKey = require("./secretKeyJwt");

async function verifyJwt(token) {
  const decoded = await jwt.verify(token, secretKey);
  return decoded;
}

module.exports = {
  verifyJwt,
};
