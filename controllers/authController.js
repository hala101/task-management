const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { commonResponse } = require("../helpers");
require("dotenv").config();

/*
 *  Register New User
 */
exports.register = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return commonResponse.error(res, "USER_EXIST", 400, {});
        }

        user = new User({ email, password });

        await user.save();

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
            if (err) {
                throw err;
            }
            return commonResponse.success(res, "LOGIN_SUCCESS", 200, { token });
        });
    } catch (err) {
        console.log("🚀 ~ file: authController.js:22 ~ exports.register= ~ err:", err);
        return commonResponse.error(res, "SERVER_ERROR", 500, {});
    }
};

/*
 *  Login user
 */
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send("Invalid credentials");
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return commonResponse.error(res, "INVALID_CREDENTIALS", 400, {});
        }
        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
            if (err) {
                throw err;
            }
            return commonResponse.success(res, "LOGIN_SUCCESS", 200, { token });
        });
    } catch (err) {
        console.log("🚀 ~ file: authController.js:53 ~ exports.login= ~ err:", err);
        return commonResponse.error(res, "SERVER_ERROR", 500, {});
    }
};
