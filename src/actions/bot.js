const Bot = require('../Models/Bot')
const bot = require('../bot');
const { getAddBotErrorMessage, getBindBotMessage, setBindBotMessage, getSettingServiceMessage } = require('../utils');
const axios = require('axios');
const { setChildBot } = require('./childBot');
const { getUserInfo } = require('./user');

async function addRobot(botToken, chatId, user) {
    Bot.findOne({token: botToken})
    .then(async res => {
        if (res === null) {
            const botData = await getBotInfo(botToken);
            const newBot = new Bot({
                token: botToken,
                userId: user.id,
                botId: botData.id,
                botFirstName: botData.first_name,
                botUserName: botData.user_name,
                onoffState: true,
                serviceUser: '',
            });
            newBot.save()
                .then(() => {
                    console.log('Bot saved!')
                    botState(bot, botData, chatId)
                })
                .catch(err => console.error('Error saving bot token: ', err));
        } else {
            const addBotMessage = getAddBotErrorMessage()
            bot.sendMessage(chatId, addBotMessage)
        }
    })
}

function botState(bot, botData, chatId) {
    bot.sendMessage(chatId, `机器人 @${botData.user_name} 绑定成功！请进入机器人，发送 /start 查看`)
    const bindBotMessage = getBindBotMessage(botData.user_name)
    bot.sendMessage(chatId, bindBotMessage, {
        reply_markup: {
            inline_keyboard: [
                [{
                    text: '⛔ 停止',
                    callback_data: JSON.stringify({
                        action: 'stop_bot',
                        botUserName: botData.user_name
                    })
                },
                {
                    text: '🔑 更新 Token',
                    callback_data: JSON.stringify({
                        action: 'update_bot',
                        data: ''
                    })
                }],
                [{
                    text: '💁‍♀️ 设置客服',
                    callback_data: JSON.stringify({
                        action: 'set_servicer',
                        botUserName: botData.user_name
                    })
                }],
                [{
                    text: '🎉 欢迎消息',
                    url: `http://t.me/${botData.user_name}`
                }],
                [{
                    text: '📦 商品列表',
                    callback_data: JSON.stringify({
                        action: 'products_list',
                        data: ''
                    })
                }],
                [{
                    text: '💹 代理分销',
                    callback_data: JSON.stringify({
                        action: 'anylisis_service',
                        data: ''
                    })
                }],
                [{
                    text: '🚮 删除列表',
                    callback_data: JSON.stringify({
                        action: 'delete_bot',
                        data: ''
                    })
                }],
                [{
                    text: '🔙 返回',
                    callback_data: JSON.stringify({
                        action: 'back',
                        data: ''
                    })
                }]
            ],
        },
    })
}

function stopBotMessage(displayData, chatId, messageId) {
    Bot.findOneAndUpdate({botUserName: displayData.botUserName}, {$set: {onoffState: false}})
        .then(res => {
            bot.editMessageReplyMarkup(
                {
                    inline_keyboard: [
                        [{
                            text: '▶ 启动',
                            callback_data: JSON.stringify({
                                action: 'run_bot',
                                botUserName: displayData.botUserName
                            })
                        },
                        {
                            text: '🔑 更新 Token',
                            callback_data: JSON.stringify({
                                action: 'update_bot',
                                data: ''
                            })
                        }],
                        [{
                            text: '💁‍♀️ 设置客服',
                            callback_data: JSON.stringify({
                                action: 'set_servicer',
                                botUserName: displayData.botUserName
                            })
                        }],
                        [{
                            text: '🎉 欢迎消息',
                            url: `http://t.me/${displayData.botUserName}`
                        }],
                        [{
                            text: '📦 商品列表',
                            callback_data: JSON.stringify({
                                action: 'products_list',
                                data: ''
                            })
                        }],
                        [{
                            text: '💹 代理分销',
                            callback_data: JSON.stringify({
                                action: 'anylisis_service',
                                data: ''
                            })
                        }],
                        [{
                            text: '🚮 删除列表',
                            callback_data: JSON.stringify({
                                action: 'delete_bot',
                                data: ''
                            })
                        }],
                        [{
                            text: '🔙 返回',
                            callback_data: JSON.stringify({
                                action: 'back',
                                data: ''
                            })
                        }]
                    ],
                }, {
                    chat_id: chatId,
                    message_id: messageId
                }
            )
        })
}

