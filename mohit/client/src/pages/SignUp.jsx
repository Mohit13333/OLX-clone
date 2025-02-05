import "./auth.css";
import React, { useState } from 'react';
import axios from "axios";
import { useAuth } from '../contexts/AuthProvider';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();
  const { setAuthToken } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://olx-clone-fwgz.onrender.com/user/signup", {
        name,
        email,
        password,
        mobile,
      });
      console.log(response);
      setAuthToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert("Email already exists");
      } else {
        console.error("Error during signup", error);
      }
    }
  };

  return (
    <div className="signup-container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit} className="signup-form">
        <label htmlFor='name'>Name</label>
        <input
          name='name'
          id='name'
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label htmlFor='email'>Email</label>
        <input
          name='email'
          id='email'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor='password'>Password</label>
        <input
          name='password'
          id='password'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label htmlFor='mobile'>Mobile</label>
        <input
          name='mobile'
          id='mobile'
          type='text'
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
        <button type='submit'>Sign Up</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default SignUp;