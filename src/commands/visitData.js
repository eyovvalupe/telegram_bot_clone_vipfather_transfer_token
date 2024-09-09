const { getEverydayVisitData } = require("../utils")

module.exports = (bot, chatId, messageId) => {
    try {
        const everydayVisitData = getEverydayVisitData()
        bot.sendMessage(
            chatId, 
            everydayVisitData, 
            {
            parse_mode: 'HTML',
            reply_to_message_id: messageId,
            }
        )
    } catch (error) {
        bot.sendMessage(chatId, "Sorry, I couldn't start.")
    }
}
