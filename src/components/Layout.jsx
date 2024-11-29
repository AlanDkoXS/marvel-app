import React from 'react';
import '../assets/styles/Layout.css'; // Asegúrate de que tus estilos estén importados correctamente

const Layout = ({ children, backgroundImage }) => {
  return (
    <div className="layout">
      <div className="layout__background" style={{ backgroundImage: `url(${backgroundImage})` }}></div>
      <div className="layout__content">
        {children}
      </div>
    </div>
  );
};

export default Layout;
