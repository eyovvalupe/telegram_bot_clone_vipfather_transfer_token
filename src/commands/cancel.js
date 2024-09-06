
module.exports = (bot, chatId, messageId) => {
    try {
        bot.sendMessage(
            chatId, 
            "已取消流程", 
            {
                reply_to_message_id: messageId,
            }
        )
    } catch (error) {
        bot.sendMessage(chatId, "Sorry, I couldn't start.")
    }
}
