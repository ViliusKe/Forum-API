import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "Authorization problems (no token)",
    });
  }

  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: "Authorization problems (bad token)",
      });
    }

    req.body = req.body || {};
    req.userId = decoded.userId;

    return next();
  });
};

export default auth;
