const {
    createUrl,
    listUrl
} = require("./api.js");
const {
    translate
} = require("./msg.js");

const tools = {
    api: {
        createUrl,
        listUrl
    },
    msg: {
        translate
    }
};

module.exports = tools;