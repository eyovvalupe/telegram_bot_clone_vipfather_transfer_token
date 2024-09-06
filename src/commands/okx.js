const { getOkxMessage } = require("../utils")

module.exports = (bot, chatId) => {
    try {
        const okxMessage = getOkxMessage()
        bot.sendMessage(
            chatId, 
            okxMessage,
            {parse_mode: "HTML"}
        )
    } catch (error) {
        bot.sendMessage(chatId, "Sorry, I couldn't start.")
    }
}
