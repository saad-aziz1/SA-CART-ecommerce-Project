import User from "../models/userModels.js";
import bcrypt from 'bcryptjs';
import Joi from 'joi';
import { generateToken,  generateVerifyToken } from "../config/token.js";
import sendEmail from "../utils/sendEmail.js";

// 1. Validation Schema.
const signupSchema = Joi.object({
    firstName: Joi.string().min(2).max(30).pattern(/^[A-Za-z]+$/).required()
        .messages({ 'string.pattern.base': 'Please Enter Vaild Name.' }),
    lastName: Joi.string().min(2).max(30).pattern(/^[A-Za-z]+$/).required()
        .messages({ 'string.pattern.base': 'Please Enter Vaild Name.' }),
    email: Joi.string().email().required().lowercase().trim(),
    password: Joi.string().min(8).required()
});

export const SignUp = async (req, res) => {
    try {
        // Joi Validation
        const { error } = signupSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const { firstName, lastName, email, password } = req.body;

        // Existing User Check
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        // Password Hashing
    
        const hashPassword = await bcrypt.hash(password, 10);

        // User Creation
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashPassword
        });

        // token generate & parsing
        const token = generateToken(newUser._id)

        res.cookie('token', token,{
            httpOnly:true,
            secure:process.env.NODE_ENV,
            sameSite:"Strict",
            maxAge:7*24*60*60*1000
        })

        //Email verification
        const verifyToken = generateVerifyToken(newUser._id)
        console.log("Verification Token:", verifyToken)
        const verifyLink = `${process.env.BASE_URL}/api/user/verify-email?token=${verifyToken}`

        await sendEmail({
            to: newUser.email,
            subject: "verify your Email",
            html:`
                 <h2>Welcome ${newUser.firstName}</h2>
                <p>Please verify your email by clicking the link below:</p>
                <a href="${verifyLink}">Verify Email</a>
                <p>This link will expire in 15 minutes.</p>`
        })
        
        return res.status(201).json({
            success: true,
            message: "User SignUp Successfully",
            
            user: {
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error("SignUp Error:", error); 
        return res.status(500).json({
            success: false,
            message: "Internal Server Error" 
        });
    }
}