const bot = require('../bot')
const Product = require('../Models/Product');
const { hasProductMessage, noHasProductMessage, getAddProductMessage, getAddSuccessMessage, getProductDetailMessage } = require('../utils');
const { getUserInfo } = require('./user');

async function addProduct(pdtName, user, botUserName, chatId, messageId) {
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
    const addSuccessMessage = getAddSuccessMessage()
    bot.sendMessage(chatId, addSuccessMessage, {
        reply_markup: {
            inline_keyboard: [
                [{
                    text: `📦 ${pdtName} ✅`,
                    callback_data: JSON.stringify({
                        action: 'product'
                    })
                }]
            ]
        },
        reply_to_message_id: messageId
    })
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

async function productInfoMessage(chatId, hasPdts, botUserName) {
    if (hasPdts) {
        const hasPdtsMessage = hasProductMessage(botUserName)
        const products = await getPdtListFromBotUSerName(botUserName)
        const pdts = products.reduce((acc, cur) => {
            acc.push([{
                text: `📦 ${cur.productName} ✅`,
                callback_data: JSON.stringify({
                    action: 'product_detail',
                    pdtId: cur._id
                })
            }])
            return acc
        }, [])
        bot.sendMessage(chatId, hasPdtsMessage, {
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: '➕ 创建商品',
                        callback_data: JSON.stringify({
                            action: 'add_product',
                            botUserName
                        })
                    }],
                    ...pdts,
                    [
                        {
                            text: '⬅ 上一页',
                            callback_data: JSON.stringify({
                                action: 'before'
                            })
                        },{
                            text: '➡ 下一页',
                            callback_data: JSON.stringify({
                                action: 'next'
                            })
                        }
                    ],
                    [{
                        text: '🔙 返回',
                        callback_data: JSON.stringify({
                            action: 'back'
                        })
                    }]
                ]
            }
        })
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

async function getPdtInfo(id) {
    let product;
    await Product.findOne({_id: id})
        .then(res => product = res)
    return product   
}

async function productDetailById(id, chatId) {
    const product = await getPdtInfo(id);
    const productDetailMessage = getProductDetailMessage(product);

    bot.sendMessage(chatId, productDetailMessage, {
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard: [
                [{
                    text: '🖼 设置封面',
                    url: `https://t.me/${product.botUserName}`
                }],
                [{
                    text: '📝 设置名称',
                    callback_data: JSON.stringify({
                        action: 'set_product_name'
                    })
                }, {
                    text: '📃 设置描述',
                    callback_data: JSON.stringify({
                        action: 'set_product_description'
                    })
                },],
                [{
                    text: '✅ 首页设置',
                    callback_data: JSON.stringify({
                        action: 'set_product_priority'
                    })
                }, {
                    text: '🔢 设置排序',
                    callback_data: JSON.stringify({
                        action: 'set_product_order'
                    })
                },],
                [{
                    text: '💰 时长与价格',
                    callback_data: 'set_product_date_price'
                }, {
                    text: '👥 包含的会员群',
                    callback_data: JSON.stringify({
                        action: 'get_groups'
                    })
                },],
                [{
                    text: '💹 分析设置',
                    callback_data: JSON.stringify({
                        action: 'analyse_setting'
                    })
                }, {
                    text: '📊 销量统计',
                    callback_data: JSON.stringify({
                        action: 'total_saled_product'
                    })
                },],
                [{
                    text: '🚮 删除列表',
                    callback_data: JSON.stringify({
                        action: 'delete_bot',
                    })
                }],
                [{
                    text: '🔙 返回',
                    callback_data: JSON.stringify({
                        action: 'back',
                    })
                }]
            ]
        }
    })
}

module.exports = { productDetailById, getPdtInfo, addProductMessage, productInfoMessage, checkProductsForBot, addProduct }