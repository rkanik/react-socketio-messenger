const mongoose = require('mongoose')
const { ObjectId } = mongoose.SchemaTypes
const GroupMember = new mongoose.Schema({
   _id: {
      type: ObjectId,
      required: true
   },
   role: {
      type: String,
      default: "Member"
   }
})
exports.Schema = GroupMember
exports.Model = mongoose.model("group-member", GroupMember)