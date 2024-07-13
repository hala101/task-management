const Cryptr = require("cryptr");
const cryptr = new Cryptr("myTotalySecretKey");

exports.encryptStringCrypt = async (string_value) => {
    let encryptedString = Cryptr.encrypt(string_value);
    return encryptedString;
};

exports.CryptrdecryptStringCrypt = async (string_value) => {
    let decryptedString = cryptr.decrypt(string_value);
    return decryptedString;
};
