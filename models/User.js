const mongoose = require("mongoose");
const Schema = mongoose.Schema

const User = new Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, unique: true},
    roles: [{type: String, ref: 'Role'}]
})

module.exports = mongoose.model('User', User)