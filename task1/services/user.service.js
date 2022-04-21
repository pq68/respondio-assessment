const User = require('../models/user.model');

const UserService = {
    create: create,
    getUserBySenderId: getUserBySenderId,
}

async function create(profile) {
    try {
        let newUser = new User(profile);
        return await newUser.save();
    } catch(e) {
        throw Error('Error ' + e.message);
    }
}

async function getUserBySenderId(senderId) {
    try {
        return await User.findOne({
            where: {
                sender_id: senderId
            }
        });
    } catch(e) {
        throw Error('Error ' + e.message);
    }
}

module.exports = UserService;