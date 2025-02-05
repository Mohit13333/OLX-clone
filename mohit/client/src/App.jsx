import React from "react";
import { useAuth } from "./contexts/AuthProvider";
import { Route, Routes, Navigate } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Products from "./pages/Products";
import Navbar from "./components/Navbar";
import Sell from "./pages/Sell";
import Product from "./pages/Product";
import Chat from "./pages/Chat";
import Messages from "./pages/Messages";
import Footer from "./components/Footer";

const App = () => {
  const { authToken } = useAuth();

  return (
    <div>
      <Routes>
        <Route
          path="/signup"
          element={!authToken ? <div><Navbar /><SignUp /></div> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authToken ? <div><Navbar /><Login /></div> : <Navigate to="/" />}
        />
        <Route
          path="/"
          element={<div><Navbar /><Products /></div>}
        />
        <Route path="/products" element={<div><Navbar /><Products /></div>} />
        <Route path="/sell" element={!authToken ? <div><Navbar /><Login /></div> : <div><Navbar /><Sell /></div>} />
        <Route path="/product/:id" element={<div><Navbar /><Product /></div>} />
        <Route path="/chat/:id" element={!authToken ? <div><Navbar /><Login /></div> : <div><Navbar /><Chat /></div>} />
        <Route path="/messages" element={!authToken ? <div><Navbar /><Login /></div> : <div><Navbar /><Messages /></div>} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;