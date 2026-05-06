import { useNavigate, NavLink } from 'react-router-dom';
import { RiDashboardLine, RiHotelBedLine, RiCalendarCheckLine, RiHome4Line, RiLogoutBoxRLine, RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { useAuth } from '../../services/AuthContext';
import { useHotel } from '../../services/HotelContext';
import './AdminSidebar.css';

const AdminSidebar = ({ isCollapsed, onToggle }) => {
  const { adminLogout } = useAuth();
  const { hotelId, currentHotel } = useHotel();
  const navigate = useNavigate();

  const handleLogout = () => {
    adminLogout();
    navigate(`/`);
  };

  return (
    <aside className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {currentHotel?.heroImage && (
        <>
          <div 
            className="sidebar-bg-image" 
            style={{ backgroundImage: `url(${currentHotel.heroImage})` }}
          ></div>
          <div className="sidebar-bg-overlay"></div>
        </>
      )}

      <button className="sidebar-toggle-v2" onClick={onToggle}>
        {isCollapsed ? <RiArrowRightSLine /> : <RiArrowLeftSLine />}
      </button>

      <div className="admin-logo">
        {isCollapsed ? '✦' : (currentHotel?.name?.toUpperCase() || 'HOTEL')}
        {!isCollapsed && <span>MANAGEMENT PORTAL</span>}
      </div>
      <div className="admin-logo-divider"></div>

      <nav className="admin-nav">
        <NavLink to={`/admin`} end className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
          <RiDashboardLine /> {!isCollapsed && <span>Dashboard</span>}
        </NavLink>
        <NavLink to={`/admin/rooms`} className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
          <RiHotelBedLine /> {!isCollapsed && <span>Manage Rooms</span>}
        </NavLink>
        <NavLink to={`/admin/bookings`} className={({ isActive }) => isActive ? 'admin-nav-item active' : 'admin-nav-item'}>
          <RiCalendarCheckLine /> {!isCollapsed && <span>Manage Bookings</span>}
        </NavLink>
      </nav>

      <div className="admin-footer-links">
        <NavLink to={`/`} className="admin-nav-item">
          <RiHome4Line /> {!isCollapsed && <span>Back to Site</span>}
        </NavLink>
        <button className="admin-logout" onClick={handleLogout}>
          <RiLogoutBoxRLine /> {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;

