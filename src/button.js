const TelegramBot = require('node-telegram-bot-api');

// Replace with your own token from @BotFather
const token = '7281969523:AAHnEuVCItQwsXwCChumBZQDRdCB1F-Ay-0';
const bot = new TelegramBot(token, { polling: true });

// Sample data for demonstration
const resultCache = {};
const resultsPerPage = 5;

// Function to handle incoming messages
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Welcome! Use /search to find results.');
});

// Function to handle search command
bot.onText(/\/search (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const query = match[1];
    
    // Simulate fetching results for the query
    const results = Array.from({ length: 20 }, (_, i) => ({
        title: `Result ${i + 1} for "${query}"`,
        link: `http://example.com/${i + 1}`
    }));
    
    resultCache[chatId] = results;
    
    // Start with the first page
    const previousMessageId = await sendResultsPage(chatId, 1, query);
    resultCache[chatId].previousMessageId = previousMessageId;
});

// Function to send results page
async function sendResultsPage(chatId, page, query) {
    const results = resultCache[chatId];
    const startIdx = (page - 1) * resultsPerPage;
    const endIdx = Math.min(startIdx + resultsPerPage, results.length);
    const totalPages = Math.ceil(results.length / resultsPerPage);
    const pageResults = results.slice(startIdx, endIdx);

    const keyboard = [
        ...pageResults.map((product) => [
            {
                text: product.title,
                callback_data: `view_${product.link}`,
            },
        ]),
        [
            {
                text: 'Previous',
                callback_data: 'prev',
            },
            {
                text: `${page}/${totalPages}`,
                callback_data: 'page',
            },
            {
                text: 'Next',
                callback_data: 'next',
            },
        ],
    ];

    const options = {
        reply_markup: {
            inline_keyboard: keyboard,
        },
    };

    const message = `This is the result for "${query}"`;

    // Delete the previous message if it exists
    if (results.previousMessageId) {
        try {
            await bot.deleteMessage(chatId, results.previousMessageId);
        } catch (error) {
            console.error('Error deleting previous message:', error);
        }
    }

    // Send the new message and return the message ID for future deletions
    const sentMessage = await bot.sendMessage(chatId, message, options);
    results.previousMessageId = sentMessage.message_id;
    return sentMessage.message_id;
}

// Handling callback queries for pagination
bot.on('callback_query', async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;
    const results = resultCache[chatId];

    if (!results) return;

    let page = parseInt(callbackQuery.message.text.match(/(\d+)\/(\d+)/)[1]);
    const totalPages = Math.ceil(results.length / resultsPerPage);

    if (data === 'next' && page < totalPages) {
        page++;
    } else if (data === 'prev' && page > 1) {
        page--;
    } else {
        return; // Do nothing if the page is out of bounds
    }

    // Update the results page
    await sendResultsPage(chatId, page, callbackQuery.message.text);
});

// Start the bot
console.log('Bot is running...');