const jwt = require("jsonwebtoken");
const secretKey = require("./secretKeyJwt");

async function VerifyJWT(token) {
  const result = await jwt.verify(token, secretKey);
  return result;
}

module.exports = {
  VerifyJWT,
};
