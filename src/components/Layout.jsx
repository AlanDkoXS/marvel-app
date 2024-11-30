import React from "react";
import "../assets/styles/Layout.css";
import headerImage from "../assets/image/header.png";

const Layout = ({ children, backgroundImage }) => {
  return (
    <div className="layout">
      <header className="layout__header">
        <img src={headerImage} alt="Header" />
      </header>
      <div
        className="layout__background"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>
      <div className="layout__content">{children}</div>
    </div>
  );
};

export default Layout;
