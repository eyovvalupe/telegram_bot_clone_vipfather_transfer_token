const { getHelpMessage } = require("../utils")

module.exports = (bot, chatId) => {
    const helpMessage = getHelpMessage()
    bot.sendMessage(chatId, helpMessage, {parse_mode: "HTML"})
}
