import jwt from 'jsonwebtoken'

export const generateToken = (id) => {
    return jwt.sign({id}, process.env.TOKEN_SECRET,{expiresIn:"7d"})
    
}

export const generateVerifyToken = (id) => {
        return jwt.sign({id, purpose:"emailVerify"}, process.env.TOKEN_SECRET,{expiresIn:"10m"})
}

