const axios = require("axios")
const { getUserInfo } = require("./actions/user")

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

function getProductMessage(user) {
    const date = getDate()
    let wallet;
    if (user.wallet === undefined) {
        wallet = '未设置'
    } else wallet = user.wallet
    return `
💴 <b>分销未结算金额: 0</b>
💴 <b>可结算金额: 0</b>
💴 <b>入账中金额: 0</b>
📆 查询时间: ${date}

🛎 说明：
- 入账时间为 24 小时，防止发生订单投诉无法退款。


📢 结算手续费：
💲 转账费用: 2u
💸 小于500: 14.9%
💸 大于500: 10.9%
- 每笔转账都会在链上产生费用，建议大家大于1000再提现，降低转账成本。

结算地址：${wallet}
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

function setBindBotMessageTurnOn(botName, user) {
    return `
当前绑定的机器人：
@${botName}
客服账号：${user.firstName} (${user.userId})
授权状态：已授权
运行开关：开启
运行状态：已启动
    `
}

function setBindBotMessageTurnOff(botName, user) {
    return `
当前绑定的机器人：
@${botName}
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

function noHasProductMessage() {
    return `
您还没有创建任何商品，先创建商品吧。
    `
}

function hasProductMessage(botName) {
    return `
🏠 首页链接：https://t.me/${botName}?start=home

📦 机器人 @${botName} 拥有的商品列表：
    `
}

function getAddProductMessage() {
    return `
请输入商品名称，禁止输入违规商品名，风控无法付款后果自负。建议为XX赞助：
    `
}

function getAddSuccessMessage() {
    return `
✅ 商品创建成功，请点击商品名称进行设置。
    `
}

function getStartWarning() {
    return `
您还没有店铺，请阅读创建店铺须知，同意后方可创建店铺。

<b>创建店铺须知</b>

👮‍♀️ 机器人遵守国际法，不收赌、毒、洗钱、诈骗、AI 换脸 脱衣、儿童涩情业务。一经发现或举报，直接冻结资金。关闭店铺，禁用机器人。
--------------------
👮‍♀️ The robot abides by international laws and does not accept gambling, drugs, money laundering, fraud, AI face-changing, stripping, or children's pornography businesses. Once discovered or reported, the funds will be frozen directly. Close the store and disable the bots.

❌ 不收电报以外的业务，只收电报门槛群或个人创作者粉丝门槛。
直播打赏、一对一裸聊等一概不收，一经发现或举报，直接冻结资金。关闭店铺，禁用机器人。
--------------------
❌ No business other than telegrams is accepted, only telegram threshold groups are accepted. Live broadcasts, one-to-one naked chats, etc. will not be accepted. Once discovered or reported, funds will be frozen directly. Close the store and disable the bots.

⚠️ 请仔细阅读上述协议，如有疑问请联系客服 @GogoPlav。
    `
}

function getCongratulationMessage(id) {
    return `
🎉 您的店铺已创建成功，商户ID：${id}
    `
}

function getShopInfo(user) {
    let walletInfo;
    let availableTime;
    if (user.wallet === '') {
        walletInfo = '未设置';
        availableTime = 12
    } else {
        walletInfo = user.wallet;
        availableTime = 168
    }
    return `
商户ID：${user.shopId}
商户名称：${user.userId}的商户
USDT(Trc20) 收款地址：${walletInfo}
结算冻结时间：${availableTime} 小时（量大可谈）
    `
}

function getSettingWalletMessage(user) {
    let walletInfo;
    if (user.wallet === '') {
        walletInfo = '未设置';
    } else walletInfo = user.wallet;
    return `
当前收款地址：${walletInfo}

💎 请发送 TRC20 USDT 收款地址。
⚠️ 请仔细检查地址，错误的地址将导致资金丢失。
    `
}

function getEverydayVisitData() {
    return `
<b>📈 最近十日访问统计</b>
暂无数据
    `
}

function getTransactionHistoryData() {
    return `
<b>近十天的每日销售统计：</b>

暂无数据
    `
}

function getAnalysisData() {
    return `
<b>商家近三日销售数据</b>：（包含分销数据）

暂无数据
    `
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

function getSendTransactionMessage(user) {
    const date = getDate();
    let wallet;
    if (user.wallet === '') {
        wallet = '未设置'
    } else wallet = user.wallet
    return `
💴 <b>商家未结算金额: 0</b>
📆 <b>可结算时间: ${date}</b>
💴 <b>可结算金额: 0</b>
💴 <b>入账中金额: 0</b>
⚠️ <b>此金额不再包含分给分销商的钱，分销商收入将独立结算给分销人。请在创建的分销上设置分销人，即可结算。</b>
📆 查询时间: ${date}

🛎 说明：
- 入账时间为 24 小时，防止发生订单投诉无法退款。
- 金额包含直接发送单个时长商品链接的金额，大于等于所有分销商金额总和。

📢 结算手续费：
💲 转账费用: 2u
💸 小于500: 14.9%
💸 大于500: 10.9%
- 每笔转账都会在链上产生费用，建议大家大于1000再提现，降低转账成本。

结算地址：${wallet}
发送 /set_trc20 更新收款地址。
    `
}

function getProductDetailMessage(product) {
    return `
商品名称：${product.productName}
商品描述：
排序优先级：${product.priority}
商品包含群：${product.productGroup.length}个
<b>购买链接</b>：${product.productUrl}
    `
}

function getBotStartMessage() {
    
}

function getDate() {
    // Create a new Date object
    const currentDate = new Date();

    // Extract components
    const year = String(currentDate.getFullYear()).padStart(4, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    // Format date and time
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    // Display the formatted date and time
    return formattedDateTime;
}

function isEmpty(value) {
    if (value == null) {
        // Check for null or undefined
        return true;
    }

    if (typeof value === 'string' || Array.isArray(value)) {
        // Check for empty string or empty array
        return value.length === 0;
    }

    if (typeof value === 'object') {
        // Check for empty object
        return Object.keys(value).length === 0;
    }

    // For all other types, consider non-empty
    return false;
}

module.exports = { isEmpty, getProductDetailMessage, getSendTransactionMessage, getAnalysisData, getTransactionHistoryData, getEverydayVisitData, getDate, getSettingWalletMessage, getShopInfo, getCongratulationMessage, getStartWarning, getAddSuccessMessage, getAddProductMessage, hasProductMessage, noHasProductMessage, setBindBotMessageTurnOn, setBindBotMessageTurnOff, getSettingServiceMessage, getBindBotMessage, getAddBotErrorMessage, getHelpMessage, getStartMessage, sleep, fetchTransactionInfoFromTronGrid, calculateGasFee, estimateTransactionFee, getOkxMessage, getRobotMessage, getProductMessage }
