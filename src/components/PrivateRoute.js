import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Component, ...rest }) => {
  const isAuthenticated = true; // Replace with actual authentication check

  return (
    <Route
      {...rest}
      element={isAuthenticated ? Component : <Navigate to="/" />}
    />
  );
};

export default PrivateRoute;
