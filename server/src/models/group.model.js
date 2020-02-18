const mongoose = require('mongoose')
const { Message, GroupMember } = require("./schema")
const { ObjectId } = mongoose.SchemaTypes

const schema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
   },
   members: {
      type: [GroupMember],
      validate: {
         validator: me => me.length > 0
      }
   },
   messages: {
      type: [Message],
      default: [],
   },
   seenBy: {
      type: [ObjectId],
      default: []
   },
   thumbnail: String,
   createdAt: {
      type: Date,
      default: Date.now
   },
   createdBy: {
      type: ObjectId,
      required: true
   }
})

const Group = mongoose.model('groups', schema)

module.exports = Group