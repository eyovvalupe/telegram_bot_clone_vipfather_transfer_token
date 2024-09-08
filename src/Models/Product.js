const { Schema, model } = require('mongoose')

const ProducModelSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    botUserName: {
        type: String,
        required: true,
    },
    serviceUser: {
        type: String,
    },
    productName: {
        type: String,
        required: true,
    },
    productDescription: {
        type: String,
    },
    priority: {
        type: Number,
        required: true,
    },
    productGroup: {
        type: Array
    },
    productUrl: {
        type: String
    }

})

module.exports = ProductModel = model("productModel", ProducModelSchema)