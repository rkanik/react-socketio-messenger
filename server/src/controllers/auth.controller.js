const Users = require("../models/users.model")
const bCript = require('bcryptjs')

const { BAD_REQUEST } = require("../helpers/http.status")

exports.createUser = async (req, res) => {
   await Users.init()
   let user = new Users({
      ...req.body,
      email: req.body.email.toLowerCase()
   })
   let validationError = user.validateSync()
   if (validationError) {
      res.status(BAD_REQUEST).json({
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

exports.loginUser = async (email, password, done) => {
   try {
      let projection = "-__v -createdAt -updatedAt -lastVisited"
      let user = await Users.findOne({ email }).select(projection)
      if (user === null)
         return done({ error: true, message: "Invalid email address" }, null)
      else if (user && !user.password)
         return done({ error: true, message: "No password" }, null)
      else {
         let valid = bCript.compareSync(password, user.password)
         if (!valid) return done({ error: true, message: "Invalid password" }, null)
         else return done(null, user)
      }
   }
   catch (error) { return done(error, null) }
}

exports.onGoogleSignin = async (_, __, profile, done) => {

   let existUser = await Users.findOne({ email: profile._json.email }).select("-__v")

   if (existUser) {
      //let token = jwt.sign({ _id: existUser._id }, process.env.JWT_SECRET)
      //console.log(token)
      Users.updateOne({ _id: existUser._id }, { lastVisited: Date.now() })
      return done(null, existUser._doc, "User already exist!")
   }

   let user = new User({
      name: profile.displayName,
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