const bot = require('../bot')
const Product = require('../Models/Product');
const { hasProductMessage, noHasProductMessage, getAddProductMessage } = require('../utils');

async function addProduct(pdtName, user, botUserName) {
    const productSpace = new Product({
        userId: user.id,
        botUserName: botUserName,
        productName: pdtName,
        productDescription: '',
        priority: 0,
        productGroup: [],
        productUrl: `https://t.me/${botUserName}?start=home`
    });
    await productSpace.save()
        .then(() => {
            console.log('Product has been added!')
        })
        .catch(err => console.error(err));
}

async function checkProductsForBot(botUserName) {
    let hasPdts;
    await Product.findOne({botUserName})
            .then(res => {
                if (res ===null) {
                    hasPdts = false;
                } else hasPdts = true
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

async function getPdtListFromBotUSerName(botUserName) {
    let pdtList;
    await Product.find({botUserName})
        .then(res => {
            pdtList = res;
        });
    return pdtList;
}

async function addProductMessage(data, chatId, messageId, userStates) {
    const addProductMessageText = getAddProductMessage()
    bot.sendMessage(chatId, addProductMessageText, {
        reply_to_message_id: messageId 
    })
    console.log(data)
    userStates[chatId] = `${data.botUserName}`
}

module.exports = { addProductMessage, productInfoMessage, checkProductsForBot, addProduct }