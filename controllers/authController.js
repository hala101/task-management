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
 *  Login Routes for viewing in Browser
 */
exports.login = (req, res) => {
    try {
        res.render("login", { title: "Login" });
    } catch (error) {
        return next(error);
    }
};

/*
 *  Authenticate user
 */
exports.authenticate = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return commonResponse.error(res, "USER_NOT_FOUND", 400, {});
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return commonResponse.error(res, "INVALID_CREDENTIALS", 400, {});
        }
        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
            console.log("🚀 ~ file: authController.js:63 ~ jwt.sign ~ token:", token);
            if (err) {
                throw err;
            }
            // res.render("dashboard", { title: "Dashboard" });
            return commonResponse.success(res, "LOGIN_SUCCESS", 200, { token });
            res.cookie("token", token);

            res.redirect("/tasks");
        });
    } catch (err) {
        console.log("🚀 ~ file: authController.js:53 ~ exports.login= ~ err:", err);
        return commonResponse.error(res, "SERVER_ERROR", 500, {});
    }
};
