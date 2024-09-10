const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const { getUserDetails } = require("./actions/user");
const { getBotWebhookState } = require("./actions/bot");
const botToken = "7350756188:AAH_dZqGJDMDUdgY6YpJsk3SvRqAb8bRR1Q";

const app = express();
const port = process.env.PORT || 3000;

// Replace 'YOUR_BOT_TOKEN' with your actual bot token
const TELEGRAM_API_URL = `https://api.telegram.org/bot${botToken}`;
const serverUrl = "https://fc3c-188-43-136-41.ngrok-free.app/webhook";

// Middleware
app.use(bodyParser.json());

const adminId = 7123669053; // Admin's Telegram user ID
const userIds = [];
let userMessages = {};

// Set up a route to handle incoming updates
app.post("/webhook", async (req, res) => {
  const update = req.body;
  getBotWebhookState(botToken)
    .then(result => {
      console.log(result)
    })
    .catch(err => console.error(err))

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

async function setWebhook(botapitoken) {
  const url = new URL(`https://api.telegram.org/bot${botapitoken}/setWebhook`);
  url.searchParams.append("url", serverUrl);

  https
    .get(url, (resp) => {
      console.log(resp);
    })
    .on("error", (err) => {
      console.error("Error setting webhook:", err.message);
    });
}

//https://9ba6-188-43-136-41.ngrok-free.app
//curl "https://api.telegram.org/6448720112:AAHjsweIOly4kpbo2z94E5cCO4zgqlRCRac/getWebhookInfo"
//curl -X POST "https://api.telegram.org/bot6448720112:AAHjsweIOly4kpbo2z94E5cCO4zgqlRCRac/setWebhook" -d "url=https://9ba6-188-43-136-41.ngrok-free.app/webhook"

//Invoke-RestMethod -Uri "https://api.telegram.org/bot6448720112:AAHjsweIOly4kpbo2z94E5cCO4zgqlRCRac/setWebhook" -Method Post -Body "url=https://https://ffa5-188-43-136-46.ngrok-free.app/webhook"

// async function setWebHook() {
//     try {
//         await bot.telegram.setWebhook(`${TELEGRAM_API_URL}/setWebhook?url=${URL}`);
//         console.log('Webhook set successfully');
//     } catch (error) {
//         console.error('Error setting webhook:', error);
//     }
// };

