const { Schema, model } = require('mongoose')

const BotModelSchema = new Schema({
    token: {
        type: String,
        required: true,
        // unique: true,
        timestamps: true
    },
    userId: {
        type: String,
        required: true,
    },
    botId: {
        type: String,
        required: true,
    },
    botFirstName: {
        type: String,
        required: true,
    },
    botUserName: {
        type: String,
        required: true,
    },
    onoffState: {
        type: Boolean,
        required: true,
    },
    serviceUser: {
        type: String,
    }
})

module.exports = BotModel = model("botModel", BotModelSchema)