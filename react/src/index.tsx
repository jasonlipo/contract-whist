import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import ContractWhist from './ContractWhist';
import { AdminList } from './admin/AdminList';
import { AdminLogin } from './admin/AdminLogin';
import { AdminGame } from './admin/AdminGame';
import { ProtectedRoute } from './admin/ProtectedRoute';

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/admin/login">
        <AdminLogin />
      </Route>
      <Route path="/admin/:id">
        <ProtectedRoute>
          <AdminGame />
        </ProtectedRoute>
      </Route>
      <Route path="/admin">
        <ProtectedRoute>
          <AdminList />
        </ProtectedRoute>
      </Route>
      <Route path="*">
        <ContractWhist join_game={location.pathname.replace(/\//g, '').toUpperCase()} />
      </Route>
    </Switch>
  </BrowserRouter>
, document.getElementById('root'));