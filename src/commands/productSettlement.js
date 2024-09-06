const { getProductMessage } = require("../utils")

module.exports = (bot, chatId) => {
    const productMessage = getProductMessage()
    try {
        bot.sendMessage(chatId, productMessage, {
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: '💰 提交结算',
                        callback_data: JSON.stringify({
                            action: 'product_settlement'
                        })
                    }],
                ],
        },
        })
    } catch (error) {
        bot.sendMessage(chatId, "Sorry, I couldn't start.")
    }
}
