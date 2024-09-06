
module.exports = (bot, chatId, messageId) => {
    try {
        bot.sendMessage(
            chatId, 
            "请在超级群组或频道中发送，以更新信息。", 
            {
            reply_to_message_id: messageId,
            }
        )
    } catch (error) {
        bot.sendMessage(chatId, "Sorry, I couldn't start.")
    }
}
