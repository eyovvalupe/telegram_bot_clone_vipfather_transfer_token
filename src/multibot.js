const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const { getUserDetails } = require("./actions/user");
// const botToken = "7350756188:AAH_dZqGJDMDUdgY6YpJsk3SvRqAb8bRR1Q";
// const botToken = '7307700056:AAFS_khk783917vQl5B2YPSgUBjQRnnOWW8';
const botToken = '7252471886:AAE72kRtT66Dft2xbq9ZWNCtFzF6JQ-hiAo';

const app = express();
const port = process.env.PORT || 3000;

// Replace 'YOUR_BOT_TOKEN' with your actual bot token
const TELEGRAM_API_URL = `https://api.telegram.org/bot${botToken}`;

// Middleware
app.use(bodyParser.json());

const adminId = 7123669053; // Admin's Telegram user ID
const userIds = [];
let userMessages = {};

// Set up a route to handle incoming updates
app.post("/webhook", async (req, res) => {
  const update = req.body;

  // Check if the message is from a user
  if (update.message) {
    const msg = update.message;
    const chatId = msg.chat.id;
    const messageText = msg.text;
    const messageId = msg.message_id;

    // // Check if the message is from the admin
    if (chatId === adminId && !msg.reply_to_message) {
      await sendMessage(chatId, "You have to reply one message");
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
      await sendMessage(adminId, showMessage, { parse_mode: "HTML" });
    }

    if (msg.reply_to_message) {
      const messagetoreplyid = (
        parseInt(msg.reply_to_message.message_id) - 1
      ).toString();
      const userId = userMessages[messagetoreplyid]["chatId"];
      await sendMessage(userId, messageText, {
        reply_to_message_id: messagetoreplyid,
      });
    }
  }

  res.sendStatus(200); // Respond to Telegram
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

async function sendMessage(chatId, sendText, data) {
  await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
    method: "POST",
    body: JSON.stringify({
      chat_id: chatId,
      text: sendText,
      ...data,
    }),
    headers: { "Content-Type": "application/json" },
  });
}
