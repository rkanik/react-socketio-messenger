const router = require('express').Router()
const jwt = require("jsonwebtoken")

router.use("/auth", require("./auth/auth.router"))
router.use("/chat", require("./chat/chat.router"))
router.use("/users", require("./user/user.router"))

router.get("/", (req, res) => {
   req.user
      ? res.json(req.user)
      : res.json({ message: "Please login first!" })
})

router.get("/token/:token/valid", (req, res) => {
   let token = req.params.token || null
   if (!token) { return res.send(false) }
   jwt.verify(token, process.env.JWT_SECRET,
      (err, decoded) => {
         if (err) res.send(false)
         else res.send(true)
      }
   )
})

module.exports = router