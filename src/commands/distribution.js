const options = require("./options");

module.exports = (bot, chatId, messageId) => {
        try {
            const opbar = options('distribution')
            bot.sendMessage(
                chatId, 
                "🎮请在输入框下方选择操作", 
                {
                reply_to_message_id: messageId,
                ...opbar
                }
            )
        } catch (error) {
            bot.sendMessage(chatId, "Sorry, I couldn't start.")
        }
}
