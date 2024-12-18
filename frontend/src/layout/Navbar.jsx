import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate(); // Hook to navigate to different routes
  const location = useLocation(); // Hook to get the current location (current route)
  const [activeTab, setActiveTab] = useState("1"); // State to store the active tab key

  // Define an array of three tab items
  const tabItems = [
    { label: "Chats", key: "1", fn: "/" },
    { label: "Register", key: "2", fn: "/register" },
    { label: "Login", key: "3", fn: "/login" },
    { label: "Settings", key: "4", fn: "/settings" },
  ];

  // Handle tab change to navigate to the corresponding route
  const onTabChange = (key) => {
    const tab = tabItems.find((item) => item.key === key);
    if (tab) {
      navigate(tab.fn); // Navigate to the URL defined in `fn`
    }
  };

  // Set the active tab based on the current route
  useEffect(() => {
    const activeTab = tabItems.find((item) => item.fn === location.pathname);
    if (activeTab) {
      setActiveTab(activeTab.key); // Update active tab key based on current route
    }
  }, [location, tabItems]);

  return (
    <Tabs
      activeKey={activeTab} // Set the active tab using the activeTab state
      defaultActiveKey="1"
      centered
      items={tabItems}
      onChange={onTabChange} // Trigger `onTabChange` when a tab is clicked
    />
  );
};

export default Navbar;
