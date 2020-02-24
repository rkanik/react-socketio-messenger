const router = require('express').Router()
const jwt = require("jsonwebtoken")
const { ErrorHandler } = require("../helpers/error")

// router.use("/auth", require("./auth.router"))
// router.use("/chat", require("./chat.router"))

// routers
const { userRouter, usersRouter } = require("./user.router")
const { groupRouter, groupsRouter } = require("./group.router")

// User routers
router.use("/api/users", usersRouter)
router.use("/api/user", userRouter)

// Group routers
router.use("/api/:userId/groups", groupsRouter)
router.use("/api/:userId/group", groupRouter)

router.get("/", (req, res) => {
   req.user
      ? res.json(req.user)
      : res.json({ message: "Please login first!" })
})

router.get("/token/:token/valid", (req, res) => {
   let token = req.params.token || null
   if (!token) { return res.send(false) }
   jwt.verify(token, process.env.JWT_SECRET,
      err => {
         if (err) res.send(false)
         else res.send(true)
      }
   )
})

router.get('/error', (req, res) => {
   throw new ErrorHandler(500, 'Internal server error');
})

module.exports = router

/**
 * [GET][POST][DEL][PATCH] -> /api/user/:userId
 *
 * [GET]                   -> /api/user/:userId/groups
 * [GET]                   -> /api/user/:userId/groupsList
 * [GET]                   -> /api/user/:userId/:groupId
 *
 * [GET][POST]             -> /api/user/:userId/:groupId/messages
 * [PATCH][DEL]            -> /api/user/:userId/:groupId/message/:messageId
 *
 * [GET][POST]             -> /api/user/:userId/:groupId/members
 * [DEL]                   -> /api/user/:userId/:groupId/member/:memberId
 *
 * [GET]                   -> /api/user/:userId/chats
 * [GET]                   -> /api/user/:userId/chatsList
 * [GET][POST]             -> /api/user/:userId/:friendId/chat
 * [DEL][PATCH]            -> /api/user/:userId/:friendId/chat/:messageId
 *
 */