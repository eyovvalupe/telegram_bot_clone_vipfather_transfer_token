const { addUser } = require("../actions/user");
const { getStartMessage } = require("../utils");
const options = require("./options");

module.exports = (bot, chatId, msg) => {
        try {
            const data = {
                userId: msg.from.id,
                firstName: msg.from.first_name,
                userName: msg.from.username
            }
            addUser(data)
            const startMessage = getStartMessage()
            bot.sendMessage(chatId, startMessage, {
                parse_mode: 'HTML', 
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: '💡 商家入驻',
                            url: `https://t.me/viphelper`
                        }],
                    ],
            },
            }).then(() => {
                const optionbar = options('start')
                bot.sendMessage(
                    chatId, 
                    "🎮 请在输入框下方选择操作",
                    optionbar
                )
            })
        } catch (error) {
            bot.sendMessage(chatId, `${error}`)
        }
}
