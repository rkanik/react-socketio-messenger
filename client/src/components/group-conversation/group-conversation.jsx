import React, { useState, useEffect } from "react"
import socketio from "socket.io-client"

import "./group-conversation.scss"

const me = "5e4302270006fe08d471c94b"

const Conversation = ({ match: { params } }) => {

   const client = socketio("http://localhost:3875/")
   const [group, setGroup] = useState({})

   const [message, setMessage] = useState("")
   const handleChange = e => setMessage(e.target.value)

   const [messages, setMessages] = useState([])

   useEffect(() => {
      client.emit("join", { _id: params._id }, (err, res) => {
         if (!err) setGroup(res)
      })
      return () => {
         client.disconnect()
         client.off()
      }
   }, [params._id, client])

   const handleKeyPress = e => {
      if (e.key === "Enter") {
         let data = {
            _id: params._id,
            message: message,
            sendBy: me,
            sendAt: Date.now()
         }
         client.emit("message", data, (err, res) => {
            console.log(err, res);
         })

         message.trim() !== "" && setMessages([...messages, { text: message, by: "me" }])
         setMessage('')
      }
   }


   return (
      <div className='w-100 pos-rel'>
         <div className='toolbar px-10 py-5 elevation-1'>
            <h2 className='font-normal'>{group.name}</h2>
         </div>
         <div className='conv-container d-flex pa-5'>
            <div className='w-100 mr-5 pos-rel'>
               <div className='conversation'>
                  <div className="conv-child pt-5 pb-5">
                     {messages.map(({ text, by }, i) => {
                        return (
                           <div className='chat w-100'>
                              <p className={by === 'me' ? 'float-right bg-blue px-4 py-2 text-white' : null} key={i}>{text}</p>
                           </div>
                        )
                     })}
                  </div>
               </div>
               <div className='write-message'>
                  <input
                     onChange={handleChange}
                     onKeyPress={handleKeyPress}
                     value={message}
                     className="w-100 px-6 py-3"
                     type="text"
                     placeholder="Write your message"
                  />
               </div>
            </div>
            <div className='members-list pa-5 ma-5'>
               {group.members && group.members.map(member => (
                  <div className='item d-flex mb-3' key={member._id}>
                     <div className='char-thumb pos-rel'>
                        <p className='pos-abs to-center'>{member.name.charAt(0).toUpperCase()}</p>
                     </div>
                     <p className="ml-3">{member.name}</p>
                  </div>
               ))}
            </div>
         </div>
      </div>
   )
}

export default Conversation