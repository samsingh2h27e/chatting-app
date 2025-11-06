import React,{use, useState} from "react";
import './register.css';
import Layout from "./layout/Layout";
import axios from 'axios';
import { useNavigate, useLocation } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [f_name,setName] = useState("");
    const [l_name,setLname] = useState("");
    const [age,setAge] = useState();
    const [cnf,setCnf] = useState("");

    async function handleSubmit(e) {
      e.preventDefault();
      if(cnf !== password){
        
        alert("Register failed because password is not matching."); 
        return;
      } // Prevent default form submission behavior
      try {
        let response = await axios.post("https://quicktalk-backend-ofyc.onrender.com/api/auth/register", {
          email: email, // Send flat key-value pairs
          password: password,
          fname: f_name,
          lname: l_name,
          age: age
        });
        // console.log(response.data.success);

        if (response.data.success){
          navigate('/login');
        } else {
          
          alert(response.data.message);
          navigate("/register");

        }
      } catch (error) {
        
        console.error("Error:", error);
        alert("Some error occured at the backend");

      }
    }
  
  return (
  <Layout>
    <div className="f">
      <form className="register">
          <h1>Register</h1>
          <div className="ip">
            <span>Email</span>
            <input type="email" name="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Enter your Email"></input>
            <span>First_Name</span>
            <input type="text" name="fname" value={f_name} onChange={(e)=>setName(e.target.value)} placeholder="Enter your Name"></input>
            <span>Last_Name</span>
            <input type="text" name="lname" value={l_name} onChange={(e)=>setLname(e.target.value)} placeholder="Enter your Surname"></input>
            <span>Age</span>
            <input type="number" name="age" value={age} onChange={(e)=>setAge(e.target.value)} placeholder="Enter your correct age"></input>
            <span>Password</span>
            <input type="password" name="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Enter a strong password"></input>
            <span>Confirm Password</span>
            <input type="password" name="cnf_password" value={cnf} onChange={(e)=>setCnf(e.target.value)} placeholder="confime your password"></input>
          </div>
          <button className="bt" onClick={handleSubmit}>Submit</button>
      </form>
      </div>
  </Layout>
);
};
export default Register;