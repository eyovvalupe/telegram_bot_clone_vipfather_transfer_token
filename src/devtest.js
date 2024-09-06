const bot = require("./bot")
const start = require("./commands/start")
const mercant = require("./commands/mercant")
const distribution = require('./commands/distribution')
const chat = require("./commands/chat")
const okx = require("./commands/okx")
const cancel = require("./commands/cancel")
const update = require("./commands/update")
const help = require("./commands/help")
const robot = require("./commands/robot")
const database = require('./database')
const { getRobotMessage, getSettingServiceMessage } = require("./utils")
const products = require("./commands/products")
const productSettlement = require("./commands/productSettlement")
const { addRobot, stopBotMessage, runBotMessage, setService, setMeAsService } = require("./actions/bot")
const options = require("./commands/options")

database()

const userStates = {};

bot.setMyCommands([
    { command: "/start", description: "💰 开启财富之门" },
    { command: "/mercant_portal", description: "🛍 我的店铺" },
    { command: "/my_distribution", description: "💹 我的分销" },
    { command: "/my_chat", description: "🌟 我的会员" },
    { command: "/okx", description: "📈 实时汇率" },
    { command: "/cancel", description: "❌ 取消" },
    { command: "/update", description: "🔁 更新回话信息" },
    { command: "/help", description: "🤖 机器人使用帮助" }
]);

bot.on('callback_query', (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const data = JSON.parse(callbackQuery.data);
    const messageId = callbackQuery.message.message_id;
    const user = callbackQuery.message.from;
    // Respond based on the button clicked
    switch (data.action) {
        case 'add_robot':
            const robotMessage = getRobotMessage()
            bot.sendMessage(chatId, robotMessage);
            userStates[chatId] = 'awaiting_token'; // Set user state
            break;
        
        case 'product_settlement':
            bot.sendMessage(chatId, "查询时间已超过1分钟，请重新查询数据，提交结算")
            break;

        case 'stop_bot':
            stopBotMessage(data, chatId, messageId);
            break

        case 'run_bot':
            runBotMessage(data, chatId, messageId);
            break

        case 'set_servicer':
            // const settingServiceMessage = getSettingServiceMessage();
            // bot.sendMessage(chatId, settingServiceMessage, {
            //     reply_markup: {
            //         keyboard: [['选择用户']],
            //         resize_keyboard: true,
            //     }
            // })
            // .then(() => {
            //     bot.sendMessage(chatId, "⚠️ 如果是此账号，请点击此消息下方按钮。",  {
            //         reply_markup: {
            //             inline_keyboard: [
            //                 [{ text: '💁‍♀️ 设置此账号为客服', callback_data: JSON.stringify({
            //                     action: 'set_me_as_service',
            //                     sendBot: data.botUserName
            //                 }) }]
            //             ],
            //             one_time_keyboard: true
            //         },
            //     })
            // })
            setService(chatId, data);
            break
        
        case 'set_me_as_service':
            setMeAsService(data, user, chatId, messageId)
            break
    }

    // Acknowledge the callback query to remove the loading state
    bot.answerCallbackQuery(callbackQuery.id);
});

// Start command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    start(bot, chatId, msg)
});

// Do something command
bot.onText(/\/mercant_portal/, (msg) => {
    const chatId = msg.chat.id;
    delete userStates[chatId]; // Clear user state
    mercant(bot, chatId);
});

bot.onText(/\/my_distribution/, (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    delete userStates[chatId]; // Clear user state
    distribution(bot, chatId, messageId);
});

bot.onText(/\/my_chat/, (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    delete userStates[chatId]; // Clear user state
    chat(bot, chatId, messageId);
});

bot.onText(/\/okx/, (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    delete userStates[chatId]; // Clear user state
    okx(bot, chatId, messageId);
});

bot.onText(/\/update/, (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    delete userStates[chatId]; // Clear user state
    update(bot, chatId, messageId);
});

bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    delete userStates[chatId]; // Clear user state
    help(bot, chatId, messageId);
});

bot.onText(/\🤖 机器人/, (msg) => {
    const chatId = msg.chat.id;
    if (userStates[chatId]) delete userStates[chatId]; // Clear user state
    robot(bot, chatId);
});

bot.onText(/\📦 商品/, (msg) => {
    const chatId = msg.chat.id;
    if (!userStates[chatId]) {
        // mercant(bot, chatId);
    }
});

bot.onText(/\👥 会员群/, (msg) => {
    const chatId = msg.chat.id;
    if (!userStates[chatId]) {
        // mercant(bot, chatId);
    }
});

bot.onText(/\👣 每日访问/, (msg) => {
    const chatId = msg.chat.id;
    if (!userStates[chatId]) {
        // mercant(bot, chatId);
    }
});

bot.onText(/\📋 店铺订单/, (msg) => {
    const chatId = msg.chat.id;
    if (!userStates[chatId]) {
        // mercant(bot, chatId);
    }
});

bot.onText(/\📈 成交统计/, (msg) => {
    const chatId = msg.chat.id;
    if (!userStates[chatId]) {
        // mercant(bot, chatId);
    }
});

bot.onText(/\⚙️ 店铺设置/, (msg) => {
    const chatId = msg.chat.id;
    if (!userStates[chatId]) {
        // mercant(bot, chatId);
    }
});

bot.onText(/\💹 经营分析/, (msg) => {
    const chatId = msg.chat.id;
    if (!userStates[chatId]) {
        // mercant(bot, chatId);
    }
});

bot.onText(/\💰 商家结算/, (msg) => {
    const chatId = msg.chat.id;
    if (!userStates[chatId]) {
        // mercant(bot, chatId);
    }
});

bot.onText(/\🛍 我的店铺/, msg => {
    const chatId = msg.chat.id;
    mercant(bot, chatId)
})

bot.onText(/\💹 我的分销/, msg => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    distribution(bot, chatId, messageId);
})

bot.onText(/\🌟 我的会员/, msg => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    chat(bot, chatId, messageId);
})

bot.onText(/\📦 分销商品/, msg => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    products(bot, chatId, messageId);
    
})

bot.onText(/\💰 分销结算/, msg => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    productSettlement(bot, chatId);
})

// Cancel command
bot.onText(/\/cancel/, (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    if (userStates[chatId]) {
        delete userStates[chatId]; // Clear user state
        cancel(bot, chatId, messageId)
    } else {
        bot.sendMessage(chatId, '已取消流程。');
    }
});

// Handle user input for token validation
bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    if (userStates[chatId] === 'awaiting_token' && 
        msg.text !== "/start" &&
        msg.text !== "🆕 添加机器人" && 
        msg.text !== "/cancel" && 
        msg.text !== "/mercant_portal" && 
        msg.text !== "🤖 机器人" && 
        msg.text !== "/help" && 
        msg.text !== "/update" && 
        msg.text !== "/okx" && 
        msg.text !== "/my_chat" && 
        msg.text !== "/my_distribution") {
        const userInput = msg.text;
        // Validate the token format
        const user =msg.from
        validateToken(userInput, chatId, user);
    }
});

// Token validation function
function validateToken(token, chatId, user) {
    const tokenRegex = /^[0-9]{8,10}:[A-Za-z0-9_-]{35}$/; // Regex to validate token format

    if (tokenRegex.test(token)) {
        bot.getMe()
            .then(() => {
                addRobot(token, chatId, user)
                delete userStates[chatId]; // Clear user state
            })
            .catch(() => {
                bot.sendMessage(chatId, '机器人 Token 格式错误。发送 /cancel 取消设置。');
            });
    } else {
        bot.sendMessage(chatId, '机器人 Token 格式错误。发送 /cancel 取消设置。');
    }
}