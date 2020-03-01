
const mutations = {
   SET_TOKEN: (state, token) => {
      localStorage.getItem('accessToken', token)
      state.accessToken = token
      return state
   },
   SET_STATE: (state, payload) => {
      console.log("SET_STATE", payload)
      Object.keys(payload).forEach(k => state[k] = payload[k])
      return state
   },
   RESET_STATE: (state, initialState) => {
      state = { ...initialState }
      return state
   }
}
export const AuthReducer = (state, action) => {
   if (action && state) {
      let { type, payload } = action
      let mutation = mutations[type]
      let newState = mutation ? mutation(state, payload) : state
      return { ...state, ...newState }
   }
}