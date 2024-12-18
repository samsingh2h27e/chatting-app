import React from 'react'
// import Navbar from "./Navbar"
import Layout from "./layout/Layout"
import Notloggedin from './layout/Notloggedin';
import MessageBox from './layout/MessageBox';

const Home = () => {

  const isLoggedIn = true;
  return (

    <Layout>

      { isLoggedIn ? <MessageBox/> : <Notloggedin/>}
       
       
    </Layout>
)
}

export default Home;
