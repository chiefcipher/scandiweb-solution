import React from 'react';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {createRoot} from 'react-dom/client'



  
import { BrowserRouter as Router  } from 'react-router-dom';
import {applyMiddleware, createStore }  from 'redux'
import { Provider } from 'react-redux';
import thunk from 'redux-thunk' ; 
import {reducer } from './store/reducer'

import App from './container/App/App';

const store = createStore(reducer ,applyMiddleware(thunk))

const container = document.getElementById('root') ; 
const root = createRoot(container)

const WebApp = 
  <React.StrictMode>
    <Provider store={store}>
    <Router>
      <App/>
    </Router>
    </Provider>
  </React.StrictMode>

root.render(WebApp)
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
