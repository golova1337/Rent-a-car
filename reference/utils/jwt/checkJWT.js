const { VerifyJWT } = require("./verifyJWT");
const jwt = {
  checkJWT: async (req, res, next) => {
    try {
      if (!req.headers.authorization) {
        return res.status(403).json({ message: "There is no token" });
      }
      await VerifyJWT(req.headers.authorization);
      next();
    } catch (error) {
      return res.status(401).json({ message: error.message }).end();
    }
  },
  checkJWTSuperadmin: async (req, res, next) => {
    try {
      if (!req.headers.authorization) {
        return res.status(403).json({ message: "There is no token" });
      }
      const result = await VerifyJWT(req.headers.authorization);
      if (result.role !== "superadmin") {
        res.status(401).json({ message: "you are not superadmin" }).end();
      }
      next();
    } catch (error) {
      res.status(401).json({ message: error.message }).end();
    }
  },
  checkJWTadmin: async (req, res, next) => {
    try {
      if (!req.headers.authorization) {
        res.status(403).json({ message: "There is no token" });
      }
      const result = await VerifyJWT(req.headers.authorization);
      if (result.role !== "admin") {
        res.status(401).json({ message: "verification was unsuccessful" }).end();
      }
      next();
    } catch (error) {
      res.status(401).json({ message: error.message }).end();
    }
  },
};
module.exports = { jwt };
// const checkJWT = async (req, res, next) => {
//   try {
//     if (!req.headers.authorization) {
//       return res.status(403).json({ message: "There is no token" });
//     }
//     await VerifyJWT(req.headers.authorization);
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: error.message }).end();
//   }
// };
// const checkJWTSuperadmin = async (req, res, next) => {
//   try {
//     if (!req.headers.authorization) {
//       return res.status(403).json({ message: "There is no token" });
//     }
//     const result = await VerifyJWT(req.headers.authorization);
//     if (result.role !== "superadmin") {
//       res.status(401).json({ message: "you are not superadmin" }).end();
//     }
//     next();
//   } catch (error) {
//     res.status(401).json({ message: error.message }).end();
//   }
// };
// const checkJWTadmin = async (req, res, next) => {
//   try {
//     if (!req.headers.authorization) {
//       res.status(403).json({ message: "There is no token" });
//     }
//     const result = await VerifyJWT(req.headers.authorization);
//     if (result.role !== "admin") {
//       res.status(401).json({ message: "verification was unsuccessful" }).end();
//     }
//     next();
//   } catch (error) {
//     res.status(401).json({ message: error.message }).end();
//   }
// };

// module.exports = {
//   checkJWT,
//   checkJWTSuperadmin,
//   checkJWTadmin,
// };
