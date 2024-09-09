const { getUserInfo } = require("../actions/user")
const { getProductMessage } = require("../utils")

module.exports = async (bot, chatId, user) => {
    const userInfo = await getUserInfo(user.id)
    const productMessage = getProductMessage(userInfo)
    try {
        bot.sendMessage(chatId, productMessage, {
            parse_mode: 'HTML',
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
