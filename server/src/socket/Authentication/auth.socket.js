'use strict'
const Users = require("../../models/users.model")
const { loginUser, registerUser } = require("../../controllers/auth.controller")
const { verifyToken } = require("../../auth/auth.verifyToken")

module.exports = socket => {
   socket.on('login', async ({ email, password }, done) => {
      let { error, user, token, message } = await loginUser(email, password)
      if (error) return done({ error, message })
      done({ user, token })
   })

   socket.on('register', async (doc, done) => {
      let user = await registerUser(doc)
      console.log(user)
      done(user)
   })

   socket.on('loginWithToken', async (token, done) => {
      try {
         let verified = await verifyToken(token)
         let projection = "name email thumbnail status"
         let user = await Users.findById(verified._id).select(projection)
         if (user) return done(user)
         done({ error: true, message: "User not found" })
      }
      catch (error) { done({ error: true, message: error.message }) }
   })
}