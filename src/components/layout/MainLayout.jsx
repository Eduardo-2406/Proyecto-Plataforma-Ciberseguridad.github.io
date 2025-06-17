import React, { useState, lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import LoginModal from '../auth/LoginModal';
import ProgressSkeleton from '../common/ProgressSkeleton';
import '../../styles/MainLayout.css';

const Progress = lazy(() => import('../Progress'));

const MainLayout = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSidebarDrawerOpen, setIsSidebarDrawerOpen] = useState(false);

  const handleOpenLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleToggleSidebar = () => {
    setIsSidebarDrawerOpen((prev) => !prev);
  };

  return (
    <div className="main-layout">
      <Navbar onOpenLoginModal={handleOpenLoginModal} onToggleSidebar={handleToggleSidebar} isSidebarOpen={isSidebarDrawerOpen} />
      <div className="layout-container">
        <Sidebar isDrawerOpen={isSidebarDrawerOpen} onCloseDrawer={() => setIsSidebarDrawerOpen(false)} setSidebarDrawerOpen={setIsSidebarDrawerOpen} />
        <div className="layout-content">
          <main className="main-content">
            <Suspense fallback={<ProgressSkeleton />}>
              <Outlet />
            </Suspense>
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