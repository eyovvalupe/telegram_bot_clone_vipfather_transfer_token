const { checkProductsForBot, productInfoMessage } = require("../actions/product")

module.exports = async (data, chatId) => {
    try {
        const hasPdts = await checkProductsForBot(data.botName)
        productInfoMessage(chatId, hasPdts, data.botName)
    } catch (error) {
        console.error(error)
    }
}
