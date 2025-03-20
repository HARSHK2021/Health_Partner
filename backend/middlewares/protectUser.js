import jwt from "jsonwebtoken";
import User from "../models/User.js";

 const protectUser = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        // Verify token and get user
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user; // Attach user to request
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Token is invalid or expired" });
    }
};
export default protectUser;