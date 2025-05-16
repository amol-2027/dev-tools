
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

// This page is no longer used as we're rendering everything in App.tsx directly
const Index = () => {
  useEffect(() => {
    console.log("Index page loaded, redirecting to app root");
  }, []);

  return <Navigate to="/" replace />;
};

export default Index;
