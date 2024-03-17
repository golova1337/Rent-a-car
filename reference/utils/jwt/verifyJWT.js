const jwt = require("jsonwebtoken");
const secretKey = require("./secretKeyJwt");

function verifyJwt(token) {
  const decoded = jwt.verify(token, secretKey);
  return decoded;
}

module.exports = {
  verifyJwt,
};
