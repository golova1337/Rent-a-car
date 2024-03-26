const authHelpers = require("../../helpers/Auth.helpers");
const createError = require("http-errors");

class Jwt {
  check(req, res, next) {
    const token = req.headers.authorization;
    try {
      if (!token || !token.split(" ")[1]) {
        throw createError(401, "Unauthorized");
      }
      const authToken = req.headers.authorization.split(" ")[1];
      const decoded = authHelpers.verifyJwt(authToken);
      req.user = decoded;
      next();
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ error: error.message })
        .end();
    }
  }

  Role(roles) {
    return (req, res, next) => {
      if (roles.includes(req.user.role)) {
        next();
      } else {
        return res.status(403).json({ message: "Forbidden" });
      }
    };
  }
}

module.exports = new Jwt();
