
module.exports = (bot, chatId, messageId) => {
    try {
        bot.sendMessage(
            chatId, 
            "----------拥有的会话列表----------"
        )
    } catch (error) {
        bot.sendMessage(chatId, "Sorry, I couldn't start.")
    }
}
