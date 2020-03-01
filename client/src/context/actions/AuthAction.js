import { SET_STATE, SET_TOKEN, RESET_STATE } from "../types/index"

const actionsCreator = (dispatch) => {
   const setState = payload => {
      dispatch({ type: SET_STATE, payload })
   }
   const setToken = token => {
      dispatch({ type: SET_TOKEN, payload:token })
   }
   const resetState = initialState => {
      dispatch({ type: RESET_STATE, payload: initialState })
   }
   return { setState, setToken, resetState }
}

export default actionsCreator