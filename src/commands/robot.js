const { getBotList } = require("../actions/bot")

module.exports = async (bot, chatId, user) => {
        try {
            const data = await getBotList(user.id);
            let status;
            const botlist = data.reduce((acc, cur) => {
                if (cur.onoffState) {
                    status = '▶'
                } else status = '⛔'
                acc.push([{
                    text: `🤖 ${cur.botUserName} ${status}`,
                    callback_data: JSON.stringify({
                        action: 'run_bot',
                        botUserName: cur.botUserName
                    })
                }])
                return acc;
            }, [])
            bot.sendMessage(chatId, "店铺机器人列表：", {
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: '🆕 添加机器人',
                            callback_data: JSON.stringify({
                                action:'add_robot'
                            })
                        }],
                        ...botlist
                    ],
            },
            })
        } catch (error) {
            bot.sendMessage(chatId, "Sorry, I couldn't start.")
        }
}
