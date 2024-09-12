const express = require("express");
const bodyParser = require("body-parser");
const { getUserDetails } = require("./actions/user");
const { sendMessage, getBotInfoByToken } = require("./actions/bot");

const database = require('./database');
const { isEmpty } = require("./utils");

database()

const app = express();
app.use(bodyParser.json());


const port = process.env.PORT || 3000;

const adminId = {}; // Admin's Telegram user ID
const userIds = [];
let userMessages = {};

// Set up a route to handle incoming updates
app.post("/webhook/:botToken", async (req, res) => {
  const update = req.body;

  const TELEGRAM_API_URL = `https://api.telegram.org/bot${req.params.botToken}`;

  // const botInfo = await getBotInfo(req.params.botToken)
  // console.log(botInfo)
  const botToken = req.params.botToken
  const botInfo = await getBotInfoByToken(botToken)
  if (isEmpty(adminId[botInfo.botId])) adminId[botInfo.botId] = parseInt(botInfo.serviceUser);

  // Check if the message is from a user
  if (update.message) {
    const msg = update.message;
    const chatId = msg.chat.id;
    const messageText = msg.text;
    const messageId = msg.message_id;

    // // Check if the message is from the admin
    if (chatId === adminId[botInfo.botId] && !msg.reply_to_message) {
      await sendMessage(chatId, "You have to reply one message", {}, TELEGRAM_API_URL);
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
      await sendMessage(adminId[botInfo.botId], showMessage, { parse_mode: "HTML" }, TELEGRAM_API_URL);
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
      await sendMessage(userId, messageText, {
        reply_to_message_id: messagetoreplyid,
      }, TELEGRAM_API_URL);
    }

  }

  res.sendStatus(200); // Respond to Telegram
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

