'use strict';
const fs = require('node:fs');
const path = require('node:path');
const axios = require('axios');
const FormData = require('form-data');
const { config } = require('dotenv');
const AdmZip = require('adm-zip');
config();

const isProduction = process.env.RUN === 'production';
let UPLOAD_URL, GET_USER_PATH_URL;

if (isProduction) {
  UPLOAD_URL = process.env.UPLOAD_URL;
  GET_USER_PATH_URL = process.env.GET_USER_PATH_URL;
} else {
  UPLOAD_URL = process.env.DEV_UPLOAD_URL;
  GET_USER_PATH_URL = process.env.DEV_GET_USER_PATH_URL;
}

const CONFIG_PATH = path.join(__dirname, '..', '/config.json');
const { USER_KEY } = JSON.parse(fs.readFileSync(CONFIG_PATH).toString());

const getUserPath = async (key) => {
  {
    const url = GET_USER_PATH_URL + key;
    try {
      const response = await axios.get(url);
      let USER_KEY = response.data;
      const length = USER_KEY.length;
      if (USER_KEY[length - 1] !== '/') {
        USER_KEY += '/';
      }
      return USER_KEY;
    } catch (error) {
      throw new Error(error);
    }
  }
};

const compressFiles = (src) => {
    const zip = new AdmZip();
    
    if (!fs.existsSync(src)) {
      console.log(`File ${src} does not exist`);
      return;
    }
    
    const date = new Date();
    const dest = `${src}backup_${date.getFullYear()}-${date.getMonth() +
      1}-${date.getDate()}_${Math.floor(Math.random() * 9999)}.zip`;
      
     try {
       zip.addLocalFolder(src);
       zip.writeZip(dest);
       console.log(`Archive created at ${dest}`);
       return dest;
    } catch (error) {
       throw new Error(error);
    }
};

const uploadFile = async (filePath) => {
  const url = UPLOAD_URL + USER_KEY;

  if (!fs.existsSync(filePath)) {
    throw new Error(`File ${filePath} does not exist`);
  }

  try {
    const formData = new FormData();
    const file = fs.createReadStream(filePath);
    formData.append('file', file);
    const res = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(error);
  }
};

const getBackupFile = (targetPath) => {
  try {
    const files = fs.readdirSync(targetPath);
    for (const file of files) {
      if (file.startsWith('backup')) return file;
    }
    return false;
  } catch (error) {
    throw new Error(error);
  }
}

const removeFile = (fileName) => fs.unlinkSync(fileName);

const main = async () => {
  try {
    const userPath = await getUserPath(USER_KEY);
    const backupFileExist = getBackupFile(userPath);
    if (backupFileExist) {
      const backupFile = backupFileExist;
      const backUpFilePath = userPath + backupFile;
      removeFile(backUpFilePath);
    }
    const compressedFile = compressFiles(userPath);
    const upload = await uploadFile(compressedFile);
    console.log('UPLOAD DETAILS', upload);
    removeFile(compressedFile);
  } catch (error) {
    console.log(error);
  }
};

main();
