var jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    let Token = req.headers['token-key']

    jwt.verify(Token, "SecretKey12345", function (err, decoded) {
        if (err) {
            res.status(401).json({status: "UnAuthorized"})
        } else {
            //Get email for decoded token & add with request header
            let email=decoded['data']['email']
            req.userid = decoded.userId;
            req.role = decoded.role;
            req.email = decoded.email;
            next();
        }
    })
}