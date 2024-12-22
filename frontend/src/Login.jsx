import React,{useState} from "react";
import "./login.css";
import Layout from "./layout/Layout";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import {useAuth} from "./context/authContext";

const Login = () => {
  // Move useState here
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();


  async function handleSubmit(e) {
    e.preventDefault(); // Prevent default form submission behavior
    // console.log(email);
    // console.log(password);
    try {
      let response = await axios.post("http://localhost:5000/api/auth/login", {
        email: email, // Send flat key-value pairs
        password: password,
      });
      console.log(response.data.success);

      if (response.data.success){
        alert(response.data.message);
        setAuth({
          ...auth,
          id:email,
          token:"",
        });

        localStorage.setItem("auth", JSON.stringify({id:email, token:""}));
        navigate('/')
        
      } else{
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  }
  return (
    <Layout>
      <div className="f">
        <form className="login">
          <h1>Sign in</h1>
          <div className="ip">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email"
              required
            ></input>
            <span>Password</span>
            <input
              type="password"
              name="pass"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              required
            ></input>
          </div>
          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              value=""
              id="flexCheckDefault"
            ></input>
            <span>Remember me</span>
          </div>
          <button onClick={handleSubmit} type="submit">
            submit
          </button>
        </form>
      </div>
    </Layout>
  );
};
export default Login;