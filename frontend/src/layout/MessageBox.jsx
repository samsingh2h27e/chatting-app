import React , {useState, useEffect} from 'react'
import { Tabs } from 'antd';
import { Col, Row } from "antd";
import { Color } from 'antd/es/color-picker';





// const MyTabs = () => {
//   // Define the array of elements you want to display in the tabs
//   const tabData = [
//     { label: "ALL",key:"1",   content: "/all-chats" },
//     { label: "UNREAD",key:"2",  content: "unread-chats" },
//     { label: "ARCHIEVED",key:"3",  content: "archieved-chats" },
//   ];

  

//   return (
    
//       <Tabs
//         style={{
//           minHeight: "100vh",
//           position: "sticky",
//           left: "0",
//         }}
//         defaultActiveKey="1" // Set the default active tab
//         tabPosition="left" // Position the tabs on the left
//         items={tabData.map((item) => ({
//           label: item.label, // The tab label
//           key: item.key, // Unique key for each tab
//         }))}
//       />
    
//   );
// };



// const dummyPeople = [
//   {
//     name: "A",
//     messages: [
//       {
//         sender: this.name,
//         message: "hii",
//       },
//       {
//         sender: "me",
//         message: "hello there",
//       },
//       {
//         sender: "me",
//         message: "What made you text me",
//       },
//     ],
//   },
// ];

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

  const tabData = [
    { label: "ALL", key: "1", content: "all-chats" },
    { label: "UNREAD", key: "2", content: "unread-chats" },
    { label: "ARCHIEVED", key: "3", content: "archieved-chats" },
  ];

  const [activeTab, setActiveTab] = useState(tabData[0]);
  const [activeChat, setActiveChat] = useState(dummyPeople[0]);

  const onTabChange = (key) => {
    const tab = tabData.find((item) => item.key === key);
    if (tab) {
      setActiveTab(tab); // Navigate to the URL defined in `fn`
    }
  };

  const onChatChange = (key) => {
    const chat = dummyPeople.find((item) => item.id === key);
    if (chat) {
      setActiveChat(chat); // Navigate to the URL defined in `fn`
    }
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
            activeKey={activeChat.id}
            onChange={onChatChange}
            defaultActiveKey="1" // Set the default active tab
            tabPosition="right" // Position the tabs on the left
            items={dummyPeople.map((item) => ({
              label: item.name, // The tab label
              key: item.id, // Unique key for each tab
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
          {activeChat.name}
        </h3>
        <div>
          {activeChat.messages.map((message, index) => {
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

            if (message.sender === "me") {
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
      </Col>
    </Row>
  );};

export default MessageBox;
