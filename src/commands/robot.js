module.exports = (bot, chatId) => {
        try {
            bot.sendMessage(chatId, "店铺机器人列表：", {
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: '🆕 添加机器人',
                            callback_data: JSON.stringify({
                                action:'add_robot'
                            })
                        }],
                    ],
            },
            })
        } catch (error) {
            bot.sendMessage(chatId, "Sorry, I couldn't start.")
        }
}
