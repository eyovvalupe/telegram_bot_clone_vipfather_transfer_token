const axios = require("axios")

function getHelpMessage() {
    return `
本机器人提供会员群成员到期时间管理服务。用户通过本机器人可管理自己的会员到期时间。

<b>使用方法：</b>
1.将机器人拉入群聊并赋予管理员权限（封禁用户、邀请用户、生成邀请链接）。
2.给机器人发送 /my_admin 查看自己的会员群，如果看不到则在会员频道或群组发送 /update 更新会话内容。
3.通过机器人生成带有效期的进群兑换码。用户可将卡密填入卡密平台，自动售卖。
4.以兑换的用户可以发送 /my_vip 查看自己加入的会话列表。
5.用户直接将兑换码发送给机器人，就可获取进群链接，机器人会生成一个需要审核的邀请链接，自动审核有权限的会员进群，自动踢出过期会员。
    `
}

function getRobotMessage() {
    return `
如何创建自己的机器人，向 @BotFather 发送 /newbot 创建自己的机器人。
如果已经有机器人请忽略。
如果机器人已经绑定在其他的应用上，可在 @BotFather 选择机器人，重置 Token ，将新的 Token 发送给本机器人。

请发送机器人 Token，格式为：
123456789:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
    `
}

function getStartMessage() {
    return `
欢迎使用本机器人

<b>用户有兑换码直接发送兑换码，即可兑换进群链接。</b>

🔮商家入驻请点击下面按钮
    `
}

function getOkxMessage() {
    return `
<b>欧易实时汇率Top10（C2C出售加个）</b>

①  7.11    富腾意
②  7.12    广深商行
③  7.12    正旺商行
④  7.12    尚旺U商
⑤  7.12    龙腾安全资本
⑥  7.12    惠信商店
⑦  7.12    绿茵资本
⑧  7.12    萌兰商行
⑨  7.12    大旺资本
⑩  7.12    支富宝商行

<b>实时结算汇率： 7.12 + 0.18 = 7.30</b>

查询时间：2024-09-05 01:57:24
    `
}

function getProductMessage() {
    return `
💴 <b>分销未结算金额: 0</b>
💴 <b>可结算金额: 0</b>
💴 <b>入账中金额: 0</b>
📆 查询时间: 2024-09-05 22:42:38

🛎 说明：
- 入账时间为 24 小时，防止发生订单投诉无法退款。


📢 结算手续费：
💲 转账费用: 2u
💸 小于500: 14.9%
💸 大于500: 10.9%
- 每笔转账都会在链上产生费用，建议大家大于1000再提现，降低转账成本。

结算地址：
发送 /set_user_trc20 更新收款地址。
    `
}

function getAddBotErrorMessage() {
    return `
机器人已经被绑定，请重试。如果想重新绑定，请在 @BotFather 重置 Token，并将新的 Token 发给我。发送 /cancel 取消设置。
    `
}

function getBindBotMessage(textParas) {
    return `
当前绑定的机器人：
@${textParas.botNameId}
客服账号：${textParas.potential}
授权状态：已授权
运行开关：${textParas.switch}
运行状态：${textParas.state}
    `
}

function setBindBotMessageTurnOn(botUserName, user) {
    return `
当前绑定的机器人：
@${botUserName}
客服账号：${user.firstName} (${user.userId})}
授权状态：已授权
运行开关：开启
运行状态：已启动
    `
}

function setBindBotMessageTurnOff(botUserName, user) {
    return `
当前绑定的机器人：
@${botUserName}
客服账号：${user.firstName} (${user.userId})}
授权状态：已授权
运行开关：关闭
运行状态：未启动
    `
}

function getSettingServiceMessage() {
    return `
请将点击下面输入框下的按钮，输入用户名搜索用户。选中的用户必须先私聊绑定的机器人 @testbotforchineseclient_bot ，发送 /start，否则会导致通知消息发送失败。
⚠️ 机器人已经集成传话功能，请选择接收消息的用户，不支持将消息转发给机器人。
    `
}

