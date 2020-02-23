import React, { useState, useEffect } from 'react';
import { Route } from "react-router-dom"
import { connect } from "react-redux"
import io from "socket.io-client"
import "./messages.scss"

// Components
import Sidebar from "../../layouts/sidebar/sidebar"
import Conversation from "../../components/group-conversation/conversation.g"
import CreateGroup from "../../components/modals/createGroup/createGroup"

// Store
import { fetchUser, setState } from "../../store/auth.store/auth.store"
import { fetchGroupsList } from "../../store/group.store/group.store"

// Api
import { Api } from "../../axios/configs.axios"

// Socket
var client

const mapActions = dispatch => ({
   setState: () => dispatch(setState()),
   fetchUser: () => dispatch(fetchUser()),
   fetchGroupsList: me => dispatch(fetchGroupsList(me))
})

const mapStates = state => state
const Messages = ({ auth, group, history, ...props }) => {

   const [state, setState] = useState({
      createGroup: false,
      activeConversation: null
   })

   const _setState = payload => setState({ ...state, ...payload })

   // Effects

   useEffect(() => {
      console.log("M - A");
      client = io.connect("http://localhost:3875/")
      client.on('connected', res => {
         console.log("CONNECTED", res);
      })
   }, [])

   useEffect(() => { props.fetchUser(); console.log("M - B"); }, [])
   useEffect(() => { initialize(); console.log("M - C"); }, [auth.isAuth, auth.initializing])

   // Methods
   const initialize = () => {
      if (!auth.initializing && !auth.isAuth) {
         history.replace("/auth/login")
      } else if (!auth.initializing && auth.isAuth) {
         props.fetchGroupsList(auth.currentUser._id)
      }
   }
   const createGroup = async payload => {
      let group = {
         ...payload,
         members: [{ _id: auth.currentUser._id, type: "Admin" }],
         messages: [{
            message: `${auth.currentUser.name} has created the group`,
            sendBy: auth.currentUser._id,
            sentAt: Date.now()
         }],
         seenBy: [auth.currentUser._id],
         createdAt: Date.now(),
         createdBy: auth.currentUser._id
      }
      try {
         let res = await Api.post("/chat/group", group)
         setState({ ...state, createGroup: false })
         props.fetchGroupsList(auth.currentUser._id)
      } catch (error) { console.log(error.response); }
   }

   return (
      <div className="messages d-flex">
         {!auth.initializing &&
            <>
               <Sidebar
                  items={group.groups}
                  user={auth.currentUser}
                  setState={_setState}
                  activeConversation={state.activeConversation}
               />
               <Route
                  path="/messages/g/:_id"
                  render={(props) =>
                     <Conversation {...props}
                        activeConversation={id => { setState({ ...state, activeConversation: id }) }}
                        user={auth.currentUser}
                     />}
               />
            </>
         }
         {/* Models */}
         {state.createGroup && <CreateGroup done={createGroup} setState={_setState} />}
      </div>
   )
}

export default connect(mapStates, mapActions)(Messages);