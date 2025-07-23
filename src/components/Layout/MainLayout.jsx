import React from 'react';
import Header from '../UI/Header';
import Sidebar from '../UI/Sidebar';

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <div className="layout-content">
        <main>{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;