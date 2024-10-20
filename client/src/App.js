import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import PollCreation from "./components/PollCreation";
import PollDetails from "./components/PollDetails";
import UserProfile from "./components/UserProfile";
import ErrorBoundary from "./components/ErrorBoundary";
import AllPolls from "./components/AllPolls";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the token exists in localStorage
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Set isLoggedIn to true if token exists
  }, []);

  const handleLogin = () => {
    const token = localStorage.getItem("token"); // Simulate a login action
    setIsLoggedIn(!!token); // Update the state after login
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <Router>
          {/* Navbar will now handle the logout redirection inside its component */}
          <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          <Routes>
            {/* Dictionary-style routes */}
            <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create-poll" element={<PollCreation />} />
            <Route path="/poll/:id" element={<PollDetails />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/polls" element={<AllPolls />} />
          </Routes>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
