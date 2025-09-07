// middleware/adminMiddleware.js
const adminMiddleware = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  // Accept either role === 'admin' OR explicit isAdmin flag
  if (req.user.role !== "admin" && !req.user.isAdmin) {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }

  next();
};

module.exports = { adminMiddleware };
