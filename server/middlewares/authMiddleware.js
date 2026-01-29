const jwt = require('jsonwebtoken');
const User = require('../models/user');
const responseHandler = require('../utils/responseHandler');

const authMiddleware = async (req, res, next) => {
    const authToken = req.cookies?.auth_token
    if (!authToken) {
        return responseHandler(res, 401, 'Authentication token missing');
    }
    try {
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
        req.user = decoded;
        console.log(req.user);
        next()
    } catch (error) {
        return responseHandler(res, 401,'Invalid authentication token');
    }
}

module.exports = authMiddleware;