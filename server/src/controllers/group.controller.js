// Models
const Groups = require("../models/groups.model")
const Users = require("../models/users.model")
// Schema
const ObjectId = require("mongoose").Types.ObjectId
const GroupMember = require("../models/joi/member.joi")
const { ErrorHandler } = require("../helpers/error")
// Status codes
const { OK, NOT_FOUND, CONFLICT, BAD_REQUEST, INTERNAL_SERVER_ERROR } = require("../helpers/http.status")


const getGroupsList = async userId => {
   try {
      let groups = await Groups.find({ "members.userId": userId })
      return { data: groups }
   }
   catch (error) {
      return {
         error: true,
         errorCode: INTERNAL_SERVER_ERROR,
         message: error.message
      }
   }
}
const getGroup = async groupId => {
   if (!ObjectId.isValid(groupId)) return {
      error: true,
      errorCode: BAD_REQUEST,
      message: `GroupId ${groupId} is not a valid objectId`
   }
   try {
      let group = await Groups.findById(groupId)
      if (!group) return {
         error: true,
         errorCode: NOT_FOUND,
         message: `Group not found with the Id ${groupId}`
      }
      return { data: group }
   }
   catch (error) {
      return {
         error: true,
         errorCode: INTERNAL_SERVER_ERROR,
         message: error.message
      }
   }
}
const getGroupMembers = async (groupId, query) => {
   if (!ObjectId.isValid(groupId)) return {
      error: true,
      errorCode: BAD_REQUEST,
      message: `GroupId ${groupId} is not a valid objectId`
   }
   try {
      let group = await Groups.findById(groupId).select('members')
      if (!group) return {
         error: true,
         errorCode: NOT_FOUND,
         message: `Group not found with the Id ${groupId}`
      }
      let _group = group._doc
      if (query.name || query.thumbnail) {
         _group.members = await Promise.all(_group.members.map(async mem => {
            let _mem = mem._doc
            let user = await Users.findById(_mem.userId).select("name thumbnail")
            return {
               ..._mem, name: query.name ? user.name : undefined,
               thumbnail: query.thumbnail ? user.thumbnail : undefined
            }
         }))
      }
      return { data: _group.members }
   }
   catch (error) {
      return {
         error: true,
         errorCode: INTERNAL_SERVER_ERROR,
         message: error.message
      }
   }
}

const createGroup = async payload => {
   try {
      let group = new Groups(payload)
      let validationError = group.validateSync()
      if (validationError) return {
         error: true,
         errorCode: BAD_REQUEST,
         message: validationError.message
      }
      let newGroup = await group.save()
      return { data: newGroup }
   }
   catch (error) {
      return {
         error: true,
         errorCode: INTERNAL_SERVER_ERROR,
         message: error.message
      }
   }
}

const addGroupMember = async (groupId, payload) => {
   // Checking if GroupId is valid
   if (!ObjectId.isValid(groupId)) return {
      error: true,
      errorCode: BAD_REQUEST,
      message: `GroupId ${groupId} is not a valid objectId`
   }
   try {
      // Checking if GroupMember Schema is valid
      let { error } = GroupMember.validate(payload)
      if (error) return { error: true, errorCode: BAD_REQUEST, message: error.message }
      // Is Group member already Exist
      let member = await Groups.findOne({ 'members.userId': payload.userId }).select('_id')
      if (member) return {
         error: true,
         errorCode: CONFLICT,
         message: `UserId ${payload.userId} already exist in this group`
      }
      // Adding user
      let resp = await Groups.updateOne({ _id: groupId }, { $push: { members: payload } })
      // Checking if user added
      if (resp.nModified === 0) return {
         error: true, errorCode: INTERNAL_SERVER_ERROR, message: "Error while adding member"
      }
      // User added successfully
      return { data: resp }
   }
   catch (error) {
      return {
         error: true,
         errorCode: INTERNAL_SERVER_ERROR,
         message: error.message
      }
   }
}

const updateGroup = async (groupId, payload) => {
   try {
      let resp = await Groups.updateOne({ _id: groupId }, payload)
      if (resp.nModified == 0) return {
         error: true,
         errorCode: BAD_REQUEST,
         message: "Error while updating group"
      }
      return { data: resp }
   }
   catch (error) {
      return {
         error: true,
         errorCode: INTERNAL_SERVER_ERROR,
         message: error.message
      }
   }
}

const deleteGroup = async groupId => {
   try {
      let resp = await Groups.deleteOne({ _id: groupId })
      return { data: resp }
   }
   catch (error) {
      return {
         error: true,
         errorCode: INTERNAL_SERVER_ERROR,
         message: error.message
      }
   }
}

// GET REQUESTS
exports.GET_GROUPS = async (req, res, next) => {
   try {
      let groups = await Groups.find()
      res.status(OK).json(groups)
   }
   catch (error) { next(error) }
}
exports.GET_GROUPS_LIST = async (req, res, next) => {
   try {
      let { userId } = req.params
      if (!userId) throw new ErrorHandler(BAD_REQUEST, "No UserId in request parameter")
      if (!ObjectId.isValid(userId))
         throw new ErrorHandler(BAD_REQUEST, `UserId '${userId}' is not a valid ObjectId`)
      let resp = await getGroupsList(userId)
      if (resp.error) throw new ErrorHandler(resp.errorCode, resp.message)
      res.status(OK).json(resp.data)
   }
   catch (error) { next(error) }
}
exports.GET_GROUP = async (req, res, next) => {
   try {
      let resp = await getGroup(req.params.groupId)
      if (resp.error) throw new ErrorHandler(resp.errorCode, resp.message)
      res.status(OK).json(resp.data)
   }
   catch (error) { next(error) }
}
exports.GET_GROUP_MEMBERS = async (req, res, next) => {
   try {
      let resp = await getGroupMembers(req.params.groupId, req.query)
      if (resp.error) throw new ErrorHandler(resp.errorCode, resp.message)
      res.status(OK).json(resp.data)
   }
   catch (error) { next(error) }
}

// POST REQUESTS
exports.CREATE_GROUP = async (req, res, next) => {
   try {
      let resp = await createGroup(req.body)
      if (resp.error) throw new ErrorHandler(resp.errorCode, resp.message)
      res.status(OK).json(resp.data)
   }
   catch (error) { next(error) }
}
exports.ADD_GROUP_MEMBER = async (req, res, next) => {
   try {
      let resp = await addGroupMember(req.params.groupId, req.body)
      if (resp.error) throw new ErrorHandler(resp.errorCode, resp.message)
      res.status(OK).json(resp.data)
   }
   catch (error) { next(error) }
}

// UPDATE REQUESTS
exports.UPDATE_GROUP = async (req, res, next) => {
   try {
      let resp = await updateGroup(req.params.groupId, req.body)
      if (resp.error) throw new ErrorHandler(resp.errorCode, resp.message)
      res.status(OK).json(resp.data)
   }
   catch (error) {
      next(error)
   }
}

// DELETE REQUESTS
exports.DELETE_GROUPS = async (req, res, next) => {
   try {
      let resp = await Groups.deleteMany()
      res.json(OK).json(resp)
   }
   catch (error) { next(error) }
}
exports.DELETE_GROUP = async (req, res, next) => {
   try {
      let resp = await deleteGroup(req.params.groupId)
      if (resp.error) throw new ErrorHandler(resp.errorCode, resp.message)
      res.status(OK).json(resp.data)
   }
   catch (error) { next(error) }
}