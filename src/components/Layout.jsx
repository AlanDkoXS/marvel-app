import React from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/Layout.css";
import headerImage from "../assets/image/header.png";

const Layout = ({ children, backgroundImage }) => {
  const navigate = useNavigate();

  const handleHeaderClick = () => {
    navigate("/");
  };

  return (
    <div className="layout">
      <header className="layout__header" onClick={handleHeaderClick}>
        <img src={headerImage} alt="Header" />
      </header>
      <div className="layout__background-container">
        <div
          className="layout__background"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        ></div>
        <div className="layout__overlay"></div> {/* Capa con el degradado */}
      </div>
      <div className="layout__content">{children}</div>
    </div>
  );
};

export default Layout;
