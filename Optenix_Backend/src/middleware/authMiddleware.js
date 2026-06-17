// authMiddleware.js
import jwt from "jsonwebtoken";

 const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    try {
      if (!req || !req.headers) {
        return res.status(401).json({ message: "Invalid request" });
      }

      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden: insufficient role" });
      }

      next();
    } catch (error) {
      console.error("Auth middleware error:", error.message);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};
export default authMiddleware;