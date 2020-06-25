import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import ContractWhist from './ContractWhist';
import { AdminList } from './AdminList';
import { AdminGame } from './AdminGame';

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/admin/:id">
        <AdminGame />
      </Route>
      <Route path="/admin">
        <AdminList />
      </Route>
      <Route path="*">
        <ContractWhist join_game={location.pathname.replace(/\//g, '').toUpperCase()} />
      </Route>
    </Switch>
  </BrowserRouter>
, document.getElementById('root'));