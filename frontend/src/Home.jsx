import React from 'react'
// import Navbar from "./Navbar"
import Layout from "./layout/Layout"
import Notloggedin from './layout/Notloggedin';
import MessageBox from './layout/MessageBox';
import { SocketProvider } from './context/socketIoContext';

const Home = () => {

  
  return (
    <Layout>
      <SocketProvider>
        <MessageBox/>
      </SocketProvider>
    </Layout>
  );
}

export default Home;
