import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import './AdminLayout.css';

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`admin-container-v3 ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      <AdminSidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
      <main className="admin-content-v3">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
