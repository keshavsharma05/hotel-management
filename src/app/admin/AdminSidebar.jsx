import { useNavigate, NavLink } from 'react-router-dom';
import { 
  RiDashboardLine, 
  RiHotelBedLine, 
  RiCalendarCheckLine, 
  RiHome4Line, 
  RiLogoutBoxRLine, 
  RiArrowLeftSLine,
  RiShieldUserLine
} from 'react-icons/ri';
import { MdQrCodeScanner } from 'react-icons/md';
import { useAuth } from '../../services/AuthContext';
import './AdminSidebar.css';

const AdminSidebar = ({ isCollapsed, onToggle }) => {
  const { adminLogout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    adminLogout();
    navigate(`/`);
  };

  return (
    <aside className={`admin-sidebar-minimal ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Sleek Flush Circle Toggle Button */}
      <button 
        className={`sidebar-toggle-btn-minimal ${isCollapsed ? 'collapsed' : ''}`} 
        onClick={onToggle}
        aria-label="Toggle Sidebar"
      >
        <RiArrowLeftSLine className="toggle-arrow-icon" />
      </button>

      {/* Brand Header */}
      <div className="sidebar-brand-minimal">
        <div className="brand-emblem">
          <img 
            src="/images/hotel-property/logo.png" 
            alt="Logo" 
            className="brand-logo-img" 
          />
        </div>
        {!isCollapsed && (
          <div className="brand-text-minimal">
            <span className="brand-title">COZY INN</span>
            <span className="brand-subtitle">Management</span>
          </div>
        )}
      </div>
      
      <div className="brand-divider-minimal"></div>

      {/* Navigation */}
      <nav className="sidebar-nav-minimal">
        <NavLink 
          to={`/admin`} 
          end 
          className={({ isActive }) => isActive ? 'nav-item-minimal active' : 'nav-item-minimal'}
        >
          <RiDashboardLine className="nav-icon" /> 
          {!isCollapsed && <span className="nav-label">Dashboard</span>}
        </NavLink>
        <NavLink 
          to={`/admin/rooms`} 
          className={({ isActive }) => isActive ? 'nav-item-minimal active' : 'nav-item-minimal'}
        >
          <RiHotelBedLine className="nav-icon" /> 
          {!isCollapsed && <span className="nav-label">Rooms</span>}
        </NavLink>
        <NavLink 
          to={`/admin/bookings`} 
          className={({ isActive }) => isActive ? 'nav-item-minimal active' : 'nav-item-minimal'}
        >
          <RiCalendarCheckLine className="nav-icon" /> 
          {!isCollapsed && <span className="nav-label">Bookings</span>}
        </NavLink>
        <NavLink 
          to={`/admin/scan-qr`} 
          className={({ isActive }) => isActive ? 'nav-item-minimal active' : 'nav-item-minimal'}
        >
          <MdQrCodeScanner className="nav-icon" /> 
          {!isCollapsed && <span className="nav-label">Check-In Scanner</span>}
        </NavLink>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer-minimal">
        {/* User profile */}
        <div className={`user-card-minimal ${isCollapsed ? 'collapsed' : ''}`}>
          <div className="user-avatar-minimal">
            <RiShieldUserLine />
            <span className="status-dot-minimal"></span>
          </div>
          {!isCollapsed && (
            <div className="user-details-minimal">
              <span className="user-name">Admin Portal</span>
              <span className="user-role">System Root</span>
            </div>
          )}
        </div>

        <div className="footer-links-minimal">
          <NavLink to={`/`} className="nav-item-minimal back-site-btn">
            <RiHome4Line className="nav-icon" /> 
            {!isCollapsed && <span className="nav-label">View Live Site</span>}
          </NavLink>
          
          <button className="logout-btn-minimal" onClick={handleLogout}>
            <RiLogoutBoxRLine className="nav-icon" /> 
            {!isCollapsed && <span className="nav-label">Sign Out</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
