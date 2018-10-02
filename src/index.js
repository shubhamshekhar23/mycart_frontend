import React, {Component} from 'react';
import {css} from 'glamor';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Switch, Redirect, Link
} from 'react-router-dom';
import './index.css';
import {App, Login, Signup} from './component';
import axios from 'axios';

axios.defaults.headers.common['authorization'] = JSON.parse(localStorage.getItem('token'));
axios.defaults.baseURL = "http://localhost:4000/mycart/api";
  

ReactDOM.render((
    <Router>
        <Switch>
            <Route exact path="/" name="Login Page" component={Login} />
            <Route exact path="/signup" name="Signup Page" component={Signup} />
            <Route path="/home" name="Home" component={App} />
        </Switch>
    </Router>
), document.getElementById('root'));
