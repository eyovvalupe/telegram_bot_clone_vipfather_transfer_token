const TelegramBot = require('node-telegram-bot-api');

function setChildBot(token) {
    const childBot = new TelegramBot(token, {polling: true})
    return childBot
}

module.exports = { setChildBot }