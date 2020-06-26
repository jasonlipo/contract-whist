import React from "react";
import { Redirect } from 'react-router-dom'

export const ProtectedRoute = props => {
  const isAuthenticated = localStorage.getItem('admin_token')

  return isAuthenticated ? (
    props.children
  ) : (
    <Redirect to={{ pathname: '/admin/login' }} />
  );
}