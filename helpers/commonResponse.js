let messages = require("./resources/message.json");

const getMessage = (code, defaultcode) => {
    return messages[code] ? messages[code] : messages[defaultcode];
};

exports.error = (res, code = "", statusCode = 400, data = {}) => {
    const resData = {
        error: true,
        message: getMessage(code, "DEFAULT"),
        data: data,
    };
    return res.status(statusCode).json(resData);
};

/*
 *  Send Success Message
 */
exports.success = (res, code = "", statusCode = 200, data = {}, message = getMessage(code, "DEFAULT")) => {
    const resData = {
        error: false,
        message: message,
        data,
    };
    return res.status(statusCode).json(resData);
};
