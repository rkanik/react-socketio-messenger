
const { Group } = require("../../models")
const { User } = require("../../models")

exports.getUser = async (req, res) => {

   if (!req.body._id) return req.status(400).json({ error: true, message: "There is no object id in body" })

   let user = await User.findById(req.body._id).select("name userName email thumbnail")

   if (user) return res.status(200).json(user)

   res.status(404).json({ error: true, message: "There is no user with this id" })
}

exports.getGroups = (req, res) => {

   let projection = req.query.select
      ? req.query.select.replace(/,/g, " ")
      : ""
   Group.find({ 'members._id': req.params._id }, projection, (err, docs) => {
      if (err) res.send(err)
      else res.json(docs)
   })
}
