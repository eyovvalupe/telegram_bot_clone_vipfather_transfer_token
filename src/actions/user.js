const User = require('../Models/User')

function addUser(data) {
    User.findOne({userId: data.userId})
    .then(res => {
        if (res === null) {
            const newUser = new User({
                userId: data.userId,
                firstName: data.firstName,
                userName: data.userName
            })
            newUser.save()
                .then(() => console.log('user saved!'))
                .catch(err => console.error(err))
        }
    })
}

async function getUserInfo(userId) {
    let me;
    await User.findOne({userId}).then(res => me = res)
    return me
}

module.exports = { addUser, getUserInfo }