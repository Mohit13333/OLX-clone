import "./auth.css"
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../contexts/AuthProvider'

const Login = () => {

    const navigate=useNavigate()

    const {authToken, setAuthToken}=useAuth()

    const [mobile, setMobile]=useState("")
    const [password, setPassword]=useState("")

    const handleSubmit=async(e)=>{
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8081/user/login", {
                mobile,
                password
            });
            console.log(response);
            if(!response.data.token){
                alert("mobile or password didn't match")
            }
            setAuthToken(response.data.token)
            localStorage.setItem("token", response.data.token);
            if(response.ok){
                navigate("/")
            }
        } catch (error) {
                console.error("Error during login", error);
        }
    }
    
  return (
    <div>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
            <label htmlFor='mobile'>Mobile</label>
            <input name='mobile' id='mobile' type='text' required value={mobile} onChange={(e)=>{setMobile(e.target.value)}} />
            <label htmlFor='password'>Password</label>
            <input name='password' id='password' type='text' required value={password} onChange={(e)=>{setPassword(e.target.value)}} />
            <input type='submit' value="Login" />
        </form>
        <p>Not have an account, <Link to="/signup">Register</Link></p>
    </div>
  )
}

export default Login