'use strict'
const { verifyToken } = require("../../auth/auth.verifyToken")
const { getUser, getConversations } = require("../../controllers/user.controller")

module.exports = socket => {

   socket.on('getUserFromToken', async ({ token, select }, done) => {
      try {
         let { _id } = await verifyToken(token)
         let { error, data, message } = await getUser(_id, select)
         if (error) return done({ error, message })
         return done({ error, user: data })
      }
      catch (e) { done({ error: true, message: e.message }) }
   })

   socket.on('getUser', async ({ token, userId, select }, done) => {
      try {
         await verifyToken(token)
         let { error, data, message } = await getUser(userId, select)
         if (error) return done({ error, message })
         return done({ error, user: data })
      }
      catch (e) { done({ error: true, message: e.message }) }
   })

   socket.on('getConversations', async (token, done) => {
      try {
         let { _id } = await verifyToken(token)
         let { error, data, message } = await getConversations(_id)
         if (error) return done({ error, message })
         return done({ error, conversations: data })
      }
      catch (e) { done({ error: true, message: e.message }) }
   })

}