const { getRobotMessage } = require('./utils')
const bot = require('./bot')

async function robotMessage(query) {
    const robotMessage = getRobotMessage();
    await bot.sendMessage(
        query.message.chat.id,
        robotMessage
    )
}

module.exports = {
    robot_message: robotMessage
}