const mongoose = require('mongoose')
const { Message } = require("./schema")
const { ObjectId } = mongoose.SchemaTypes

const schema = new mongoose.Schema({
   users: [ObjectId, ObjectId],
   chats: [Message]
})

const chat = mongoose.model('chats', schema)

module.exports = chat