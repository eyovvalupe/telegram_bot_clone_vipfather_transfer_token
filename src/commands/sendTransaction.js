const { getUserInfo } = require("../actions/user")
const { getSendTransactionMessage } = require("../utils")

module.exports = async (bot, chatId, user) => {
    const userInfo = await getUserInfo(user.id)
    try {
        const sendTransactionMessage = getSendTransactionMessage(userInfo)
        bot.sendMessage(
            chatId, 
            sendTransactionMessage,
            {
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: '💰 提交结算',
                            callback_data: JSON.stringify({
                                action: 'send_transaction_admin'
                            })
                        }]
                    ]
                }
            }
        )
    } catch (error) {
        bot.sendMessage(chatId, "Sorry, I couldn't start.")
    }
}
