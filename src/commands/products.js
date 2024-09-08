const { getBotList } = require("../actions/bot")

module.exports =async (bot, chatId, messageId, user) => {
    try {
        const data = await getBotList(user.id)
        if (data.length) {
            const message = "请选择机器人，以查看机器人绑定的商品："
            const botlist = data.reduce((acc, cur) => {
                acc.push([{
                    text: `🤖 ${cur.botUserName} ▶`,
                    callback_data: JSON.stringify({
                        action: 'chs_bot_for_pdts',
                        botName: cur.botUserName,
                    })
                }])
                return acc;
            }, [])
            bot.sendMessage(chatId, message, {
                reply_markup: {
                    inline_keyboard: [
                        ...botlist
                    ],
            },
            })
        } else {
        const message = `
您还没有创建任何授权的机器人，点击 我的机器人 先创建机器人吧。
（如果之前有商品，绑定机器人后会自动迁移到机器人上。）
    `
        bot.sendMessage(
            chatId, 
            message
        )
    }
        
    } catch (error) {
        bot.sendMessage(chatId, "Sorry, I couldn't start.")
    }
}
