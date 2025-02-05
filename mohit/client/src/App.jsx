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
    <>
      <div style={styles.container}>
        <Navbar />
        <main style={styles.main}>
          <Routes>
            <Route
              path="/signup"
              element={!authToken ? <SignUp /> : <Navigate to="/" />}
            />
            <Route
              path="/login"
              element={!authToken ? <Login /> : <Navigate to="/" />}
            />
            <Route path="/" element={<Products />} />
            <Route path="/products" element={<Products />} />
            <Route
              path="/sell"
              element={authToken ? <Sell /> : <Navigate to="/login" />}
            />
            <Route path="/product/:id" element={<Product />} />
            <Route
              path="/chat/:id"
              element={authToken ? <Chat /> : <Navigate to="/login" />}
            />
            <Route
              path="/messages"
              element={authToken ? <Messages /> : <Navigate to="/login" />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default App;

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    maxWidth: "1280px",
    margin: "0 auto",
  },
  main: {
    flexGrow: 1,
  },
};
