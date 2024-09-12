const bot = require("./bot");
const start = require("./commands/start");
const mercant = require("./commands/mercant");
const distribution = require("./commands/distribution");
const chat = require("./commands/chat");
const okx = require("./commands/okx");
const cancel = require("./commands/cancel");
const update = require("./commands/update");
const help = require("./commands/help");
const robot = require("./commands/robot");
const database = require("./database");
const { getRobotMessage, getSettingWalletMessage } = require("./utils");
const productSettlement = require("./commands/productSettlement");
const {
  stopBotMessage,
  runBotMessage,
  setService,
  setMeAsService,
  validateToken,
  goback,
} = require("./actions/bot");
const distributedProducts = require("./commands/distributedProducts");
const products = require("./commands/products");
const {
  addProductMessage,
  addProduct,
  productDetailById,
} = require("./actions/product");
const chooseBot = require("./commands/chooseBot");
const {
  setAgree,
  setWalletAddressMessage,
  getUserInfo,
  setWalletAddress,
} = require("./actions/user");
const chattingGroup = require("./commands/chattingGroup");
const visitData = require("./commands/visitData");
const orderBook = require("./commands/orderBook");
const transactionHistory = require("./commands/transactionHistory");
const analysis = require("./commands/analysis");
const sendTransaction = require("./commands/sendTransaction");
const registerGenerateCommand = require("./commands/generate");
const registerBalanceCommand = require("./commands/balance");
const registerInfoCommand = require("./commands/info");
const registerTransferCommand = require("./commands/transfer");

const express = require("express");
const bodyParser = require("body-parser");
const { getUserDetails } = require("./actions/user");
const { sendMessage, getBotInfoByToken } = require("./actions/bot");
const { isEmpty } = require("./utils");

const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 3000;
const adminId = {};
const userIds = [];
let userMessages = {};
let isGenerateRegistered = false;
let isBalanceRegistered = false;
let isTransferRegistered = false;
let isInfoRegistered = false;

database();

const userStates = {};

bot.setMyCommands([
  { command: "/start", description: "💰 开启财富之门" },
  { command: "/mercant_portal", description: "🛍 我的店铺" },
  { command: "/my_distribution", description: "💹 我的分销" },
  { command: "/my_chat", description: "🌟 我的会员" },
  { command: "/okx", description: "📈 实时汇率" },
  { command: "/cancel", description: "❌ 取消" },
  { command: "/update", description: "🔁 更新回话信息" },
  { command: "/help", description: "🤖 机器人使用帮助" },
]);

bot.on("callback_query", async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = JSON.parse(callbackQuery.data);
  const messageId = callbackQuery.message.message_id;
  // Respond based on the button clicked
  switch (data.action) {
    case "agree":
      // console.log(data)
      setAgree(data.userId, chatId, messageId);
      break;

    case "set_user_trc20":
      userStates[chatId] = "awaiting_wallet_address";
      const user = await getUserInfo(data.userId);
      const settingMessage = getSettingWalletMessage(user);
      bot.sendMessage(chatId, settingMessage);
      break;

    case "add_robot":
      userStates[chatId] = "awaiting_token"; // Set user state
      const robotMessage = getRobotMessage();
      bot.sendMessage(chatId, robotMessage);
      break;

    case "product_settlement":
      bot.sendMessage(chatId, "查询时间已超过1分钟，请重新查询数据，提交结算");
      break;

    case "stop_bot":
      stopBotMessage(data, chatId, messageId);
      break;

    case "run_bot":
      runBotMessage(data, chatId, messageId);
      break;

    case "set_servicer":
      setService(chatId, data);
      break;

    case "set_service":
      setMeAsService(data, chatId, messageId);
      break;

    case "chs_bot_for_pdts":
      chooseBot(data, chatId);
      break;

    case "add_product":
      addProductMessage(data, chatId, messageId, userStates);
      break;

    case "products_list":
      chooseBot(data, chatId);
      break;

    case "product_detail":
      productDetailById(data.pdtId, chatId);
      break;

    case "back":
      goback(chatId, messageId);
      break;
  }

  // Acknowledge the callback query to remove the loading state
  bot.answerCallbackQuery(callbackQuery.id);
});

// Start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  delete userStates[chatId]; // Clear user state
  start(bot, chatId, msg);
});

