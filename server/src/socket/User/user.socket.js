'use strict'
const { verifyToken } = require("../../auth/auth.verifyToken")
const { getConversations } = require("../../controllers/user.controller")


module.exports = socket => {

   socket.on('getConversations', async (token, done) => {
      try {
         let { _id } = await verifyToken(token)
         let conversations = await getConversations(_id)
         done(conversations)
      }
      catch (error) { done(error) }
   })
}