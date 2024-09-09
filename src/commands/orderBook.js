
module.exports = (bot, chatId, messageId) => {
    try {
        bot.sendMessage(
            chatId, 
            '店铺暂无用户下单', 
            {
            // parse_mode: 'HTML',
            reply_to_message_id: messageId,
            }
        )
    } catch (error) {
        bot.sendMessage(chatId, "Sorry, I couldn't start.")
    }
}
