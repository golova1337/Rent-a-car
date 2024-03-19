const { verifyJwt } = require("../../utils/jwt/verifyJwt");

class Jwt {
  static check(req, res, next) {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Authorization header is missing" });
    }
    try {
      const decoded = verifyJwt(req.headers.authorization);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: error.message }).end();
    }
  }

  static Role(roles) {
    return (req, res, next) => {
      if (roles.includes(req.user.role)) {
        next();
      } else {
        return res.status(403).json({ message: "sufficient privileges" });
      }
    };
  }
}

module.exports = Jwt;
