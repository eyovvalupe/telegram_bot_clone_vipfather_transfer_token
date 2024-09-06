
module.exports = (bot, chatId, messageId) => {
        try {
            bot.sendMessage(
                chatId, 
                "您还未加入任何会员群，赶紧去加入吧！", 
                {
                reply_to_message_id: messageId,
                }
            )
        } catch (error) {
            bot.sendMessage(chatId, "Sorry, I couldn't start.")
        }
}
