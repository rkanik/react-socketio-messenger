import React, { useState, useEffect } from 'react';
import io from "socket.io-client"

let server

function App() {

   const [name, setName] = useState("")
   const [room, setRoom] = useState("")

   useEffect(() => {
      //const data = queryString.parse()

      server = io("http://localhost:3875/")

      console.log(server);


   })

   const handleInput = ({ target }) => {
      if (target.name === 'name') setName(target.value)
      else if (target.name === 'room') setRoom(target.value)
   }

   const joinChatGroup = () => {
      console.log('join clicked');
   }

   return (
      <div style={{ padding: "2rem" }}>
         <div>{name} {room}</div>
         <input
            type="text"
            name="name"
            placeholder="Enter your name"
            onChange={handleInput}
         />
         <input
            type="text"
            name="room"
            placeholder="Enter room name"
            onChange={handleInput}
         />
         <button name="join" onClick={joinChatGroup}>JOIN</button>
      </div>
   );
}

export default App;
