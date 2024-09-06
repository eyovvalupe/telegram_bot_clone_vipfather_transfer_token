const TelegramBot = require('node-telegram-bot-api');

// Replace with your bot tokens
const bot1Token = '7281969523:AAHnEuVCItQwsXwCChumBZQDRdCB1F-Ay-0'; // Bot that shows the inline menu
const bot2Token = '7350756188:AAH_dZqGJDMDUdgY6YpJsk3SvRqAb8bRR1Q'; // Bot that sends the message

// Create bot instances
const bot1 = new TelegramBot(bot1Token, { polling: true });
const bot2 = new TelegramBot(bot2Token, { polling: true });

// Set up inline menu for Bot 1
bot1.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    const options = {
        reply_markup: {
            inline_keyboard: [[
                { text: 'Send Message from Bot 2', callback_data: 'send_message' }
            ]]
        }
    };

    bot1.sendMessage(chatId, 'Choose an option:', options);
});

// Handle callback from the inline menu in Bot 1
bot1.on('callback_query', (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;

    if (callbackQuery.data === 'send_message') {
        // Trigger Bot 2 to send a message
        bot2.sendMessage(chatId, 'Hello from Bot 2!');
        bot1.answerCallbackQuery(callbackQuery.id, { text: 'Message sent from Bot 2!' });
    }
});

// Optional: Set up a command for Bot 2 to respond to a specific command
bot2.onText(/\/start/, (msg) => {
    bot2.sendMessage(msg.chat.id, 'Bot 2 is ready to send messages!');
});