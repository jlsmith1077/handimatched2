const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    console.log('in check auth')
    try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
    } catch (error) {
        console.log('in check-auth error');
        res.status(401).json({message: 'Please Log in'});
    }
};