
import React from 'react';
import { Navigate } from 'react-router-dom';

import PropTypes from "prop-types";
import { getUserRole } from 'getUserRole';


const ProtectedRoute = ({ allowedRoles, children }) => {
 
    const role = getUserRole();

  if (!role) return <Navigate to="/" />;
  return allowedRoles.includes(role) ? children : <Navigate to="/unauthorized" />;
};


ProtectedRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
