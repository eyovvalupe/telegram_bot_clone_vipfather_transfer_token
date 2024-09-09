const TelegramBot = require("node-telegram-bot-api");

const token = "6448720112:AAHjsweIOly4kpbo2z94E5cCO4zgqlRCRac";

const bot = new TelegramBot(token, { polling: true });

const adminId = 7123669053; // Admin's Telegram user ID

// const userIds = [6739969349, 7442731007]; // User IDs of the two users
const userIds = [];

// Store messages for each user
let userMessages = {};

// Listen for any kind of message. There are different kinds of messages.
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;
  const messageId = msg.message_id;

  // Check if the message is from the admin
  if (chatId === adminId && !msg.reply_to_message) {
    bot.sendMessage(chatId, "You have to reply one message");
  } else if (messageText !== "/start" && chatId !== adminId) {
    if (!userIds.includes(chatId)) userIds.push(parseInt(chatId));
    // Store user messages
    if (!userMessages) {
      userMessages = {};
    }
    userMessages[messageId] = {
      chatId,
      messageText,
    };
    // Notify the admin of the new message
    const showMessage = `
<b>Forwarded from ${chatId} account</b>
${messageText}
    `
    bot.sendMessage(adminId, showMessage, {parse_mode: 'HTML'});
  }

  if (msg.reply_to_message) {
    const messagetoreplyid = (
      parseInt(msg.reply_to_message.message_id) - 1
    ).toString();
    const userId = userMessages[messagetoreplyid]["chatId"];
    bot.sendMessage(userId, messageText, {
      reply_to_message_id: messagetoreplyid,
    });
  }
});
