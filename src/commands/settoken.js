const { getRobotMessage } = require("../utils")

module.exports = (bot, chatId) => {
    const robotMessage = getRobotMessage()
    try {
        bot.sendMessage(chatId, "店铺机器人列表：", {
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: robotMessage,
                        // callback_data: JSON.stringify({ method: 'robot_message' })
                    }],
                ],
        },
        })
    } catch (error) {
        bot.sendMessage(chatId, "Sorry, I couldn't start.")
    }
}
