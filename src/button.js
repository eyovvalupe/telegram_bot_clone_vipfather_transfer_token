const TelegramBot = require('node-telegram-bot-api');

// Replace these with your actual bot tokens
const tokens = [
    'first_token', 
    'second_token',
    'third_token',
];

// Function to create and set up a bot
async function setupBot(token) {
    const bot = new TelegramBot(token, { polling: true });

    // Handle the /start command
    bot.onText(/\/start/, (msg) => {
        const chatId = msg.chat.id;
        bot.sendMessage(chatId, 'Welcome! This is your bot.');
    });

    // Echo back any other message
    bot.on('message', (msg) => {
        const chatId = msg.chat.id;
        bot.sendMessage(chatId, `You said: ${msg.text}`);
    });

    console.log(`Bot with token ${token} is now polling...`);
}

// Main function to set up all bots
async function main() {
    const botTasks = tokens.map(token => setupBot(token));
    await Promise.all(botTasks);
}

// Start the bot setup
main().catch(error => {
    console.error('Error starting bots:', error);
});