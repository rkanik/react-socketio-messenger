const router = require('express').Router()

router.use("/auth", require("./auth/auth.router"))
router.use("/chat", require("./chat/chat.router"))
router.use("/users", require("./user/user.router"))

router.get("/", (req, res) => {
   req.user
      ? res.json(req.user)
      : res.json({ message: "Please login first!" })
})

module.exports = router