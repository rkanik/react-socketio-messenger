const mongoose = require('mongoose')

// Schema
const ObjectId = mongoose.SchemaTypes.ObjectId

const User = new mongoose.Schema({
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
   status: {
      clientId: String,
      active: {
         type: Boolean,
         default: false
      },
      lastActive: {
         type: Date,
         default: Date.now
      }
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
      default: Date.now(),
      select: false
   },
   updatedAt: {
      type: Date,
      default: Date.now()
   },
})

module.exports = User