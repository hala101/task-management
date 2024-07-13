const { existsSync, mkdirSync, unlinkSync, writeFileSync } = require("fs");
const { v4: uuidv4 } = require("uuid");

const { extname } = require("path");

const STORAGE_PATH = "public/storage";

module.exports = {
    /*
     * upload file
     */
    uploadFile: (dir, file) => {
        const storageDirExists = existsSync(STORAGE_PATH);
        if (!storageDirExists) mkdirSync(STORAGE_PATH);

        const randomName = uuidv4();
        const fileName = `${dir}/${randomName}${extname(file.name)}`;
        console.log("🚀 ~ file: file-upload.helper.js:49 ~ fileName:", fileName);
        console.log("🚀 ~ file: fileUploadHelper.js:54 ~ dir:", dir);

        if (dir == "seller/buildingNamePlate") {
            if (!existsSync(`${STORAGE_PATH}/seller`)) mkdirSync(`${STORAGE_PATH}/seller`);
        }
        const exists = existsSync(`${STORAGE_PATH}/${dir}`);
        if (!exists) mkdirSync(`${STORAGE_PATH}/${dir}`);

        writeFileSync(`${STORAGE_PATH}/${fileName}`, file.data);

        console.log("fileName=======>", fileName);
        return fileName;
    },

    /*
     * delete file
     */
    deleteFile: (file) => {
        const path = `./${STORAGE_PATH}/${file}`;
        if (existsSync(path)) {
            unlinkSync(path);
        }
        return true;
    },

    /*
     * get storage url
     */
    castToStorage: (file) => {
        return `${process.env.DOMAIN_URL}/storage/${file}`;
    },
};
