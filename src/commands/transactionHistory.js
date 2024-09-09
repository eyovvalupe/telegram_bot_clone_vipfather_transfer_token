const { getTransactionHistoryData } = require("../utils")

module.exports = (bot, chatId, messageId) => {
    try {
        const transactionData = getTransactionHistoryData()
        bot.sendMessage(
            chatId, 
            transactionData, 
            {
            parse_mode: 'HTML',
            reply_to_message_id: messageId,
            }
        )
    } catch (error) {
        bot.sendMessage(chatId, "Sorry, I couldn't start.")
    }
}
