
import { Api } from "../axios/configs.axios"

export const ensureLogin = async () => {
   try {

      // Api.get("/auth/google").then(res => {
      //    console.log(res)
      // })

      let user = (await Api.get()).data
      console.log(user)
   } catch (error) {
      console.log(error.response)
   }
}

export default {
   isAuth: false
}