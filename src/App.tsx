import React, {useEffect, useState} from 'react';
import './App.css';
import Main from "./components/Main";
import {Layout, Menu} from "antd";
import {Typography} from "antd";

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Header from "./components/layouts/header";
import Home from "./components/home";
import Footer from "./components/layouts/footer";
import Collection from "./components/collection";
import Create from "./components/create";
import Explore from "./components/explore";
import ItemDetails from "./components/item_detail";
import Profile from "./components/profile";
import Upload from "./components/upload";
import Wallet from './components/wallet';

function App() {
  return (
    // <Main />
    <div className="App">
      <Router>
        <Header />
        <Switch>
          <Route path="/explore">
            <Explore />
          </Route>
          <Route path="/collection/:id">
            <Collection />
          </Route>
          <Route path="/item-details/:id">
            <ItemDetails />
          </Route>
          <Route path="/profile/:id">
            <Profile />
          </Route>
          <Route path="/wallet">
            <Wallet />
          </Route>
          <Route path="/create">
            <Create />
          </Route>
          <Route path="/upload/:id">
            <Upload />
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
        </Switch>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
