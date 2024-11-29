import React from 'react';
import '../assets/styles/Layout.css';

const Layout = ({ children, backgroundImage }) => {
  return (
    <div className="layout">
      <div
        className="layout__background"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>
      <div className="layout__content">{children}</div>
    </div>
  );
};

export default Layout;
