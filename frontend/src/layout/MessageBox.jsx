import React , {useState, useEffect, useRef} from 'react'
import { Tabs } from 'antd';
import { Col, Row } from "antd";
import { io } from 'socket.io-client';
import { useAuth } from '../context/authContext';


const dummyPeople = Array.from({ length: 20 }, (_, personIndex) => {
  const personName = `Person_${personIndex + 1}`;

  return {
    name: personName,
    id : personIndex + 1,
    messages: Array.from({ length: 40 }, (__, messageIndex) => ({
      sender: messageIndex % 2 === 0 ? personName : "me", // Alternating sender
      message: `This is message ${messageIndex + 1} from ${
        messageIndex % 2 === 0 ? personName : "me"
      }`,
    })),
  };
});





const MessageBox = () => {
  
  // let [socket, setSocket ] = useSocket();
  // const socket = makeSocket();
  // console.log(socket);
  
  // const socket = useRef(io("http://localhost:5000"));
  const socketRef = useRef(null);

  const tabData = [
    { label: "ALL", key: "1", content: "all-chats" },
    { label: "UNREAD", key: "2", content: "unread-chats" },
    { label: "ARCHIEVED", key: "3", content: "archieved-chats" },
  ];

  const initialAllChats = [{ _id: "tutorial", username: "TUTORIAL" }];
  const initialMessages = [{sender:"tutorial", message:"the tutorial text will come here"}]

  const [activeTab, setActiveTab] = useState(tabData[0]); /// left section (to select the active tab among :{all, unread, archieved})
  const [allChats, setAllChats] = useState(initialAllChats);/// middle section (has the users we chatted with and a tutorial profile)
  const [activeChat, setActiveChat] = useState(initialAllChats[0]);/// right section-heading (has the user whose chats we need to show)
  const [messages, setMessages] = useState(initialMessages);/// right section-content (has the messages with the selected user)
  const [input, setInput] = useState("");/// right section- input(to handle input for sending message)
  

  const onTabChange = (key) => {
    /// left section (to select the active tab among :{all, unread, archieved})
    const tab = tabData.find((item) => item.key === key);
    if (tab) {
      setActiveTab(tab); //// write the logic to navigate
    }
  };

  const onChatChange = (key) => {
    /// middle section (has the users we chatted with and a tutorial profile)
    const chat = allChats.find((item) => item._id === key);

    console.log(`current chat:`, chat);
    if (chat) setActiveChat(chat);

    if (chat._id === "tutorial") {
      setMessages(initialMessages);
      return;
    }

    socketRef.current.emit("get-initial-messages", chat._id);
    // console.log(chat._id);
  };

  // Initialize the socket connection in useEffect
  const [auth] = useAuth();
  useEffect(() => {
    // Create the socket instance once 
    socketRef.current = io("http://localhost:5000",
      {
        auth : {id:auth.id},
      }
    );

    // Log connection
    socketRef.current.on("connect", () => {
      console.log("Connected to server:", socketRef.current.id);
    });

    // Listen for messages from the server
    socketRef.current.on("message", (msg) => {
      console.log("Message from server:", msg);
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socketRef.current.on("get-initial-messages", (msgs) => {
      console.log("initial messages from server:", msgs);
      setMessages((prevMessages) => msgs);
    });


    // get all-chats from the server
    socketRef.current.emit('all-chats', auth.id);
     
    socketRef.current.on('all-chats',(chats)=>{
      console.log(chats);//// here i am getting  "all-chats
      setAllChats([initialAllChats[0], ...chats]);   
    })

    // Clean up the socket connection when the component unmounts
    return () => {
      socketRef.current.disconnect();
      console.log("Socket disconnected");
    };
  }, []); // Empty dependency array ensures this runs only once

  const sendMessage = () => {
    console.log(`The input message: ${input}`);
    // Emit the message to the server

    if (socketRef.current) {
      const data = {sender_id:auth.id, message : input, receiver_id:activeChat._id};
      socketRef.current.emit("message", data);
    }
    // setMessages((prev) => [...prev, { sender_id: auth.id, message: input }]);///
    setInput("");
  };
  
  return (
    <Row style={{ height: "100vh", overflow: "hidden" }}>
      {/* Sidebar : Left Column: Non-scrollable */}
      <Col
        span={3}
        style={{
          height: "100vh",
          backgroundColor: "#e0e0e0",
          // padding: "10px",
          // display: "flex",
          // alignItems: "center",
          // justifyContent: "center",
        }}
      >
        <Tabs
          style={{
            minHeight: "100vh",
            position: "sticky",
            left: "0",
          }}
          onChange={onTabChange}
          activeKey={activeTab.key}
          defaultActiveKey="1" // Set the default active tab
          tabPosition="left" // Position the tabs on the left
          items={tabData.map((item) => ({
            label: item.label, // The tab label
            key: item.key, // Unique key for each tab
          }))}
        />
      </Col>

      {/* People : Middle Column: Scrollable */}
      <Col
        span={7}
        style={{
          overflowY: "scroll",
          overflowX: "hidden",
          height: "100vh",
          backgroundColor: "#f5f5f5",
          padding: "10px",
        }}
      >
        <h3 style={{ display: "block", textAlign: "center" }}>
          {activeTab.content}
        </h3>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start", // Aligns the Tabs to the right
            width: "100%",
          }}
        >
          <Tabs
            style={{}}
            activeKey={activeChat._id}
            onChange={onChatChange}
            // defaultActiveKey="1" // Set the default active tab
            tabPosition="right" // Position the tabs on the left
            items={allChats.map((item) => ({
              label: item.username, // The tab label
              key: item._id, // Unique key for each tab
            }))}
          />
        </div>
      </Col>

      {/* Chats with the person : Right Column: Scrollable */}
      <Col
        span={14}
        style={{
          overflowY: "scroll",
          height: "100vh",
          backgroundColor: "#f0f0f0",
          padding: "10px",
          borderLeft: "solid black 1px",
        }}
      >
        <h3 style={{ display: "block", textAlign: "center" }}>
          {activeChat.username}
        </h3>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message"
          style={{ marginRight: "10px" }}
        />
        <button onClick={sendMessage}>Send</button>
        <div>
          {messages.map((message, index) => {
            const msgStyle = {
              display: "flex",
              // border: "solid black 1px",
              padding: "5px",
              margin: "10px",
              justifyContent: "flex-start",
            };

            const msgItemStyle = {
              border: "solid black 1px",
              padding: "10px",
              borderRadius: "0px 0px 15px 0px",
              backgroundColor: "#ffffff",
              color: "#333333",
            };

            if (message.sender_id === auth.id) {
              msgStyle.justifyContent = "flex-end";
              msgItemStyle.backgroundColor = "#d1e7fd";
              msgItemStyle.borderRadius = "0px 0px 0px 15px";
              msgItemStyle.color = "#333333";
            }

            return (
              <div key={index} style={msgStyle}>
                <div style={msgItemStyle}> {message.message}</div>
              </div>
            );
          })}
        </div>
        {/* 63 */}
      </Col>
    </Row>
  );};

export default MessageBox;
