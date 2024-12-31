import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext"

const Navbar = () => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate(); // Hook to navigate to different routes
  const location = useLocation(); // Hook to get the current location (current route)
  const [activeTab, setActiveTab] = useState("1"); // State to store the active tab key

  // Define an array of three tab items
  let login_label = "Login";
  let profile_label = "Guest";
  if (auth.id !== null) {
    login_label = "Logout"
    profile_label= auth.id;
  }

  const tabItems = [
    { label: "Chats", key: "1", link: "/" },
    { label: login_label, key: "3", link: "/login" },
    { label: "Register", key: "4", link: "/register" },
    // { label: profile_label, key: "2", link: "/settings", disabled: true },
  ];

  

  // Handle tab change to navigate to the corresponding route
  const onTabChange = (key) => {
    const tab = tabItems.find((item) => item.key === key);
    if (tab) {
      if (key === "3" || key ==="4") {
        localStorage.setItem("auth", JSON.stringify({ id: null, token: "" }));
        setAuth({
          ...auth,
          id: null,
          token: "",
        });
      }
      navigate(tab.link); // Navigate to the URL defined in `fn`
    }
  };

  // Set the active tab based on the current route
  useEffect(() => {
    const activeTab = tabItems.find((item) => item.link === location.pathname);
    if (activeTab) {
      setActiveTab(activeTab.key); // Update active tab key based on current route
    }
  }, [location, tabItems]);

  return (
    <>
    Hello {profile_label}!!
      <Tabs
        activeKey={activeTab} // Set the active tab using the activeTab state
        defaultActiveKey="1"
        centered
        items={tabItems}
        onChange={onTabChange} // Trigger `onTabChange` when a tab is clicked
      />
      
    </>
  );
};

export default Navbar;
