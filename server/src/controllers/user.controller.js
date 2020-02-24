
// Models
const Groups = require("../models/groups.model")
const Users = require("../models/users.model")
// Schema
const ObjectId = require("mongoose").Types.ObjectId
const { ErrorHandler } = require("../helpers/error")
// Status codes
const { NOT_FOUND, CONFLICT, BAD_REQUEST, INTERNAL_SERVER_ERROR }
   = require("../helpers/http.status")

// Handler
const { REQUEST_HANDLER } = require("./request.handler")


// exports.getUser = async (req, res) => {
//    if (!req.body._id) return req.status(400).json({ error: true, message: "There is no object id in body" })
//    let user = await Users.findById(req.body._id).select("name userName email thumbnail")
//    if (user) return res.status(200).json(user)
//    res.status(404).json({ error: true, message: "There is no user with this id" })
// }

exports.getGroups = async (req, res) => {
   let projection = {}
   req.query.select && req.query.select.split(',').forEach(s => { projection[s] = 1 })
   try {
      let groups = await Groups.find(
         { 'members._id': req.params._id },
         { ...projection, messages: { $slice: -1 } }
      )
      res.json(groups)
   } catch (error) { res.status(500).json({ error: true, message: "Error fetching groups" }) }
}

const getUser = userId => {
   return { data: { userId, msg: "I am here" } }
}

// GET REQUESTS
exports.GET_USER = ({ params: { userId } }, res, nxt) => {
   REQUEST_HANDLER(res, nxt, getUser, [userId])
}