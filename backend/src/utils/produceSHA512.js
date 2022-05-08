const crypto = require("crypto");

const produceSHA512 = (text) => {
    const hash = crypto.createHash("sha512");

    return hash.update(text).digest("hex");
};

module.exports = produceSHA512;