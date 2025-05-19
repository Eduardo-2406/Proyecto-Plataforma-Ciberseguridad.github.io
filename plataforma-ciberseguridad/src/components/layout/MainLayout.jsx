import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import LoginModal from '../auth/LoginModal';
import '../../styles/MainLayout.css';

const MainLayout = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleOpenLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <div className="main-layout">
      <Navbar onOpenLoginModal={handleOpenLoginModal} />
      <div className="layout-container">
        <Sidebar />
        <div className="layout-content">
          <main className="main-content">
            <Outlet />
          </main>
        </div>
      </div>
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={handleCloseLoginModal} 
      />
    </div>
  );
};

export default MainLayout;