// Do something command
bot.onText(/\/mercant_portal/, (msg) => {
  const chatId = msg.chat.id;
  const user = msg.from;
  delete userStates[chatId]; // Clear user state
  mercant(bot, chatId, user);
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
  if (userStates[chatId] !== "awaiting_wallet_address") {
    delete userStates[chatId]; // Clear user state
    robot(bot, chatId, user);
  }
});

bot.onText(/\📦 商品/, (msg) => {
  const chatId = msg.chat.id;
  const messageId = msg.message_id;
  const user = msg.from;
  if (
    userStates[chatId] !== "awaiting_token" &&
    userStates[chatId] !== "awaiting_wallet_address"
  ) {
    delete userStates[chatId]; // Clear user state
    products(bot, chatId, messageId, user);
  }
});

bot.onText(/\👥 会员群/, (msg) => {
  const chatId = msg.chat.id;
  if (
    userStates[chatId] !== "awaiting_token" &&
    userStates[chatId] !== "awaiting_wallet_address"
  ) {
    delete userStates[chatId]; // Clear user state
    chattingGroup(bot, chatId);
  }
});

bot.onText(/\👣 每日访问/, (msg) => {
  const chatId = msg.chat.id;
  const messageId = msg.message_id;
  if (
    userStates[chatId] !== "awaiting_token" &&
    userStates[chatId] !== "awaiting_wallet_address"
  ) {
    delete userStates[chatId]; // Clear user state
    visitData(bot, chatId, messageId);
  }
});

bot.onText(/\📋 店铺订单/, (msg) => {
  const chatId = msg.chat.id;
  const messageId = msg.message_id;
  if (
    userStates[chatId] !== "awaiting_token" &&
    userStates[chatId] !== "awaiting_wallet_address"
  ) {
    delete userStates[chatId]; // Clear user state
    orderBook(bot, chatId, messageId);
  }
});

bot.onText(/\📈 成交统计/, (msg) => {
  const chatId = msg.chat.id;
  const messageId = msg.message_id;
  if (
    userStates[chatId] !== "awaiting_token" &&
    userStates[chatId] !== "awaiting_wallet_address"
  ) {
    delete userStates[chatId]; // Clear user state
    transactionHistory(bot, chatId, messageId);
  }
});

bot.onText(/\⚙️ 店铺设置/, (msg) => {
  const chatId = msg.chat.id;
  const user = msg.from;
  if (userStates[chatId] !== "awaiting_token") {
    delete userStates[chatId]; // Clear user state
    setWalletAddressMessage(chatId, user.id);
  }
});

bot.onText(/\💹 经营分析/, (msg) => {
  const chatId = msg.chat.id;
  if (
    userStates[chatId] !== "awaiting_token" &&
    userStates[chatId] !== "awaiting_wallet_address"
  ) {
    delete userStates[chatId]; // Clear user state
    analysis(bot, chatId);
  }
});

bot.onText(/\💰 商家结算/, (msg) => {
  const chatId = msg.chat.id;
  const user = msg.from;
  if (
    userStates[chatId] !== "awaiting_token" &&
    userStates[chatId] !== "awaiting_wallet_address"
  ) {
    delete userStates[chatId]; // Clear user state
    sendTransaction(bot, chatId, user);
  }
});

bot.onText(/\🛍 我的店铺/, (msg) => {
  const chatId = msg.chat.id;
  const user = msg.from;
  mercant(bot, chatId, user);
});

bot.onText(/\💹 我的分销/, (msg) => {
  const chatId = msg.chat.id;
  const messageId = msg.message_id;
  distribution(bot, chatId, messageId);
});

bot.onText(/\🌟 我的会员/, (msg) => {
  const chatId = msg.chat.id;
  const messageId = msg.message_id;
  chat(bot, chatId, messageId);
});

bot.onText(/\📦 分销商品/, (msg) => {
  const chatId = msg.chat.id;
  const messageId = msg.message_id;
  distributedProducts(bot, chatId, messageId);
});

bot.onText(/\💰 分销结算/, (msg) => {
  const chatId = msg.chat.id;
  const messageId = msg.message_id;
  const user = msg.from;
  productSettlement(bot, chatId, user);
});

bot.onText(/\/generate/, (msg) => {
  if (!isGenerateRegistered) {
    registerGenerateCommand(bot, msg);
    isGenerateRegistered = true;
  }
});

bot.onText(/\/balance/, (msg) => {
  if (!isBalanceRegistered) {
    registerBalanceCommand(bot, msg);
    isBalanceRegistered = true;
  }
});

bot.onText(/\/info/, (msg) => {
  const chatId = msg.chat.id;
  if (!isInfoRegistered) {
    registerInfoCommand(bot, chatId);
    isInfoRegistered = true;
  }
});

