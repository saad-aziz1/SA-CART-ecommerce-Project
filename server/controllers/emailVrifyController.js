import jwt from 'jsonwebtoken';
import User from '../models/userModels.js';

export const verifyEmail = async (req, res) => {
    try {
        const {token} = req.query;
        if (!token) {
            return res.status(400).json({ success: false, message: "Token missing" });
        }

        // verify token
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

        if (decoded.purpose !== "emailVerify") {
            return res.status(400).json({ success: false, message: "Invalid token" });
        }

        // find user and update
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(200).json({ success: true, message: "Email already verified" });
        }

        user.isVerified = true;
        await user.save();

        return res.redirect("http://localhost:5173/login")

    } catch (error) {
        console.error("Email verification error:", error);
        return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }
}
