
import jwt from 'jsonwebtoken';
export const verifyJWT = (req, res, next) =>{
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]
    if(token == null) return res.status(401).json({message: "Unauthorized"})
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err) return res.sendStatus(403).json({message: "Forbidden"})
        req.user = decoded.id
        next()
    })
}