
import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from "redux-thunk"
import { authReducer } from "./auth.store/auth.store"
import { groupReducer } from "./group.store/group.store"

const store = createStore(
   combineReducers({
      auth: authReducer,
      group: groupReducer
   }),
   applyMiddleware(thunk)
)

export default store