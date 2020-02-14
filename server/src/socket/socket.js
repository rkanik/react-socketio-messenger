const socketio = require("socket.io")
const { getGroup } = require("../controllers/socket/group/group.socket.cont")

module.exports = server => {

   const io = socketio(server)
   io.on('connection', client => {
      console.log("Client connected...")

      client.on('disconnect', () => {
         console.log("Client disconnected")
      })

      client.on("join", async ({ _id }, callback) => {
         let { error, data } = await getGroup(_id)
         callback(error, data)
      })

      client.on("message", ({ _id, message, sendBy, sendAt }, callback) => {
         console.log(_id, message, sendBy, sendAt)

         client.join(_id, err => {
            console.log(err)
            callback(err, { msg: "Joined" })
         })

      })

   })
}