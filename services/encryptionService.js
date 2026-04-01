const CryptoJS = require("crypto-js");

function encryptDiaryContent(content, secretKey) {
  return CryptoJS.AES.encrypt(content, secretKey).toString();
}

function decryptDiaryContent(cipherText, secretKey) {
  const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}

module.exports = {
  encryptDiaryContent,
  decryptDiaryContent,
};
