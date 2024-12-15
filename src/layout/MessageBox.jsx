import React from 'react'
import { Tabs } from 'antd';




const MyTabs = () => {
  // Define the array of elements you want to display in the tabs
  const tabData = [
    { label: "Home",key:"1",   content: "Welcome to the Home Tab" },
    { label: "Profile",key:"2",  content: "Here is your Profile Tab" },
    { label: "Settings",key:"3",  content: "Manage your Settings here" },
  ];

  return (
    <Tabs
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
    <div>
      <MyTabs/>
    </div>
  )
}

export default MessageBox;
