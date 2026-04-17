import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Index from "../../src/pages/Index";

function AuthLayout({ children, authentication }) {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.user.status);

  useEffect(() => {
    if (!authentication && authStatus !== authentication) {
      return;
    }
  }, [authStatus, authentication, navigate]);

  if (authentication && authStatus !== authentication) {
    return <Index />;
  }

  return children;
}

export default AuthLayout;
