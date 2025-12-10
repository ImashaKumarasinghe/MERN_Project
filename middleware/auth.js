import jwt from "jsonwebtoken";

export function auth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.user = decoded; // attach user to request
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}
