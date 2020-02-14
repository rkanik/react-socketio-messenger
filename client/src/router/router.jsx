import React from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom"

// Pages
import Auth from "../pages/auth"
import Messages from "../pages/messages/messages"
import Login from "../pages/auth/login"
import Register from "../pages/auth/register"
import ResetPassword from "../pages/auth/resetPassword"

const Router = () => (
   < BrowserRouter >
      <Switch>
         <Route path='/messages' component={Messages} />
         <Route path='/auth/login' exact component={Login} />
         <Route path='/auth/register' exact component={Register} />
         <Route path='/auth/reset-password' exact component={ResetPassword} />
         <Route path='*' component={Auth} />
      </Switch>
   </BrowserRouter >
)

export default Router;
