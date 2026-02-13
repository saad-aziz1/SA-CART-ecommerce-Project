import User from "../models/userModels.js";
import bcrypt from 'bcryptjs';
import Joi from 'joi';
import { generateToken, generateVerifyToken } from "../config/token.js";
import sendEmail from "../utils/sendEmail.js";
import cloudinary from "cloudinary";

//  Validation Schema.
const signupSchema = Joi.object({
    firstName: Joi.string().min(2).max(30).pattern(/^[A-Za-z]+$/).required()
        .messages({ 'string.pattern.base': 'Please Enter Vaild Name.' }),
    lastName: Joi.string().min(2).max(30).pattern(/^[A-Za-z]+$/).required()
        .messages({ 'string.pattern.base': 'Please Enter Vaild Name.' }),
    email: Joi.string().email().required().lowercase().trim(),
    password: Joi.string().min(8).required()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().lowercase().trim(),
    password: Joi.string().required()
});

// SignUp
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
            password: hashPassword,
            isGoogleUser:false
        });

        // token generate & parsing
        const token = generateToken(newUser._id)

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        //Email verification
        const verifyToken = generateVerifyToken(newUser._id)
        console.log("Verification Token:", verifyToken)
        const verifyLink = `${process.env.BASE_URL}/api/user/verify-email?token=${verifyToken}`

        await sendEmail({
            to: newUser.email,
            subject: "verify your Email",
            html: `
                 <h2>Welcome ${newUser.firstName}</h2>
                <p>Please verify your email by clicking the link below:</p>
                <a href="${verifyLink}">Verify Email</a>
                <p>This link will expire in 10 minutes.</p>`
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

//Login

export const logIn = async (req, res) => {
    try {
        // Login Validation Check
        const {error} = loginSchema.validate(req.body);
        if (error) return res.status(400).json({ success: false, message: error.details[0].message });

        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invaild Email or Password"
            })
        }
        if (!user.isVerified) {
            return res.status(401).json({
                success: false,
                message: "Please Verify your email, Check your Inbox"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invaild email or password"
            })
        }

        const token = generateToken(user._id)

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })



        return res.status(200).json({
            success: true,
            message: `Welcome Back${user.firstName}`,
            user: {
                id: user.id,
                firstName: user.firstName,
                email: user.email,
                role: user.role
            }
        })



    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const getMyProfile = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Profile can not loaded"
        });
    }
}

//gooleLogIn
export const googleLogin = async (req, res) => {
  try {
    const { name, email } = req.body;

    const nameParts = name.split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "User";

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        firstName,
        lastName,
        email,
        isGoogleUser:true
      });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      success: true,
      message: "User SignUp Successful",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Google Login Error",
      error: error.message
    });
  }
};


// Logout

export const logOut = async (req,res) => {
    try {
        res.cookie('token',"",{
            httpOnly: true,
            expires:new Date(0),
            secure: false,
            sameSite: "lax"
        })

        return res.status(200).json({
            success: true,
            message: "Logout Successfully"
        })

        } catch (error) {
        res.status(500).json({
            success: false,
            message: "Problem Logout"
        })
    }
}

// forgot password

export const forgotPassword = async (req,res) => {
    try {
        const {email} = req.body
    const user = await User.findOne({email});
    if(!user){
        return res.status(404).json({
            success:false,
            message:"User not found"
        })
    }
    const generateOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryTime = new Date(Date.now() + 15 * 60 * 1000)

    user.otp = generateOtp;
    user.otpExpiry= expiryTime;
    await user.save();
    
    //sending email
    try {
        const msg = `Password Reset OTP ${generateOtp} Vaild for 15 min only`
        await sendEmail({
            to: user.email,
            subject: "Recovery Password",
            html:msg
        })
        
        return res.status(200).json({
            success:true,
            message:`email sent to ${user.email} successfully`
        })
    
    
    } catch (error) {
        user.otp = null,
        user.otpExpiry = null,
        await user.save()
        return res.status(500).json({
            sussess:false,
            message: "Email can't send, Server Error"
        })
    }

    //server final response
    return res.status(200).json({
        success:true,
        message:"OTP sent to your email. Please Check Your Inbox",
        otp: generateOtp
    })


    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Error in forgot password",error
        })
        console.log(error);
        
    }
}

