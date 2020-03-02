import React, { useContext, useEffect } from 'react';
import { AuthContext, initState } from "../context/AuthContext"
import { MessageContext } from "../context/MessageContext"

// Components
import Sidebar from "../components/layouts/Sidebar"

const Messages = ({ history }) => {

   const { socket, currentUser, isAuth, setState, accessToken, resetState } = useContext(AuthContext)
   const { setMessageState } = useContext(MessageContext)

   // Verifing Access Token
   useEffect(() => {
      if (socket && accessToken) {
         socket.emit("verifyToken", accessToken, ({ error }) => {
            if (error) {
               resetState(initState)
               return history.replace("/authenticate")
            }
            setState({ isAuth: true })
         })
      }
   }, [accessToken, socket, setState, resetState, history])

   // Is auth then getting informations
   useEffect(() => {
      if (isAuth && accessToken && socket) {
         let select = ['name', 'email', 'thumbnail']
         socket.emit("getUserFromToken", { token: accessToken, select }, ({ error, user }) => {
            !error && setState({ currentUser: user })
         })

         socket.emit("getConversations", accessToken, ({ error, conversations }) => {
            if (!error) {
               setMessageState({ conversations })
            }
         })
      }
   }, [isAuth, accessToken, socket, setState, setMessageState])

   return (
      <div className="messages d-flex">
         <Sidebar user={currentUser} />
      </div>
   )
}

export default Messages