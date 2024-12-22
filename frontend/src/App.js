import React from "react";
import Register from './register';
import {BrowserRouter,  Routes, Route } from "react-router-dom";
import Login from './Login';
import Home from "./Home";
import Layout from './layout/Layout'
import Notloggedin from "./layout/Notloggedin";
import {useAuth} from './context/authContext'

function App() {
    const [auth, setAuth] = useAuth();
    let isLoggedIn = (auth.id !== null)

   

    return (
      <BrowserRouter>
        <Routes>

          {/* conditional rendering depending on whether the user is logged in or not */}
          {isLoggedIn && (
            <>
              <Route path="/" element={<Home />}></Route>
              <Route path="/settings" element={<Notloggedin />}></Route>
            </>
          )}

          {!isLoggedIn && (
            <>
              <Route path="/" element={<Notloggedin />}></Route>
              <Route path="/settings" element={<Notloggedin />}></Route>
            </>
          )}
          <Route path="/test" element={<Layout />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
        </Routes>
      </BrowserRouter>
    );
}

export default App;