import sendResponse from "../helpers/sendResponse.js"
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import User from "../models/User.js"


async function authenticateUser(req, res, next) {
    console.log("req.headers=>", req?.headers?.authorization)
    const bearer = req?.headers?.authorization
    if (!bearer) return sendResponse(res, 403, null, true, "Token not provided")
    const token = bearer.split(' ')[1]

    const decoded = jwt.verify(token, process.env.AUTH_SECRET)
    if (decoded) {
        const user = await User.findById(decoded._id)
        if (user) {
            req.user = user
            next()
        } else {
            return sendResponse(res, 403, null, true, "User not Found")
        }
    } else {
        return sendResponse(res, 403, null, true, "Invalid Token")
    }
}

export default authenticateUser