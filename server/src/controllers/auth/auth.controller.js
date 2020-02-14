const { User } = require("../../models")
const bCript = require('bcryptjs')


exports.createUser = async (req, res) => {
   await User.init()
   let user = new User({
      ...req.body,
      userName: req.body.userName.toLowerCase(),
      email: req.body.email.toLowerCase()
   })
   let validationError = user.validateSync()
   if (validationError !== undefined) {
      res.status(500).json({
         error: true,
         message: validationError.message,
         errors: [...Object.keys(validationError.errors).map(key => (validationError.errors[key].message))],
      })
   } else {
      /** Hashing password */
      let salt = bCript.genSaltSync(10)
      user.password = bCript.hashSync(user.password, salt)
      user.save().then(doc => {
         res.status(201).json({
            error: false,
            message: "User created successfully!",
            data: doc._doc
         })
      }).catch(err => {
         res.status(500).json({
            error: true,
            errorCode: err.code,
            message: err.errmsg
         })
      })
   }
}

exports.loginUser = async (condition, password, done) => {
   let user = await User.findOne(JSON.parse(condition)).select("-__v")
   if (user) {
      done(null, user)
   } else {
      done(true, null, "User not found!")
   }
}

exports.onGoogleSignin = async (_, __, profile, done) => {

   let existUser = await User.findOne({ email: profile._json.email }).select("-__v")

   if (existUser) {
      //let token = jwt.sign({ _id: existUser._id }, process.env.JWT_SECRET)
      //console.log(token)
      User.updateOne({ _id: existUser._id }, { lastVisited: Date.now() })
      return done(null, existUser._doc, "User already exist!")
   }

   let user = new User({
      name: profile.displayName,
      userName: profile._json.email.split("@")[0].replace(/\./g, ""),
      email: profile._json.email,
      emailVerified: profile._json.email_verified,
      externalId: profile.id,
      provider: profile.provider,
      thumbnail: profile._json.picture
   })

   let isError = user.validateSync()
   if (isError !== undefined) { return done(true, null, "User validation error!") }

   await User.init()

   user.save()
      .then(newUser => {
         console.log("User created successfully!")
         //let token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET)
         //console.log(token)
         done(null, newUser, "User created successfully!")
      })
      .catch(err => {
         console.log(err.message)
         done(true, null, err.message)
      })
}