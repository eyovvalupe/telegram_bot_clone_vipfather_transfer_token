const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
    userId: {
        type: String,
        required: true,
        // unique: true,
        timestamps: true
    },
    firstName: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true
    },
    shopId: {
        type: Number,
    },
    wallet: {
        type: String,
    },
    agree: {
        type: Boolean,
        required: true
    },
    lastVisitDate: {
        type: String,
        required: true
    }
})

module.exports = UserModel = model("userModel", UserSchema)