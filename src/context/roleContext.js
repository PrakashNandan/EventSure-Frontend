// src/context/roleContext.js
import React, { createContext,useContext, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import PropTypes from "prop-types";

const RoleContext = createContext(null);

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true); 
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
      } catch (error) {
        console.error("Token decode error:", error);
      }
    }
    setLoading(false); 
  }, []);

  return (
    <RoleContext.Provider value={{ role, setRole, loading }}>
      {children}
    </RoleContext.Provider>
  );
};

export function useRole() {
 const context = useContext(RoleContext);
  if (!context) throw new Error("useRole must be used within RoleProvider");
  return context;
}


RoleProvider.propTypes = {
  children: PropTypes.node.isRequired,
};