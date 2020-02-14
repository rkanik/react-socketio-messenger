const mongoose = require('mongoose')
const Types = mongoose.SchemaTypes

const message = new mongoose.Schema({
   message: String,
   sendBy: Types.ObjectId,
   seenAt: String,
   sentAt: String
})

module.exports = message