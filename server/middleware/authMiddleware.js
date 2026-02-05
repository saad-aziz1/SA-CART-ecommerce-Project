import jwt from 'jsonwebtoken'
import User from '../models/userModels.js'

export const isAuthorized = async (req, res, next) => {
  try {
    console.log("Cookies received:", req.cookies);

    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login first"
      });
    }

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expire token"
    });
  }
};
