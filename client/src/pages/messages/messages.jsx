import React, { useState, useEffect } from 'react';
import { Route } from "react-router-dom"
import { User } from "../../axios/configs.axios"
import auth from "../../auth/auth"
import "./messages.scss"

// Components
import MessagesList from "../../components/messages-list/messages-list"
import Conversation from "../../components/group-conversation/group-conversation"

const me = "5e4302270006fe08d471c94b"

const Messages = ({ history }) => {

   const [groups, setGroups] = useState([])
   const [isAuth] = useState(auth.isAuth)

   const fetchGroups = () => {
      console.log("fetchGroups");
      User.get(`/${me}/groups?select=name,thumbnail,members`)
         .then(({ data }) => {
            setGroups(data)
         })
         .catch(err => {
            let { status, statusText } = err.response
            console.log(status, statusText);
         })
   }

   useEffect(() => {
      isAuth ? fetchGroups() : history.replace("/auth.login")
   }, [isAuth, history])

   return <>{isAuth &&
      <div className="messages d-flex">
         <MessagesList items={groups} />
         <Route path="/messages/g/:_id" component={Conversation} />
      </div>
   }</>
}

export default Messages;