// resetPassword

export const resetPassword = async (req,res) => {
    try {
        const {email, otp, newPassword} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not Found"
            })
        }
        if(!user.otp || user.otp !== otp){
            return res.status(400).json({
                success:false,
                message:"Wrong OTP"
            })
        }
        if(user.otpExpiry < Date.now()){
            return res.status(400).json({
                success:false,
                message:"OTP Expired"
            })
        }

        const hashPassword = await bcrypt.hash(newPassword, 10)

        user.password = hashPassword;
        user.otp = null;
        user.otpExpiry = null;
        await user.save()

        return res.status(200).json({
            success:true,
            message:"Password changed Successfully, You can Login"
        })
    
    
    } catch (error) {
         res.status(500).json({
                success:false,
                message:"Can't Reset Password, Server Error"
            })
            console.log(error);
            
    }
}

// getAllUsers - Admin Only
export const getAllUsers = async (req, res) => {
    try {
        
        const users = await User.find().select("-password");

        res.status(200).json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch users" 
        }); 
    }
};

// getUserById - Admin Only
export const getUserByID = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        if (user) {
            // 2: Object ke sath success flag lazmi bhejen
            res.status(200).json({
                success: true,
                user
            });
        } else {
            res.status(404).json({
                success: false,
                message: "User not Found"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message       
        }); 
    }
};

// Update User Role -- Admin Only
export const updateUserRole = async (req, res) => {
    try {
        // 1: User ko ID se dhondna
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // 2: Naya role body se lena aur update karna
        user.role = req.body.role; 
        await user.save();

        res.status(200).json({
            success: true,
            message: "User role updated successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- GET USER DETAILS (PROFILE) ---

export const getUserDetails = async (req, res, next) => {
    try {
        
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// userControllers.js

export const updateProfile = async (req, res) => {
  try {
    // 1. Check if user is authenticated (middleware should provide req.user)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Please login to update profile" });
    }

    console.log("1. Request received for User ID:", req.user.id);
    
    const { avatar } = req.body;

    // 2. Check if avatar data exists
    if (!avatar) {
      return res.status(400).json({ success: false, message: "No image data provided" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    console.log("2. User found in DB:", user.firstName);

    // 3. Cloudinary Upload Logic with Timeout Fix
    console.log("3. Sending data to Cloudinary (waiting for response)...");
    
    let myCloud;
    try {
      myCloud = await cloudinary.v2.uploader.upload(avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
        resource_type: "auto",
        timeout: 60000, // 👈 60 seconds timeout to fix 499 error
      });
      console.log("4. Cloudinary Upload Success!");
    } catch (cloudErr) {
      console.log("🔥 CLOUDINARY DETAIL ERROR:", JSON.stringify(cloudErr, null, 2));
      return res.status(500).json({ 
        success: false, 
        message: `Cloudinary Error: ${cloudErr.message || "Timeout/Connection Issue"}` 
      });
    }

    // 4. Delete Old Image if it exists
    if (user.avatar && user.avatar.public_id && user.avatar.public_id !== "") {
      try {
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);
        console.log("Old image deleted from Cloudinary");
      } catch (delErr) {
        console.log("Note: Could not delete old image, moving on...");
      }
    }

    // 5. Update Database Fields
    user.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };

    // Use .save() to trigger any hooks if needed, but bypass main validation
    await user.save({ validateBeforeSave: false });
    console.log("5. Profile updated in Database successfully!");

    // 6. Final Response
    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      user, // Full user object for frontend state sync
    });

  } catch (error) {
    console.error("🔥 SYSTEM CRITICAL ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};