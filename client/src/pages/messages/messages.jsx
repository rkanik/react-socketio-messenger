import React, { useState, useEffect } from 'react';
import { Route } from "react-router-dom"
import { connect } from "react-redux"
import "./messages.scss"

// Components
import Sidebar from "../../layouts/sidebar/sidebar"
import Conversation from "../../components/group-conversation/group-conversation"
import CreateGroup from "../../components/modals/createGroup/createGroup"

// Store
import { fetchUser, setState } from "../../store/auth.store/auth.store"
import { fetchGroups } from "../../store/group.store/group.store"

const mapActions = dispatch => ({
   setState: () => dispatch(setState()),
   fetchUser: () => dispatch(fetchUser()),
   fetchGroups: me => dispatch(fetchGroups(me))
})

const mapStates = state => state
const Messages = ({ auth, group, history, ...props }) => {

   const [state, setState] = useState({
      createGroup: false
   })

   const _setState = payload => setState({ ...state, ...payload })

   useEffect(() => {
      console.log(auth.initializing, auth.isAuth);
      if (!auth.initializing && !auth.isAuth) {
         history.replace("/auth/login")
      } else if (!auth.initializing && auth.isAuth) {
         props.fetchGroups(auth.currentUser._id)
      }
   }, [auth.isAuth, auth.initializing])

   useEffect(() => { props.fetchUser() }, [])

   return (
      <div className="messages d-flex">
         {!auth.initializing &&
            <>
               <Sidebar items={group.groups} user={auth.currentUser} setState={_setState} />
               <div className='pa-5'>
                  <h1>{auth.initializing && "Initializing..."}</h1>
               </div>
               <Route path="/messages/g/:_id" component={Conversation} />
            </>
         }
         {/* Models */}
         {state.createGroup && <CreateGroup setState={_setState} />}
      </div>
   )
}

export default connect(mapStates, mapActions)(Messages);