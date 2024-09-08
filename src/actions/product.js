const bot = require('../bot')
const Product = require('../Models/Product');
const { hasProductMessage, noHasProductMessage } = require('../utils');

async function initializeProduct(botData, user) {
    const productSpace = new Product({
        userId: user.id,
        botUserName: botData.user_name,
        product: []
    });
    productSpace.save()
        .then(() => {
            console.log('Product space initialized!')
        })
        .catch(err => console.error(err));
}

async function checkProductsForBot(botUserName) {
    let hasPdts;
    await Product.findOne({botUserName})
            .then(res => {
                if (res.product.length > 0) {
                    hasPdts = true;
                } else hasPdts = false
            })
    return hasPdts;
}

function productInfoMessage(chatId, hasPdts, botUserName) {
    if (hasPdts) {
        const hasPdtsMessage = hasProductMessage(botUserName)
        bot.sendMessage(chatId, hasPdtsMessage)
    } else {
        const noHasPdtsMessage = noHasProductMessage()
        bot.sendMessage(chatId, noHasPdtsMessage, {
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: '➕ 创建商品',
                        callback_data: JSON.stringify({
                            action: 'add_product',
                            botUserName
                        })
                    }]
                ]
            }
        })
    }
}

function addProductMessage(botUserName, pdtName) {
    
}

module.exports = { addProductMessage, productInfoMessage, checkProductsForBot, initializeProduct }