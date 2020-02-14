const mongoose = require('mongoose')
const { ObjectId } = mongoose.SchemaTypes

const schema = new mongoose.Schema({
   name: {
      type: String,
      required: true
   },
   userName: {
      type: String,
      required: true
   },
   email: {
      type: String,
      required: true,
      match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
   },
   emailVerified: {
      type: Boolean,
      default: false
   },
   password: String,
   thumbnail: String,
   externalId: String,
   provider: String,
   friends: [ObjectId],
   groups: [ObjectId],
   createdAt: {
      type: Date,
      default: Date.now()
   },
   updatedAt: {
      type: Date,
      default: Date.now()
   },
   lastVisited: {
      type: Date,
      default: Date.now()
   }
})

const user = mongoose.model('users', schema)

module.exports = user