const router = require('express').Router()
const jwt = require("jsonwebtoken")
const { ErrorHandler } = require("../helpers/error")

// routers
const { userRouter, usersRouter } = require("./user.router")
const { groupRouter, groupsRouter } = require("./group.router")

// User routers
router.use("/api/users", usersRouter)
router.use("/api/user", userRouter)

// Group routers
router.use("/api/user/:userId/groups", groupsRouter)
router.use("/api/user/:userId/group", groupRouter)


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

module.exports = router