function validateToken(token, chatId) {
    const tokenRegex = /^[0-9]{8,10}:[A-Za-z0-9_-]{35}$/; // Regex to validate token format

    if (tokenRegex.test(token)) {
        bot.getMe()
            .then(() => {
                bot.sendMessage(chatId, 'Valid bot API token!');
            })
            .catch(() => {
                bot.sendMessage(chatId, 'Invalid bot API token. Please try again or type /cancel to cancel.');
                // Prompt for token again
                bot.sendMessage(chatId, 'Please enter your bot API token or type /cancel to cancel.');
            });
    } else {
        bot.sendMessage(chatId, 'Invalid format. Please enter a valid bot API token or type /cancel to cancel.');
        // Prompt for token again
        bot.sendMessage(chatId, 'Please enter your bot API token or type /cancel to cancel.');
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function fetchTransactionInfoFromTronGrid(txid, retries = 3, delay = 10000) {
    const tronGridEndpoint = `${process.env.TRONSCAN_QUERY_API}${txid}`

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await axios.get(tronGridEndpoint, {
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "TRON-PRO-API-KEY": process.env.TRONGRID_API_KEY,
                },
            })

            if (response.status !== 200 || !response.data || !response.data.contractRet) {
                throw new Error("No valid transaction info found on TronGrid")
            }

            console.log(`Transaction info fetched successfully on attempt ${attempt}`)
            return response.data
        } catch (error) {
            console.error(`Attempt ${attempt} - Error fetching transaction info: ${error.message}`)
            if (attempt < retries) {
                console.log(`Retrying in ${delay / 1000} seconds...`)
                await sleep(delay)
            } else {
                throw new Error("Failed to fetch transaction details from TronGrid after multiple attempts.")
            }
        }
    }
}

function calculateGasFee(cost) {
    const netFee = cost.net_fee || 0
    const memoFee = cost.memoFee || 0
    const accountCreateFee = cost.account_create_fee || 0
    const multiSignFee = cost.multi_sign_fee || 0

    const totalFee = netFee + memoFee + accountCreateFee + multiSignFee
    return totalFee
}

async function estimateTransactionFee(tronWeb, from, to, amount) {
    try {
        const transaction = await tronWeb.transactionBuilder.sendTrx(to, amount, from)
        const signedTransaction = await tronWeb.trx.sign(transaction, process.env.FROM_ADDRESS_PRIVATE_KEY)
        const broadcastResult = await tronWeb.trx.broadcast(signedTransaction)
        // Check if broadcast failed due to insufficient balance
        if (!broadcastResult || !broadcastResult.result) {
            // Decode the hex-encoded error message
            const decodedMessage = Buffer.from(broadcastResult.message, "hex").toString()
            if (broadcastResult.code === "CONTRACT_VALIDATE_ERROR" && decodedMessage.includes("balance is not sufficient")) {
                throw new Error("Insufficient balance")
            }
            throw new Error(`Failed to broadcast transaction. Response: ${JSON.stringify(broadcastResult)}`)
        }

        const { txid } = broadcastResult
        if (!txid) {
            throw new Error("Failed to retrieve transaction hash (txid) from broadcast result.")
        }

        await sleep(5000)

        const receipt = await fetchTransactionInfoFromTronGrid(txid)
        if (!receipt || !receipt.cost) {
            throw new Error(`Failed to fetch valid transaction info for txid ${txid}.`)
        }

        const gasFee = calculateGasFee(receipt.cost)
        return { gasFee, transactionHash: txid }
    } catch (error) {
        if (error.message === "Insufficient balance") {
            // Re-throw the specific error without additional context
            throw error
        } else {
            // For all other errors, wrap them with additional context
            throw new Error(`Failed to estimate transaction fee: ${error.message}`)
        }
    }
}

module.exports = { setBindBotMessageTurnOn, setBindBotMessageTurnOff, getSettingServiceMessage, getBindBotMessage, getAddBotErrorMessage, getHelpMessage, getStartMessage, sleep, fetchTransactionInfoFromTronGrid, calculateGasFee, estimateTransactionFee, getOkxMessage, getRobotMessage, validateToken, getProductMessage }
