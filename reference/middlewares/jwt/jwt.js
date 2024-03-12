const { verifyJwt } = require("../../utils/jwt/verifyJwt");
const checkJwt = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Authorization header is missing" });
  }
  try {
    const decoded = await verifyJwt(req.headers.authorization);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: error.message }).end();
  }
};

const checkRole = (role) => {
  return (req, res, next) => {
    // if (!req.user) {
    //   return res.status(403).json({ message: "sufficient privileges" });
    // }
    if (req.user.role !== role) {
      return res.status(403).json({ message: "sufficient privileges" });
    }
    next();
  };
};

module.exports = { checkJwt, checkRole };
