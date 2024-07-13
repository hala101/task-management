const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (req, res, next) {
    // console.log("🚀 ~ file: authenticate.js:7 ~ req.header:", req.header("Authorization"));
    const token = req.headers.authorization.replace("Bearer", "").trim();

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
