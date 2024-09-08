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
const productSettlement = require("./commands/productSettlement")
const { addRobot, stopBotMessage, runBotMessage, setService, setMeAsService } = require("./actions/bot")
const options = require("./commands/options")
const distributedProducts = require("./commands/distributedProducts")
const products = require("./commands/products")
const chooseBot = require("./commands/chooseBot")

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
            setService(chatId, data);
            break
        
        case 'set_me_as_service':
            setMeAsService(data, chatId, messageId)
            break

        case 'chs_bot_for_pdts':
            chooseBot(data, chatId);
            break

        case 'add_product':
            console.log("=========>", data)
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
    const user = msg.from;
    if (userStates[chatId]) delete userStates[chatId]; // Clear user state
    robot(bot, chatId, user);
});

bot.onText(/\📦 商品/, (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    const user = msg.from;
    if (!userStates[chatId]) {
        products(bot, chatId, messageId, user);
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
    distributedProducts(bot, chatId, messageId);
    
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