function runBotMessage(displayData, chatId, messageId) {
    Bot.findOneAndUpdate({botUserName: displayData.botUserName}, {$set: {onoffState: true}})
        .then(res => {
            bot.editMessageReplyMarkup(
                {
                    inline_keyboard: [
                        [{
                            text: '⛔ 停止',
                            callback_data: JSON.stringify({
                                action: 'stop_bot',
                                botUserName: displayData.botUserName
                            })
                        },
                        {
                            text: '🔑 更新 Token',
                            callback_data: JSON.stringify({
                                action: 'update_bot',
                                data: ''
                            })
                        }],
                        [{
                            text: '💁‍♀️ 设置客服',
                            callback_data: JSON.stringify({
                                action: 'set_servicer',
                                botUserName: displayData.botUserName
                            })
                        }],
                        [{
                            text: '🎉 欢迎消息',
                            url: `http://t.me/${displayData.botUserName}`
                        }],
                        [{
                            text: '📦 商品列表',
                            callback_data: JSON.stringify({
                                action: 'products_list',
                                data: ''
                            })
                        }],
                        [{
                            text: '💹 代理分销',
                            callback_data: JSON.stringify({
                                action: 'anylisis_service',
                                data: ''
                            })
                        }],
                        [{
                            text: '🚮 删除列表',
                            callback_data: JSON.stringify({
                                action: 'delete_bot',
                                data: ''
                            })
                        }],
                        [{
                            text: '🔙 返回',
                            callback_data: JSON.stringify({
                                action: 'back',
                                data: ''
                            })
                        }]
                    ],
                }, {
                    chat_id: chatId,
                    message_id: messageId
                }
            )
        })
}

async function getBotInfo(token) {
    const url = `https://api.telegram.org/bot${token}/getMe`;

    try {
        const response = await axios.get(url);
        if (response.data.ok) {
            console.log('Bot Information:');
            console.log(`ID: ${response.data.result.id}`);
            console.log(`First Name: ${response.data.result.first_name}`);
            console.log(`Username: ${response.data.result.username}`);
            const data = {
                id: response.data.result.id,
                first_name: response.data.result.first_name,
                user_name: response.data.result.username
            }
            return data
        } else {
            console.error('Error fetching bot information:', response.data.description);
        }
    } catch (error) {
        console.error('Error making request:', error.message);
    }
}

function setService(chatId, data) {
    const settingServiceMessage = getSettingServiceMessage();
    bot.sendMessage(chatId, settingServiceMessage, {
        reply_markup: {
            keyboard: [['选择用户']],
            resize_keyboard: true,
        }
    })
    .then(() => {
        bot.sendMessage(chatId, "⚠️ 如果是此账号，请点击此消息下方按钮。",  {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '💁‍♀️ 设置此账号为客服', callback_data: JSON.stringify({
                        action: 'set_me_as_service',
                        sendBot: data.botUserName
                    }) }]
                ],
                one_time_keyboard: true
            },
        })
    })
}

async function setMeAsService(data, user, chatId, messageId) {
    console.log("data ==========>", data)
    let myId;
    await Bot.findOne({botUserName: data.sendBot})
        .then(res => myId = res.userId);
    const me = await getUserInfo(myId)
    Bot.findOneAndUpdate({botUserName: data.sendBot}, {$set: {serviceUser: me.userId}})
        .then(res => {
            console.log("res =============> ", res);
            const childBot = setChildBot(res.token);
            bot.sendMessage(chatId, `✅ 设置机器人客服成功，客服用户ID: ${me.userId}`)
                .then(rrr => {
                    childBot.sendMessage(chatId, `您已经被设置为机器人 @${res.botUserName} 的客服，您可以接收该机器人的对话。`)
                        .then(child => childBot.stopPolling());
                    bot.sendMessage(chatId, '✅ 向客服发送通知成功')
                        .then(resthen => {
                            const bindBotMessage = setBindBotMessage(res.botUserName, me)
                            bot.sendMessage(chatId, bindBotMessage, {
                                reply_markup: {
                                    inline_keyboard: [
                                        [{
                                            text: '⛔ 停止',
                                            callback_data: JSON.stringify({
                                                action: 'stop_bot',
                                                botUserName: res.botUserName
                                            })
                                        },
                                        {
                                            text: '🔑 更新 Token',
                                            callback_data: JSON.stringify({
                                                action: 'update_bot',
                                                data: ''
                                            })
                                        }],
                                        [{
                                            text: '💁‍♀️ 设置客服',
                                            callback_data: JSON.stringify({
                                                action: 'set_servicer',
                                                botUserName: res.botUserName
                                            })
                                        }],
                                        [{
                                            text: '🎉 欢迎消息',
                                            url: `http://t.me/${res.botUserName}`
                                        }],
                                        [{
                                            text: '📦 商品列表',
                                            callback_data: JSON.stringify({
                                                action: 'products_list',
                                                data: ''
                                            })
                                        }],
                                        [{
                                            text: '💹 代理分销',
                                            callback_data: JSON.stringify({
                                                action: 'anylisis_service',
                                                data: ''
                                            })
                                        }],
                                        [{
                                            text: '🚮 删除列表',
                                            callback_data: JSON.stringify({
                                                action: 'delete_bot',
                                                data: ''
                                            })
                                        }],
                                        [{
                                            text: '🔙 返回',
                                            callback_data: JSON.stringify({
                                                action: 'back',
                                                data: ''
                                            })
                                        }]
                                    ],
                                },
                            })
                        });
                })
            
        })
}

module.exports = { setService, setMeAsService, runBotMessage, stopBotMessage, addRobot, getBotInfo }