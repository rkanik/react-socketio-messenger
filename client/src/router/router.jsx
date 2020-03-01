import React from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom"

// Pages
import Home from "../pages/Home"
import Messages from "../pages/Messages"
import Authentication from "../pages/Authentication"
import { Builder } from "../pages/Builder"

const Router = () => (
   <BrowserRouter>
      <Switch>
         <Route path='/messages' exact component={Messages} />
         <Route path='/authenticate' exact component={Authentication} />
         <Route path='/builder' exact component={Builder} />
         <Route path='*' component={Home} />
      </Switch>
   </BrowserRouter >
)

export default Router;
