const User = require('../Models/User')
const bot = require('../bot')
const { getCongratulationMessage, getShopInfo, getDate } = require('../utils')

function addUser(data) {
    User.findOne({userId: data.userId})
    .then(res => {
        console.log('user =======> ', res)
        if (res === null) {
            const date = getDate()
            const newUser = new User({
                userId: data.userId,
                firstName: data.firstName,
                userName: data.userName,
                shopId: '',
                wallet: '',
                agree: false,
                lastVisitDate: date
            })
            newUser.save()
                .then(() => console.log('user saved!'))
                .catch(err => console.error(err))
        } else {
            const date = getDate()
            res.lastVisitDate = date;
            res.save()
            console.log('updated successfully!')
        }
    })
}

async function getUserInfo(userId) {
    let me;
    await User.findOne({userId}).then(res => me = res);
    return me;
}

async function setAgree(userId, chatId, messageId) {
    let num;
    await User.find({shopId: {$ne: null}}).then(res => num = res.length);
    num += 1;

    const user = await getUserInfo(userId);

    User.findOneAndUpdate({userId}, {$set: {agree: true, shopId: num}})
        .then(res => console.log(res))
        .catch(err => console.error(err));
    
    const congrit = getCongratulationMessage(num);
    bot.sendMessage(chatId, congrit)
        .then(res => {
            const shopInfo = getShopInfo(user)
            bot.editMessageText(shopInfo, {
                chat_id: chatId,
                message_id: messageId,
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: '💎 设置USDT',
                            callback_data: JSON.stringify({
                                action: 'setup_wallet_address',
                                userId: userId
                            })
                        }],
                        [{
                            text: '🔘 提交订单通知',
                            callback_data: JSON.stringify({
                                action: 'send_transaction',

                            })
                        }]
                    ]
                }
            })

        })
}

async function setWalletAddressMessage(chatId, userId) {
    const userInfo = await getUserInfo(userId)
    const shopInfo = getShopInfo(userInfo)
    bot.sendMessage(chatId, shopInfo, {
        reply_markup: {
            inline_keyboard: [
                [{
                    text: '💎 设置USDT',
                    callback_data: JSON.stringify({
                        action: 'set_user_trc20',
                        userId
                    }) 
                }],
                [{
                    text: '🔘 提交订单通知',
                    callback_data: JSON.stringify({
                        action: 'send_transaction',

                    })
                }]
            ]
        }
    })
}

async function setWalletAddress(userId, address, chatId) {
    const trc20Regex = /^T[A-Za-z1-9]{33}$/;
    if (trc20Regex.test(address)) {
        await User.findOneAndUpdate({userId}, {$set: {wallet: address}})
            .then(res => {
                bot.sendMessage(chatId, "TRC20 USDT 收款地址设置成功")
                    .then(res => setWalletAddressMessage(chatId, userId))
            })
    } else {
        bot.sendMessage(chatId, "TRC20 USDT 收款地址格式错误，请重新发送。发送 /cancel 取消设置")
    }
}

module.exports = { setWalletAddress, setWalletAddressMessage, setAgree, addUser, getUserInfo }