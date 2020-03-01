import React, { useContext, useEffect } from 'react';
import { AuthContext } from "../context/AuthContext"

// Components
//import Sidebar from "../components/layouts/Sidebar"

const Messages = props => {
   
   const { socket, currentUser, isAuth } = useContext(AuthContext)
   console.log(currentUser, isAuth);

   // Effexcts
   useEffect(() => {
      (isAuth && currentUser) && getConversations(currentUser.token)
   }, [isAuth, currentUser])

   // Methods
   const getConversations = token => {
      console.log("getConversations", token);
      socket.emit('getConversations', token, res => {
         console.log(res);
      })
   }

   return (
      <div className="messages d-flex">
         {/* <Sidebar user={currentUser} /> */}
      </div>
   )
}

export default Messages