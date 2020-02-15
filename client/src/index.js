import React from 'react';
import ReactDOM from 'react-dom';
import Router from "./router/router"

import { Provider } from 'react-redux'
import store from "./store/index.store"

import "./assets/scss/index.scss"

ReactDOM.render(
   <Provider store={store}>
      <Router />
   </Provider>,
   document.getElementById('root')
);

