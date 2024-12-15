import React from 'react'
import { Tabs } from 'antd';




const MyTabs = () => {
  // Define the array of elements you want to display in the tabs
  const tabData = [
    { label: "ALL",key:"1",   content: "/all-chats" },
    { label: "UNREAD",key:"2",  content: "unread-chats" },
    { label: "ARCHIEVED",key:"3",  content: "archieved-chats" },
  ];

  

  return (
    
      <Tabs
        style={{
          minHeight: "100vh",
          position: "sticky",
          left: "0",
        }}
        defaultActiveKey="1" // Set the default active tab
        tabPosition="left" // Position the tabs on the left
        items={tabData.map((item) => ({
          label: item.label, // The tab label
          key: item.key, // Unique key for each tab
        }))}
      />
    
  );
};





const MessageBox = () => {
  return (
    <div style={{ display: "flex", height: "100vh", position: "relative" }}>
      <div style={{ position: "sticky", top: 0}}>
        <MyTabs />
      </div>
      <div style={{ overflowY:"scroll",  padding: "0.5vw" }}>
        
      </div>
    </div>
  );
};

export default MessageBox;
