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
    product: {
        type: Array,
    }
})

module.exports = ProductModel = model("productModel", ProducModelSchema)