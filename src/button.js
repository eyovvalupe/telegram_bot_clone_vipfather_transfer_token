const TelegramBot = require('node-telegram-bot-api');

// Replace with your bot token
const token = '7281969523:AAHnEuVCItQwsXwCChumBZQDRdCB1F-Ay-0';
const bot = new TelegramBot(token, { polling: true });

let userGroups = {}; // Object to store user group memberships

// Listen for messages in groups
bot.on('message', (msg) => {
    const chatId = msg.chat.id; // Group chat ID
    const userId = msg.from.id; // User ID of the person who sent the message

    // Check if the message is from a group
    if (msg.chat.type === 'group' || msg.chat.type === 'supergroup') {
        // Initialize userGroups for the user if not already done
        if (!userGroups[userId]) {
            userGroups[userId] = new Set(); // Use a Set to avoid duplicates
        }

        // Add the group ID to the user's set of groups
        userGroups[userId].add(chatId);

        // Optionally, send a welcome message
        bot.sendMessage(chatId, `Hello, ${msg.from.first_name}! You can check your groups using /mygroups.`);
    }
});

// Command to list groups the user is part of
bot.onText(/\/mygroups/, (msg) => {
    const userId = msg.from.id;
    const chatId = msg.chat.id;

    if (userGroups[userId] && userGroups[userId].size > 0) {
        const groupsList = Array.from(userGroups[userId]).map(id => `Group ID: ${id}`).join('\n');
        bot.sendMessage(chatId, `You are a member of the following groups:\n${groupsList}`);
    } else {
        bot.sendMessage(chatId, 'You are not a member of any groups tracked by this bot.');
    }
});