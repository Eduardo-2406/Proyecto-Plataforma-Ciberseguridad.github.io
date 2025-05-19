import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import PageTransition from '../animations/PageTransition';
import '../../styles/tailwind.css';

const Layout = () => {
  return (
    <div className="app">
      <Navbar />
      <div className="main-content">
        <div className="layout-content">
          <Sidebar />
          <PageTransition>
            <Outlet />
          </PageTransition>
        </div>
      </div>
    </div>
  );
};

export default Layout; 