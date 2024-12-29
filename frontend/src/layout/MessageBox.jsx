import React, { useState, useEffect, useRef } from "react";
import { useImmer } from "use-immer";
import { Tabs } from "antd";
import { Col, Row } from "antd";
import { io } from "socket.io-client";
import { useAuth } from "../context/authContext";

const LeftTabsMenu = (props) => {
  return (
    <Col
      span={3}
      style={{
        height: "100vh",
        backgroundColor: "#e0e0e0",
      }}
    >
      <Tabs
        style={{
          minHeight: "100vh",
          position: "sticky",
          left: "0",
        }}
        onChange={props.onTabChange}
        activeKey={props.activeTab.key}
        defaultActiveKey="1" // Set the default active tab
        tabPosition="left" // Position the tabs on the left
        items={props.tabData.map((item) => ({
          label: item.label, // The tab label
          key: item.key, // Unique key for each tab
        }))}
      />
    </Col>
  );
};

const AllChatsMenu = (p)=>{
  return (
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
      {p.activeTab.content}
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
        activeKey={p.activeChat._id}
        onChange={p.onChatChange}
        // defaultActiveKey="1" // Set the default active tab
        tabPosition="right" // Position the tabs on the left
        items={p.allChats.map((item) => ({
          label: item.username, // The tab label
          key: item._id, // Unique key for each tab
        }))}
      />
    </div>
  </Col>
)};

const LastSeenComponent = (props)=> {
  return (<> {props.lastSeen}</>)
}


const MessageBox = () => {
  const socketRef = useRef(null);

  const tabData = [
    { label: "ALL", key: "1", content: "all-chats" },
    { label: "UNREAD", key: "2", content: "unread-chats" },
    { label: "ARCHIEVED", key: "3", content: "archieved-chats" },
  ];

  const initialAllChats = [{ _id: "tutorial", username: "TUTORIAL" }];
  const initialMessages = [
    { sender: "tutorial", message: "the tutorial text will come here" },
  ];

  const [activeTab, setActiveTab] = useState(tabData[0]); /// left section (to select the active tab among :{all, unread, archieved})
  const [allChats, setAllChats] = useState(initialAllChats); /// middle section (has the users we chatted with and a tutorial profile)
  const [activeChat, setActiveChat] = useState(initialAllChats[0]); /// right section-heading (has the user whose chats we need to show)
  const [messages, setMessages] = useImmer(initialMessages); /// right section-content (has the messages with the selected user)
  const [input, setInput] = useState(""); /// right section- input(to handle input for sending message)
  const [lastSeen, setLastSeen] = useImmer("")
  const activeChatRef = useRef(activeChat._id);


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
  };

  const sendMessage = () => {
    console.log(`The input message: ${input}`);
    // Emit the message to the server

    if (socketRef.current) {
      const data = {
        sender_id: auth.id,
        message: input,
        receiver_id: activeChat._id,
      };
      socketRef.current.emit("message", data);
    }
    // setMessages((prev) => [...prev, { sender_id: auth.id, message: input }]);///
    setInput("");
  };

  useEffect(() => {
    activeChatRef.current = activeChat._id;
  }, [activeChat]);


  // Initialize the socket connection in useEffect
  const [auth] = useAuth();
  useEffect(() => {
    // Create the socket instance once
    socketRef.current = io("http://localhost:5000", {
      auth: { id: auth.id },
    });

   
    socketRef.current.on("connect", () => {
      console.log("Connected to server:", socketRef.current.id);
    });

    // Listen for messages from the server
    socketRef.current.on("message", (msg) => {
      
      if (msg.success ) {
        console.log("Message from server:", msg);
        
        const sender_id = msg.data.sender_id;
        if (sender_id === activeChatRef._id || sender_id === auth.id ){
          setMessages((prevMessages) => {prevMessages.push(msg.data)});
        } else{
          alert(`${sender_id} sent you a message`);
        }
      } else {
        alert("unable to send message");
      }
    });

    socketRef.current.on("get-initial-messages", (msgs) => {
      if (msgs.success) {
        console.log("received the past messages from server:");
        
        setMessages((prevMessages) => msgs.data);
      } else {
        alert("failed to receive the past messages");
      }
    });

    // get all-chats from the server
    socketRef.current.emit("all-chats", auth.id);

    socketRef.current.on("all-chats", (chats) => {
      if (chats.success) {
        console.log("received all chats from server", chats.data);
        setAllChats([initialAllChats[0], ...chats.data]);
      } else {
        alert("failed to receive all-chats from server");
      }
    });

    socketRef.current.on("last-seen", (data) => {
    console.log(data);
    if (data._id === activeChatRef.current) {
      setLastSeen(data.lastSeen);
    }
  });

    // Clean up the socket connection when the component unmounts
    return () => {
      socketRef.current.disconnect();
      console.log("Socket disconnected");
    };
  }, []); // Empty dependency array ensures this runs only once

  
  return (
    <Row style={{ height: "100vh", overflow: "hidden" }}>
      {/* Sidebar : Left Column: Non-scrollable */}
      <LeftTabsMenu
        tabData={tabData}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />

      {/* People : Middle Column: Scrollable */}
      <AllChatsMenu
        activeTab={activeTab}
        allChats={allChats}
        activeChat={activeChat}
        onChatChange={onChatChange}
      />

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
        <div style={{ display: "block", display:"flex", justifyContent:"space-between", borderBottom:"5px groove "}}>
          <h2>{activeChat.username}</h2>
          <h4><LastSeenComponent lastSeen={lastSeen}/></h4>
        </div>
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
  );
};

export default MessageBox;
