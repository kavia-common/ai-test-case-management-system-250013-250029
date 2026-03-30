import React from "react";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import AppRouter from "./routes/AppRouter";

// PUBLIC_INTERFACE
function App() {
  /** App entry: wraps router with providers. */
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
