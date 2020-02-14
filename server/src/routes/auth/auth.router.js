const router = require('express').Router()
const passport = require('passport')
const { auth } = require('../../controllers')

router.get("/", (req, res) => {
   req.user ? res.render("pages/auth", { user: req.user }) : res.redirect("/")
})

router.get("/login", (req, res) => {
   res.status(200).json({ from: "/login" })
})

// Login
router.post('/login', (req, res, next) => {
   req.body.username = JSON.stringify({
      $or: [{ userName: req.body.username },
      { email: req.body.username }]
   })
   passport.authenticate('local')(req, res, next);
});

router.post("/register", auth.createUser)

router.get(`/google`, passport.authenticate('google'))
router.get(`/google/callback`, passport.authenticate('google', { successRedirect: "/auth" }))

module.exports = router