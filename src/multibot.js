const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const { getUserDetails } = require("./actions/user");
const { sendMessage } = require("./actions/bot");
const bot = require('./bot')

const app = express();
const port = process.env.PORT || 3000;

bot.onText('yaaa', (msg) => {
  const chatId = msg.chat.id
  bot.sendMessage(chatId,'I am here')
})
// Middleware
app.use(bodyParser.json());

const adminId = 7123669053; // Admin's Telegram user ID
const userIds = [];
let userMessages = {};

// Set up a route to handle incoming updates
app.post("/webhook/:botToken", async (req, res) => {
  const update = req.body;

  console.log(req.params.botToken)
  const TELEGRAM_API_URL = `https://api.telegram.org/bot${req.params.botToken}`;

  // Check if the message is from a user
  if (update.message) {
    const msg = update.message;
    const chatId = msg.chat.id;
    const messageText = msg.text;
    const messageId = msg.message_id;

    // // Check if the message is from the admin
    if (chatId === adminId && !msg.reply_to_message) {
      await sendMessage(chatId, "You have to reply one message", {}, TELEGRAM_API_URL);
    } else if (messageText !== "/start" && chatId !== adminId) {
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
      await sendMessage(adminId, showMessage, { parse_mode: "HTML" }, TELEGRAM_API_URL);
    }

    if (msg.reply_to_message) {
      const messagetoreplyid = (
        parseInt(msg.reply_to_message.message_id) - 1
      ).toString();
      const userId = userMessages[messagetoreplyid]["chatId"];
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

// async function sendMessage(chatId, sendText, data, TELEGRAM_API_URL) {
//   await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
//     method: "POST",
//     body: JSON.stringify({
//       chat_id: chatId,
//       text: sendText,
//       ...data,
//     }),
//     headers: { "Content-Type": "application/json" },
//   });
// }
