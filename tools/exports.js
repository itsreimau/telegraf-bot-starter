const {
    createUrl,
    listUrl
} = require("./api.js");
const {
    format,
    translate
} = require("./msg.js");

const tools = {
    api: {
        createUrl,
        listUrl
    },
    msg: {
        format,
        translate
    }
};

module.exports = tools;