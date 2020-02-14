import axios from "axios"

const DEV_ROOT = "http://localhost:3875"


export const Api = axios.create({
   baseURL: `${DEV_ROOT}`
})

export const User = axios.create({
   baseURL: `${DEV_ROOT}/users`
})

export default { User, Api }