const options = require("./options");

module.exports = (bot, chatId) => {
        try {
            const optionbar = options('mercant')
            bot.sendMessage(
                chatId, 
                "🎮请在输入框下方选择操作",
                optionbar
            )
        } catch (error) {
            bot.sendMessage(chatId, "Sorry, I couldn't start.")
        }
}
