import { verify } from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header required' });
    }
    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Invalid authorization format' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = verify(token, process.env.JWT_SECRET);
        req.user = decoded; // id, role
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};