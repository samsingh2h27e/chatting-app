import React from "react";
import Register from './register';
import {BrowserRouter,  Routes, Route } from "react-router-dom"
import Login from './Login';
import Home from "./Home";
function App() {
    // return <Register />
    // return <Login></Login>

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}></Route>
                <Route path="/login" element={<Login/>}></Route>
                <Route path="/register" element={<Register/>}></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App;