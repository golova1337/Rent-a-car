const jwtHelper = require("../../helpers/jwt/jwt.helper");

class Jwt {
  check(req, res, next) {
    const token = req.headers.authorization;
    try {
      if (!token || !token.split(" ")[0]) {
        return res.status(401).json({ message: "Authorization header is missing" });
      }
      const authToken = req.headers.authorization.split(" ")[1];
      const decoded = jwtHelper.verifyJwt(authToken);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: error.message }).end();
    }
  }

  Role(roles) {
    return (req, res, next) => {
      if (roles.includes(req.user.role)) {
        next();
      } else {
        return res.status(403).json({ message: "sufficient privileges" });
      }
    };
  }
}

module.exports = new Jwt();
