import jwt from "jsonwebtoken";
import HealthcareFacility from "../models/HealthcareFacility.js";

const protect = async (req, res, next) => {
    let token;

    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // Extract token
            token = req.headers.authorization.split(" ")[1];

            // Verify JWT
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find facility in DB (excluding password)
            req.facility = await HealthcareFacility.findById(decoded.id).select("-password");

            if (!req.facility) {
                return res.status(401).json({ message: "Facility not found" });
            }

            next(); // Allow access to protected routes
        } catch (error) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
    }

    // If no token, reject request
    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }
};

export default protect;
