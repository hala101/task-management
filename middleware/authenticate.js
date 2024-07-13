const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (req, res, next) {
    // console.log("🚀 ~ file: authenticate.js:7 ~ req.header:", req.header("Authorization"));
    let token;
    if (req.headers.authorization) {
        token = req.headers.authorization.replace("Bearer", "").trim();
    } else if (req.cookies.token) {
        console.log("🚀 ~ file: authenticate.js:11 ~ req.cookies.token:", req.cookies.token);
        token = req.cookies.token;
    }
    if (!token) {
        return res.status(401).send("No token, authorization denied");
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).send("Token is not valid");
    }
};
