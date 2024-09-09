const { getAnalysisData } = require("../utils")

module.exports = (bot, chatId) => {
    try {
        const analysisData = getAnalysisData()
        bot.sendMessage(
            chatId, 
            analysisData,
            {
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: '💹 今日销量',
                            callback_data: JSON.stringify({
                                action: 'today_trans_analysis'
                            })
                        }, {
                            text: '📈 昨日销量',
                            callback_data: JSON.stringify({
                                action: 'yesterday_trans_analysis'
                            })
                        }],
                        [{
                            text: '💹 本周销量',
                            callback_data: JSON.stringify({
                                action: 'this_week_trans_analysis'
                            })
                        }, {
                            text: '📈 上周销量',
                            callback_data: JSON.stringify({
                                action: 'before_week_trans_analysis'
                            })
                        }],
                        [{
                            text: '💹 本月销量',
                            callback_data: JSON.stringify({
                                action: 'this_month_trans_analysis'
                            })
                        }, {
                            text: '📈 上月销量',
                            callback_data: JSON.stringify({
                                action: 'before_month_trans_analysis'
                            })
                        }],
                        [{
                            text: '📊 近期销量',
                            callback_data: JSON.stringify({
                                action: 'recent_trans_analysis'
                            })
                        }, {
                            text: '📈 自定义',
                            callback_data: JSON.stringify({
                                action: 'setting_upto_you'
                            })
                        }],
                    ]
                }
            }
        )
    } catch (error) {
        bot.sendMessage(chatId, "Sorry, I couldn't start.")
    }
}
