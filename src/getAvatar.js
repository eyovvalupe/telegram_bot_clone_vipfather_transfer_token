const TelegramBot = require('node-telegram-bot-api');

// Replace with your bot token
const token = '6448720112:AAHjsweIOly4kpbo2z94E5cCO4zgqlRCRac';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Function to get user avatar by user ID
function getUserAvatar(userId, chatId) {
    bot.getUserProfilePhotos(userId)
        .then((photos) => {
            if (photos.total_count > 0) {
                // Get the file_id of the first photo
                const fileId = photos.photos[0][0].file_id;

                // Get the file information
                bot.getFile(fileId)
                    .then((file) => {
                        const filePath = file.file_path;
                        const photoUrl = `https://api.telegram.org/file/bot${token}/${filePath}`;

                        // Send the photo URL back to the chat
                        const avatar = `
                            <img src="${photoUrl}" alt="" width="20" height="20">
                        `
                        // bot.sendMessage(chatId, `Here is the avatar: ${photoUrl}`);
                        bot.sendPhoto(chatId, photoUrl, {caption: 'here is photo'});
                    })
                    .catch((error) => {
                        console.error('Error getting file:', error);
                    });
            } else {
                bot.sendMessage(chatId, 'User has no profile picture.');
            }
        })
        .catch((error) => {
            console.error('Error getting user profile photos:', error);
        });
}

// Listen for any kind of message
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id; // Get the user ID from the message

    // Call the function to get the user's avatar
    getUserAvatar(userId, chatId);
});