bot.onText(/\/transfer/, (msg) => {
  if (!isTransferRegistered) {
    registerTransferCommand(bot, msg);
    isTransferRegistered = true; // Mark as registered
  }
});

// Cancel command
bot.onText(/\/cancel/, (msg) => {
  const chatId = msg.chat.id;
  const messageId = msg.message_id;
  if (userStates[chatId] !== undefined) {
    delete userStates[chatId]; // Clear user state
    cancel(bot, chatId, messageId);
  } else {
    bot.sendMessage(chatId, "已取消流程。");
  }
});

// Handle user input for token validation
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const messageId = msg.message_id;
  const user = msg.from;
  const input = msg.text;

  if (
    userStates[chatId] === "awaiting_token" &&
    msg.text !== "/start" &&
    msg.text !== "🆕 添加机器人" &&
    msg.text !== "/cancel" &&
    msg.text !== "/mercant_portal" &&
    msg.text !== "🤖 机器人" &&
    msg.text !== "/help" &&
    msg.text !== "/update" &&
    msg.text !== "/okx" &&
    msg.text !== "/my_chat" &&
    msg.text !== "/my_distribution"
  ) {
    // Validate the token format
    validateToken(input, chatId, user, userStates);
  }

  if (
    userStates[chatId] === "awaiting_wallet_address" &&
    msg.text !== "/start" &&
    msg.text !== "/cancel" &&
    msg.text !== "/mercant_portal" &&
    msg.text !== "⚙️ 店铺设置" &&
    msg.text !== "/help" &&
    msg.text !== "/update" &&
    msg.text !== "/okx" &&
    msg.text !== "/my_chat" &&
    msg.text !== "/my_distribution"
  ) {
    const userInput = msg.text;
    // Validate the token format
    await setWalletAddress(user.id, input, chatId);
  }

  if (
    userStates[chatId] !== "awaiting_token" &&
    userStates[chatId] !== undefined &&
    userStates[chatId] !== "awaiting_wallet_address"
  ) {
    await addProduct(input, user, userStates[chatId], chatId, messageId);
    delete userStates[chatId]; // Clear user state
  }
});

// Set up a route to handle incoming updates
app.post("/webhook/:botToken", async (req, res) => {
  const update = req.body;

  const TELEGRAM_API_URL = `https://api.telegram.org/bot${req.params.botToken}`;

  // const botInfo = await getBotInfo(req.params.botToken)
  // console.log(botInfo)
  const botToken = req.params.botToken;
  const botInfo = await getBotInfoByToken(botToken);
  if (isEmpty(adminId[botInfo.botId]))
    adminId[botInfo.botId] = parseInt(botInfo.serviceUser);

  // Check if the message is from a user
  if (update.message) {
    const msg = update.message;
    const chatId = msg.chat.id;
    const messageText = msg.text;
    const messageId = msg.message_id;

    // // Check if the message is from the admin
    if (chatId === adminId[botInfo.botId] && !msg.reply_to_message) {
      await sendMessage(
        chatId,
        "You have to reply one message",
        {},
        TELEGRAM_API_URL
      );
    } else if (messageText !== "/start" && chatId !== adminId[botInfo.botId]) {
      if (!userIds.includes(chatId)) userIds.push(parseInt(chatId));
      //       // Store user messages
      if (!userMessages) {
        userMessages = {};
      }
      userMessages[messageId] = {
        chatId,
        messageText,
      };
      // Notify the admin of the new message
      const userInfo = await getUserDetails(chatId);
      const showMessage = `
  <b>Forwarded from @${userInfo.username}</b>
  ${messageText}
          `;
      await sendMessage(
        adminId[botInfo.botId],
        showMessage,
        { parse_mode: "HTML" },
        TELEGRAM_API_URL
      );
    } else if (messageText !== "/start" && chatId === adminId[botInfo.botId]) {
      if (!userMessages) {
        userMessages = {};
      }
      userMessages[messageId] = {
        chatId,
        messageText,
      };
    }

    if (msg.reply_to_message) {
      const messagetoreplyid = (msg.reply_to_message.message_id - 1).toString();
      const userId = userMessages[messagetoreplyid].chatId;
      await sendMessage(
        userId,
        messageText,
        {
          reply_to_message_id: messagetoreplyid,
        },
        TELEGRAM_API_URL
      );
    }
  }

  res.sendStatus(200); // Respond to Telegram
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
