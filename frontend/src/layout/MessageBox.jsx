import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useImmer } from "use-immer";
import { Tabs } from "antd";
import { Col, Row } from "antd";
import { io } from "socket.io-client";
import { useAuth } from "../context/authContext";
import './input.css';


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
  const [friend_id,setId] = useState("")
  function handleClick(e) {
    e.preventDefault();
    const user_id = p.id;
    p.socketRef.current.emit("add-friend",{friend_id},{user_id})
    setId("");
  }
  const renderContent = ()=>{
    if(p.activeTab.key==4){
      return (
        <div>
          <h3 style={{ textAlign: "center" }}>Add new Friends</h3>
          <form>
            <input
              name="friends"
              style={{ margin: "1vh"  }}
              value={friend_id}
              onChange={(e) => {
                setId(e.target.value);
              }}
              placeholder="Search by email-id"
              type="email"
            ></input>
            <button
              style={{ margin: "1vh", width:"fit-content" }}
              type="submit"
              onClick={handleClick}
            >
              Add friend
            </button>
          </form>
        </div>
      );
    }
    return (
      <div>
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
            items={p.allChats.map((item) => {
              if (item.unread_messages){
                return {
                  label: `${item.username}  (${item.unread_messages})`, // The tab label
                  key: item._id, // Unique key for each tab
                };
              } else{
                return {
                  label: `${item.username}`, // The tab label
                  key: item._id, // Unique key for each tab
                };
              }

            })}
          />
        </div>
        
      </div>
    );
  };


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
    {renderContent()}
  </Col>
)};

const LastSeenComponent = (props)=> {
  return (<> {props.lastSeen}</>)
}


const MessageBox = () => {
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  };

  const tabData = [
    { label: "ALL CHATS", key: "1", content: "ALL-CHATS" },
    // { label: "UNREAD", key: "2", content: "unread-chats" },
    // { label: "ARCHIEVED", key: "3", content: "archieved-chats" },  
    {label: "ADD FRIENDS", key: "4", content: "ADD-FRIENDS"},
  ];  

  const initialAllChats = [{ _id: "tutorial", username: "TUTORIAL", unread_messages:0 }];
  const initialMessages = [
    { sender: "tutorial", message: "the tutorial text will come here" },
  ];

  const [activeTab, setActiveTab] = useState(tabData[0]); /// left section (to select the active tab among :{all, unread, archieved, add-friends})
  const [allChats, setAllChats] = useImmer(initialAllChats); /// middle section (has the {users we chatted with and a tutorial profile} or {the dashboard to add-friends})
  const [activeChat, setActiveChat] = useState(initialAllChats[0]); /// right section-heading (has the user whose chats we need to show)
  const activeChatRef = useRef(activeChat._id);
  const [messages, setMessages] = useImmer(initialMessages); /// right section-content (has the messages with the selected user)
  const [input, setInput] = useState(""); /// right section- input(to handle input for sending message)
  const [lastSeen, setLastSeen] = useImmer("")
  


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
    
    // console.log(`current chat:`, chat);
    if (chat) setActiveChat(chat);

    if (chat._id === "tutorial") {
      setMessages(initialMessages);
      return;
    }
    
    socketRef.current.emit("get-initial-messages", chat._id);
  };

  const sendMessage = (e) => {
    e.preventDefault();

    // console.log(`The input message: ${input}`);
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
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    activeChatRef.current = activeChat._id;
  }, [activeChat]);




  // Initialize the socket connection in useEffect
  const [auth] = useAuth();
  useEffect(() => {
    // Create the socket instance once
    socketRef.current = io("https://quicktalk-backend-ofyc.onrender.com", {
      auth: { id: auth.id },
    });

   
    socketRef.current.on("connect", () => {
      // console.log("Connected to server:", socketRef.current.id);
    });

    // Listen for messages from the server
    socketRef.current.on("message", (msg) => {
      
      if (msg.success ) {
        // console.log("Message from server:", msg);
        
        const sender_id = msg.data.sender_id;
        if (sender_id === activeChatRef.current || sender_id === auth.id ){
          setMessages((prevMessages) => {prevMessages.push(msg.data)});
        } else{
          alert(`${sender_id} sent you a message`); 
          (async()=>{/// updates unread message in db
            let response = await axios.post("https://quicktalk-backend-ofyc.onrender.com/api/db/user/user-contacts/unread-messages", {
            _id: auth.id, // Send flat key-value pairs
            friend_id: sender_id,
          });
      // console.log(response.data.message);
      

          })();
          setAllChats(allChats =>{
            let target_chat = allChats.find((chat) => chat._id === sender_id);
            // console.log(target_chat);
            
            if (target_chat){
              target_chat.unread_messages++;
            } else{
              allChats.push({_id : sender_id,username:sender_id, unread_messages:1})
            }
          })
        }
      } else {
        alert("You may have some unread message");
        
      }
    });

    socketRef.current.on("get-initial-messages", (msgs) => {
      if (msgs.success) {
        // console.log("received the past messages from server:");

      
        setAllChats((allChats) => {
          let target_chat = allChats.find(
            (chat) => chat._id === activeChatRef.current
          );
          if (target_chat) {
            target_chat.unread_messages = 0;
            // console.log("reseted the unread_messages");
          } else {
          }
        });
        
        setMessages((prevMessages) => msgs.data);
        
      } else {
        alert("failed to receive the past messages");
      }
    });

    // get all-chats from the server
    socketRef.current.emit("all-chats", auth.id);

    socketRef.current.on("all-chats", (chats) => {
      if (chats.success) {
        // console.log("received all chats from server", chats.data);
        setAllChats(chats.data);
      } else {
        alert("failed to receive all-chats from server");
      }
    });

    socketRef.current.on("friend-added", async (message)=>{
      // console.log(message.message)
      if(message.message === "added"){
        socketRef.current.emit("all-chats", auth.id);
        setActiveTab(tabData[0]);

      }
      else if(message.message === "exists"){
        alert("your friend is already connected with you");
      }
      else if(message.message === "yourself"){
        alert("Cannot add yourself!");
      }
      else{
        alert("your friend doesn't use our website");
      }

    })

    socketRef.current.on("last-seen", (data) => {
    // console.log(data);
    if (data._id === activeChatRef.current) {
      setLastSeen(data.lastSeen);
    }
  });

    // Clean up the socket connection when the component unmounts
    return () => {
      socketRef.current.disconnect();
      // console.log("Socket disconnected");
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
        socketRef={socketRef}
        id={auth.id}
      />

      {/* Chats with the person : Right Column: Scrollable */}
      <Col
        span={14}
        style={{
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
        <div className="container">
          <div className="msg-class" ref={messagesEndRef}>
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
          <form onSubmit={sendMessage} className="ip-bt">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message"
            />
            <button type="submit">Send</button>
          </form>
        </div>
        {/* 63 */}
      </Col>
    </Row>
  );
};

export default MessageBox;
