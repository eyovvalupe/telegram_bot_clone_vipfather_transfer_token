const { getUserInfo } = require("../actions/user");
const { getStartWarning } = require("../utils");
const options = require("./options");

module.exports = async (bot, chatId, user) => {
        try {
            const userInfo = await getUserInfo(user.id)
            if (!userInfo.agree) {
                const warningMessage = getStartWarning()
                bot.sendMessage(chatId, warningMessage, {
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [{
                                text: '同意条款',
                                callback_data: JSON.stringify({
                                    action: 'agree',
                                    userId: user.id
                                })
                            },{
                                text: '取消',
                                callback_data: JSON.stringify({
                                    action: 'back'
                                })
                            }]
                        ]
                    }
                })
            } else {
                const optionbar = options('mercant')
                bot.sendMessage(
                    chatId, 
                    "🎮请在输入框下方选择操作",
                    optionbar
                )
            }
        } catch (error) {
            bot.sendMessage(chatId, "Sorry, I couldn't start.")
        }
}
