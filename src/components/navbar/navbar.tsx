import React, { useState, useEffect, useRef } from 'react';
import '../../css/navbar.css';
import logo from '../../assets/logonavbar.jpg';
import usuario from '../../assets/usuario.png';
import menu from '../../assets/menu.jpg';
import { FaCalendarAlt } from 'react-icons/fa';

import { FaTachometerAlt, FaFolderOpen } from 'react-icons/fa';

interface NavbarProps {
  username: string;
}

const Navbar: React.FC<NavbarProps> = ({ username }) => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarInteractive, setIsSidebarInteractive] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Cargar la opción activa desde localStorage al montar
  useEffect(() => {
    const storedItem = localStorage.getItem('sidebarActiveItem');
    if (storedItem) {
      setActiveItem(storedItem);
    }
  }, []);

  const handleUserButtonClick = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const handleMenuButtonClick = () => {
    const opening = !isSidebarOpen;
    setIsSidebarOpen(opening);

    if (opening) {
      setTimeout(() => setIsSidebarInteractive(true), 300);
    } else {
      setIsSidebarInteractive(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('ultimaActividad');
    localStorage.removeItem('username');
    window.location.href = '/';
  };

  // 👇 Deslogueo solo al cerrar la pestaña (no en recarga)
  useEffect(() => {
    const onPageHide = (event: PageTransitionEvent) => {
      if (!event.persisted) {
        setTimeout(() => {
          if (document.visibilityState === 'hidden') {
            localStorage.removeItem('token');
            localStorage.removeItem('ultimaActividad');
            localStorage.removeItem('username');
          }
        }, 50);
      }
    };

    window.addEventListener('pagehide', onPageHide);
    return () => {
      window.removeEventListener('pagehide', onPageHide);
    };
  }, []);

  const handleSidebarItemClick = (item: string, path: string) => {
    setActiveItem(item);
    localStorage.setItem('sidebarActiveItem', item);
    setIsSidebarOpen(false);
    setIsSidebarInteractive(false);
    window.location.href = path;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <img src={logo} alt="Logo Estudio Romano" className="navbar-logo" />
        </div>
        <div className="navbar-right" ref={userDropdownRef}>
          <button className="user-button" onClick={handleUserButtonClick}>
            <img src={usuario} alt="Usuario" className="usuario-logo" />
          </button>
          <div className={`user-dropdown ${isUserDropdownOpen ? 'open' : ''}`}>
            <p><strong>Usuario: </strong> {username}</p>
            <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button>
          </div>
          <button className="menu-button" onClick={handleMenuButtonClick}>
            <img src={menu} alt="Menú" className="menu-logo" />
          </button>
        </div>
      </nav>

      {!isSidebarOpen && (
        <div className="sidebar-handle" onClick={handleMenuButtonClick}></div>
      )}

      <div className={`sidebar ${isSidebarOpen ? 'open' : ''} ${isSidebarInteractive ? 'interactive' : ''}`}>
        <ul>
          <li
            className={activeItem === 'dashboard' ? 'active' : ''}
            onClick={() => handleSidebarItemClick('dashboard', '/dashboard')}
          >
            <FaTachometerAlt className="sidebar-icon" />
            {isSidebarOpen && (
              <span className="dropdown-title">Dashboard</span>
            )}
          </li>
          <li
            className={activeItem === 'expedientes' ? 'active' : ''}
            onClick={() => handleSidebarItemClick('expedientes', '/expedientes')}
          >
            <FaFolderOpen className="sidebar-icon" />
            {isSidebarOpen && (
              <span className="dropdown-title">Expedientes</span>
            )}
          </li>
          {/* <li
            className={activeItem === 'googleCalendar' ? 'active' : ''}
            onClick={() => handleSidebarItemClick('googleCalendar', '/oauth2callback')}
          >
            <FaCalendarAlt className="sidebar-icon" />
            {isSidebarOpen && <span className="dropdown-title">Google Calendar</span>}
          </li> */}
        </ul>
      </div>

      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => {
            setIsSidebarOpen(false);
            setIsSidebarInteractive(false);
          }}
        />
      )}
    </>
  );
};

export default Navbar;
