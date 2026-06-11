const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  let token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token." });
  }

  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length).trim();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    if (req.user.status === "Inactive") {
      return res
        .status(403)
        .json({ error: "Access denied. Account is inactive." });
    }

    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
}

function adminOnly(req, res, next) {
  if (req.user && req.user.role === "Admin") {
    next();
  } else {
    res
      .status(403)
      .json({ error: "Access denied. Admin permissions required." });
  }
}

module.exports = { authMiddleware, adminOnly };
