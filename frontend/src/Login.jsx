import React,{useState} from "react";
import "./login.css";
import Layout from "./layout/Layout";
import axios from 'axios';

const Login = () => {
  // Move useState here
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault(); // Prevent default form submission behavior
    console.log(email);
    console.log(password);
    try {
      let response = await axios.post("http://localhost:5000/login", {
        email: email, // Send flat key-value pairs
        password: password,
      });
      console.log(response);
    } catch (error) {
      console.error("Error:", error);
    }
  }
  return (
    <Layout>
      <div className="f">
      <form className="login">
          <h1>Sign in</h1>
          <div className="ip">
            <span>Email</span>
            <input type="email" name="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Enter Email"></input>
            <span>Password</span>
            <input type="password" name="pass" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Enter Password"></input>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"></input>
            <span>Remember me</span>
          </div>
          <button onClick={handleSubmit} type="submit">submit</button>
      </form>
      </div>
    </Layout>
  );
};
export default Login;