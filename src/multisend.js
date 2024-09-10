const TelegramBot = require("node-telegram-bot-api");

// const token = "6448720112:AAHjsweIOly4kpbo2z94E5cCO4zgqlRCRac";
const token = "7307700056:AAFS_khk783917vQl5B2YPSgUBjQRnnOWW8";


const bot = new TelegramBot(token, { polling: true });

const adminId = 7123669053; // Admin's Telegram user ID

// const userIds = [6739969349, 7442731007]; // User IDs of the two users
const userIds = [];

// Store messages for each user
let userMessages = {};

// Listen for any kind of message. There are different kinds of messages.
bot.on("message", async (msg) => {
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
    const userInfo = await getUserDetails(chatId);
    const showMessage = `
<b>Forwarded from @${userInfo.username}</b>
${messageText}
    `;
    bot.sendMessage(adminId, showMessage, { parse_mode: "HTML" });
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

async function getUserDetails(chatId) {
  let userInfo;
  await bot.getChat(chatId).then((chat) => {
    userInfo = chat;
  });
  return userInfo;
}
