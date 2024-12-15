import React from "react";
import Navbar from "../Navbar";

const Layout = ({ children }) => {
  const screenStyles = {
    // display: "flex", // Create a horizontal flex container
    // minHeight: "100vh", // Ensure the layout spans the full viewport height
  };

  const navbarStyles = {
    // minHeight: "100vh", // Full height for the navbar
    width: "100vw", // Set a fixed width for the navbar
    position: "sticky", // Sticky positioning to make it stick
    top: 0, // Required for sticky positioning
    backgroundColor: "#f8f9fa", // Example background color
    boxShadow: "2px 0 5px rgba(0,0,0,0.1)", // Optional shadow for better visibility
  };

  const contentStyles = {
    // flexGrow: 1, // Let the content area take up the remaining space
    padding: "20px", // Add some padding for the content
  };

  return (
    <div className="screen" style={screenStyles}>
      <div className="navbar" style={navbarStyles}>
        <Navbar />
      </div>
      <div className="content" style={contentStyles}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
