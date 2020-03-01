import React, { useReducer, createContext, useEffect } from 'react'
import createAction from "./actions/AuthAction"
import { AuthReducer } from "./reducers/AuthReducer"
import io from "socket.io-client"

const DEV_API = "http://localhost:3875"

// Initial states
const initialState = {
   accessToken: null,
   socket: null,
   currentUser: null,
   isAuth: false
}

export const initState = () => initialState

// Context
export const AuthContext = createContext(initialState)

// Provider
export const AuthProvider = ({ children }) => {

   const [state, dispatch] = useReducer(AuthReducer, initialState)


   let actions = createAction(dispatch)

   useEffect(() => {
      actions.setState({
         socket: io(DEV_API),
         accessToken: localStorage.getItem('accessToken')
      })
   }, [])

   return (
      <AuthContext.Provider value={{ ...state, ...actions }}>
         {children}
      </AuthContext.Provider>
   )
}